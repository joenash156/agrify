DELIMITER //

CREATE TRIGGER trg_payment_after_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    DECLARE paid_amount DECIMAL(12,2);
    DECLARE sale_total DECIMAL(12,2);

    IF NEW.payment_status = 'CONFIRMED' THEN
        SELECT COALESCE(SUM(amount), 0)
        INTO paid_amount
        FROM payment
        WHERE sale_id = NEW.sale_id
          AND payment_status = 'CONFIRMED';

        SELECT total
        INTO sale_total
        FROM sale
        WHERE sale_id = NEW.sale_id;

        IF paid_amount >= sale_total THEN
            UPDATE sale
            SET sale_status = 'PAID'
            WHERE sale_id = NEW.sale_id;
        ELSE
            UPDATE sale
            SET sale_status = 'PARTIALLY_PAID'
            WHERE sale_id = NEW.sale_id;
        END IF;
    END IF;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER trg_sale_item_before_insert
BEFORE INSERT ON sale_item
FOR EACH ROW
BEGIN
    DECLARE available_qty DECIMAL(12,2);

    SELECT quantity
    INTO available_qty
    FROM inventory
    WHERE inventory_id = NEW.inventory_id
    FOR UPDATE;

    IF available_qty IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Inventory item does not exist.';
    END IF;

    IF NEW.quantity > available_qty THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot sell more inventory than available.';
    END IF;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER trg_sale_item_after_insert
AFTER INSERT ON sale_item
FOR EACH ROW
BEGIN
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE inventory_id = NEW.inventory_id;

    INSERT INTO inventory_transaction (
        transaction_id,
        inventory_id,
        transaction_type,
        quantity
    )
    VALUES (
        UUID(),
        NEW.inventory_id,
        'OUT',
        NEW.quantity
    );
END//

DELIMITER ;