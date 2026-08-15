-- Shows employees together with their employment and account details.
-- Admin accounts are excluded.
CREATE VIEW vw_employee_directory AS
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    u.working_status,
    e.employment_id,
    e.role AS job_title,
    f.farm_name,
    e.salary,
    e.hire_date,
    e.employment_status,
    a.account_id,
    a.username,
    a.account_status,
    a.role AS account_role
FROM app_user u
LEFT JOIN employment e ON e.user_id = u.user_id
LEFT JOIN farm f ON f.farm_id = e.farm_id
LEFT JOIN user_account a ON a.user_id = u.user_id
WHERE a.role IS NULL OR a.role <> 'ADMIN';


-- Shows accounts that are waiting to be activated as employees.
CREATE VIEW vw_pending_account_activations AS
SELECT
    a.account_id,
    a.username,
    a.account_status,
    u.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone_number,
    a.created_at AS account_created_at
FROM user_account a
JOIN app_user u ON a.user_id = u.user_id
LEFT JOIN employment e ON e.user_id = u.user_id
WHERE a.account_status = 'INACTIVE'
  AND e.employment_id IS NULL
  AND a.role <> 'ADMIN';


-- Gives a simple summary of each sale, including the customer,
-- employee who made the sale and number of items.
CREATE VIEW vw_sale_summary AS
SELECT
    s.sale_id,
    s.public_id,
    s.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    s.employment_id,
    CONCAT(u.first_name, ' ', u.last_name) AS sold_by_name,
    s.sale_date,
    s.total,
    s.sale_status,
    (SELECT COUNT(*) FROM sale_item si WHERE si.sale_id = s.sale_id) AS item_count,
    s.is_voided,
    s.is_voided_at,
    s.voided_reason,
    CONCAT(voider.first_name, ' ', voider.last_name) AS voided_by_name
FROM sale s
LEFT JOIN customer c ON s.customer_id = c.customer_id
JOIN employment e ON s.employment_id = e.employment_id
JOIN app_user u ON e.user_id = u.user_id
LEFT JOIN app_user voider ON s.voided_by = voider.user_id;


-- Shows payment information together with the related sale and customer.
CREATE VIEW vw_payment_ledger AS
SELECT
    p.payment_id,
    p.public_id,
    s.public_id AS sale_public_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    p.amount,
    p.payment_method,
    p.payment_status,
    p.payment_date
FROM payment p
JOIN sale s ON p.sale_id = s.sale_id
LEFT JOIN customer c ON s.customer_id = c.customer_id;


-- Provides an overview of each farm, including crops, employees,
-- equipment and monthly payroll.
CREATE VIEW vw_farm_overview AS
SELECT
    f.farm_id,
    f.farm_name,
    f.location,
    f.size,
    f.farm_status,
    (SELECT COUNT(*) FROM crop c WHERE c.farm_id = f.farm_id) AS crop_count,
    (SELECT COUNT(*) FROM employment e
     WHERE e.farm_id = f.farm_id
       AND e.employment_status = 'ACTIVE') AS active_employee_count,
    (SELECT COUNT(*) FROM equipment eq
     WHERE eq.farm_id = f.farm_id) AS equipment_count,
    (SELECT COALESCE(SUM(e.salary), 0) FROM employment e
     WHERE e.farm_id = f.farm_id
       AND e.employment_status = 'ACTIVE') AS monthly_payroll
FROM farm f;


-- Shows the current inventory and marks items with 50 or less
-- as low stock.
CREATE VIEW vw_inventory_status AS
SELECT
    i.inventory_id,
    i.item_name,
    i.quantity,
    i.unit,
    i.storage_location,
    f.farm_name,
    h.harvest_date,
    h.quality_grade,
    (i.quantity <= 50) AS is_low_stock
FROM inventory i
JOIN harvest h ON i.harvest_id = h.harvest_id
JOIN crop cr ON h.crop_id = cr.crop_id
JOIN farm f ON cr.farm_id = f.farm_id;


-- Shows attendance records with the employee and farm names.
CREATE VIEW vw_attendance_log AS
SELECT
    at.attendance_id,
    CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
    f.farm_name,
    at.attendance_date,
    at.check_in,
    at.check_out,
    at.attendance_status
FROM attendance at
JOIN employment e ON at.employment_id = e.employment_id
JOIN app_user u ON e.user_id = u.user_id
JOIN farm f ON e.farm_id = f.farm_id;


-- Shows crop disease records together with the crop, farm and disease names.
CREATE VIEW vw_crop_disease_report AS
SELECT
    cd.crop_disease_id,
    cr.crop_name,
    cr.crop_variety,
    f.farm_name,
    d.disease_name,
    cd.detected_date,
    cd.severity,
    cd.treatment
FROM crop_disease cd
JOIN crop cr ON cd.crop_id = cr.crop_id
JOIN farm f ON cr.farm_id = f.farm_id
JOIN disease d ON cd.disease_id = d.disease_id;