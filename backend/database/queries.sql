-- Top 5 best-selling inventory items by quantity sold
SELECT
    i.item_name,
    SUM(si.quantity) AS total_quantity_sold,
    SUM(si.subtotal) AS total_revenue
FROM sale_item si
JOIN inventory i ON si.inventory_id = i.inventory_id
JOIN sale s ON si.sale_id = s.sale_id
WHERE s.is_voided = FALSE
GROUP BY i.item_name
ORDER BY total_quantity_sold DESC
LIMIT 5;

-- Monthly revenue trend, most recent month first
SELECT
    DATE_FORMAT(sale_date, '%Y-%m') AS sale_month,
    COUNT(*) AS total_sales,
    SUM(total) AS total_revenue
FROM sale
WHERE is_voided = FALSE
GROUP BY sale_month
ORDER BY sale_month DESC;

-- Employees currently on leave or suspended
SELECT first_name, last_name, job_title, farm_name, employment_status
FROM vw_employee_directory
WHERE employment_status IN ('ON_LEAVE', 'SUSPENDED');

-- Unpaid or partially paid sales older than 7 days (collections follow-up list)
SELECT public_id, customer_name, sold_by_name, sale_date, total, sale_status
FROM vw_sale_summary
WHERE sale_status IN ('UNPAID', 'PARTIALLY_PAID')
  AND sale_date < (NOW() - INTERVAL 7 DAY)
  AND is_voided = FALSE
ORDER BY sale_date ASC;

-- Equipment that needs attention right now
SELECT equipment_name, equipment_type, farm_id, equipment_status
FROM equipment
WHERE equipment_status IN ('MAINTENANCE', 'BROKEN');

-- Crops expected to be ready for harvest within the next 14 days
SELECT crop_name, crop_variety, farm_id, expected_harvest_date,
       DATEDIFF(expected_harvest_date, CURDATE()) AS days_remaining
FROM crop
WHERE crop_status = 'GROWING'
  AND expected_harvest_date BETWEEN CURDATE() AND (CURDATE() + INTERVAL 14 DAY)
ORDER BY expected_harvest_date ASC;

-- Active monthly payroll per farm, highest first
SELECT farm_name, active_employee_count, monthly_payroll
FROM vw_farm_overview
ORDER BY monthly_payroll DESC;

-- Self-registered accounts still waiting on an admin to activate them
SELECT username, first_name, last_name, email, account_created_at
FROM vw_pending_account_activations
ORDER BY account_created_at ASC;

-- Disease severity breakdown across all farms
SELECT severity, COUNT(*) AS detection_count
FROM crop_disease
GROUP BY severity
ORDER BY FIELD(severity, 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- Inventory batches currently low on stock
SELECT item_name, quantity, unit, farm_name, storage_location
FROM vw_inventory_status
WHERE is_low_stock = TRUE
ORDER BY quantity ASC;
