DELIMITER //

CREATE PROCEDURE sp_record_sale_item(
    IN p_sale_id CHAR(36),
    IN p_inventory_id CHAR(36),
    IN p_quantity DECIMAL(12,2),
    IN p_unit_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_subtotal DECIMAL(12,2);

    SET v_subtotal = p_quantity * p_unit_price;

    INSERT INTO sale_item (sale_item_id, sale_id, inventory_id, quantity, unit_price, subtotal)
    VALUES (UUID(), p_sale_id, p_inventory_id, p_quantity, p_unit_price, v_subtotal);

    UPDATE sale
    SET total = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM sale_item
        WHERE sale_id = p_sale_id
    )
    WHERE sale_id = p_sale_id;
END//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE sp_activate_employee_account(
    IN p_account_id CHAR(36),
    IN p_farm_id CHAR(36),
    IN p_role VARCHAR(50),
    IN p_salary DECIMAL(12,2),
    IN p_hire_date DATE
)
BEGIN
    DECLARE v_user_id CHAR(36);
    DECLARE v_employment_id CHAR(36);

    SELECT user_id
    INTO v_user_id
    FROM user_account
    WHERE account_id = p_account_id;

    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No account found with that account_id.';
    END IF;

    SET v_employment_id = UUID();

    INSERT INTO employment (
        employment_id,
        user_id,
        farm_id,
        role,
        salary,
        hire_date,
        employment_status
    )
    VALUES (
        v_employment_id,
        v_user_id,
        p_farm_id,
        p_role,
        p_salary,
        p_hire_date,
        'ACTIVE'
    );

    UPDATE app_user
    SET working_status = 'ACTIVE'
    WHERE user_id = v_user_id;

    UPDATE user_account
    SET account_status = 'ACTIVE'
    WHERE account_id = p_account_id;
END//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE sp_farm_monthly_revenue(
    IN p_farm_id CHAR(36),
    IN p_year INT,
    IN p_month INT
)
BEGIN
    SELECT
        f.farm_name,
        COUNT(DISTINCT s.sale_id) AS total_sales,
        COALESCE(SUM(s.total), 0) AS total_revenue
    FROM farm f
    JOIN employment e ON e.farm_id = f.farm_id
    LEFT JOIN sale s ON s.employment_id = e.employment_id
        AND YEAR(s.sale_date) = p_year
        AND MONTH(s.sale_date) = p_month
        AND s.is_voided = FALSE
    WHERE f.farm_id = p_farm_id
    GROUP BY f.farm_name;
END//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE sp_low_stock_report(
    IN p_threshold DECIMAL(12,2)
)
BEGIN
    SELECT
        i.item_name,
        i.quantity,
        i.unit,
        f.farm_name,
        i.storage_location
    FROM inventory i
    JOIN harvest h ON i.harvest_id = h.harvest_id
    JOIN crop cr ON h.crop_id = cr.crop_id
    JOIN farm f ON cr.farm_id = f.farm_id
    WHERE i.quantity <= p_threshold
    ORDER BY i.quantity ASC;
END//

DELIMITER ;