CREATE TABLE app_user (
  user_id CHAR(36) PRIMARY KEY NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone_number VARCHAR(30) DEFAULT NULL,
  other_phone_number VARCHAR(30) DEFAULT NULL,
  working_status VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_app_user_email (email),
  CONSTRAINT chk_app_user_working_status CHECK (working_status IS NULL OR working_status IN ('ACTIVE','ON_LEAVE','SUSPENDED','TERMINATED')),
  CONSTRAINT chk_uuid_app_user_user_id CHECK (IS_UUID(user_id))
);


CREATE TABLE user_account (
  account_id CHAR(36) PRIMARY KEY NOT NULL,
  user_id CHAR(36) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  role VARCHAR(20) NOT NULL DEFAULT 'WORKER',
  refresh_token_hash VARCHAR(255) DEFAULT NULL,
  refresh_token_expires_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_account_refresh_hash (refresh_token_hash),
  CONSTRAINT fk_account_user FOREIGN KEY (user_id) REFERENCES app_user (user_id),
  CONSTRAINT chk_account_status CHECK (account_status IN ('ACTIVE','INACTIVE','SUSPENDED')),
  CONSTRAINT chk_account_role CHECK (role IN ('ADMIN','FARM_MANAGER','SALES_PERSON','WORKER')),
  CONSTRAINT chk_uuid_user_account_account_id CHECK (IS_UUID(account_id)),
  CONSTRAINT chk_uuid_user_account_user_id CHECK (IS_UUID(user_id))
);


CREATE TABLE farm (
  farm_id CHAR(36) PRIMARY KEY NOT NULL,
  farm_name VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  size DECIMAL(10,2) NOT NULL,
  farm_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_farm_size CHECK (size > 0),
  CONSTRAINT chk_farm_status CHECK (farm_status IN ('ACTIVE','SEASONAL','INACTIVE','FALLOW')),
  CONSTRAINT chk_uuid_farm_farm_id CHECK (IS_UUID(farm_id))
);


CREATE TABLE customer (
  customer_id CHAR(36) PRIMARY KEY NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(30) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  UNIQUE KEY uq_customer_email (email),
  CONSTRAINT chk_uuid_customer_customer_id CHECK (IS_UUID(customer_id))
);


CREATE TABLE employment (
  employment_id CHAR(36) PRIMARY KEY NOT NULL,
  user_id CHAR(36) NOT NULL,
  farm_id CHAR(36) NOT NULL,
  role VARCHAR(50) NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  hire_date DATE NOT NULL,
  employment_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  KEY idx_employment_user (user_id),
  KEY idx_employment_farm (farm_id),
  CONSTRAINT fk_employment_user FOREIGN KEY (user_id) REFERENCES app_user (user_id),
  CONSTRAINT fk_employment_farm FOREIGN KEY (farm_id) REFERENCES farm (farm_id),
  CONSTRAINT chk_salary CHECK (salary >= 0),
  CONSTRAINT chk_employment_status CHECK (employment_status IN ('ACTIVE','ON_LEAVE','SUSPENDED','TERMINATED')),
  CONSTRAINT chk_uuid_employment_employment_id CHECK (IS_UUID(employment_id)),
  CONSTRAINT chk_uuid_employment_user_id CHECK (IS_UUID(user_id)),
  CONSTRAINT chk_uuid_employment_farm_id CHECK (IS_UUID(farm_id))
);


CREATE TABLE attendance (
  attendance_id CHAR(36) PRIMARY KEY NOT NULL,
  employment_id CHAR(36) NOT NULL,
  attendance_date DATE NOT NULL,
  check_in TIME DEFAULT NULL,
  check_out TIME DEFAULT NULL,
  attendance_status VARCHAR(20) NOT NULL,
  UNIQUE KEY uq_attendance_employment_date (employment_id, attendance_date),
  CONSTRAINT fk_attendance_employment FOREIGN KEY (employment_id) REFERENCES employment (employment_id),
  CONSTRAINT chk_attendance_status CHECK (attendance_status IN ('PRESENT','ABSENT','LATE','LEAVE')),
  CONSTRAINT chk_uuid_attendance_attendance_id CHECK (IS_UUID(attendance_id)),
  CONSTRAINT chk_uuid_attendance_employment_id CHECK (IS_UUID(employment_id))
);


CREATE TABLE disease (
  disease_id CHAR(36) PRIMARY KEY NOT NULL,
  disease_name VARCHAR(100) NOT NULL,
  description VARCHAR(500) DEFAULT NULL,
  UNIQUE KEY uq_disease_name (disease_name),
  CONSTRAINT chk_uuid_disease_disease_id CHECK (IS_UUID(disease_id))
);


CREATE TABLE crop (
  crop_id CHAR(36) PRIMARY KEY NOT NULL,
  farm_id CHAR(36) NOT NULL,
  crop_name VARCHAR(80) NOT NULL,
  crop_variety VARCHAR(80) DEFAULT NULL,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE DEFAULT NULL,
  crop_status VARCHAR(20) NOT NULL DEFAULT 'GROWING',
  KEY idx_crop_farm (farm_id),
  CONSTRAINT fk_crop_farm FOREIGN KEY (farm_id) REFERENCES farm (farm_id),
  CONSTRAINT chk_crop_status CHECK (crop_status IN ('GROWING','READY','HARVESTED','DISEASED','DORMANT')),
  CONSTRAINT chk_uuid_crop_crop_id CHECK (IS_UUID(crop_id)),
  CONSTRAINT chk_uuid_crop_farm_id CHECK (IS_UUID(farm_id))
);


CREATE TABLE crop_disease (
  crop_disease_id CHAR(36) PRIMARY KEY NOT NULL,
  crop_id CHAR(36) NOT NULL,
  disease_id CHAR(36) NOT NULL,
  detected_date DATE NOT NULL,
  severity VARCHAR(20) NOT NULL,
  treatment VARCHAR(500) DEFAULT NULL,
  UNIQUE KEY uq_crop_disease (crop_id, disease_id),
  KEY idx_crop_disease_disease (disease_id),
  CONSTRAINT fk_crop_disease_crop FOREIGN KEY (crop_id) REFERENCES crop (crop_id),
  CONSTRAINT fk_crop_disease_disease FOREIGN KEY (disease_id) REFERENCES disease (disease_id),
  CONSTRAINT chk_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  CONSTRAINT chk_uuid_crop_disease_crop_disease_id CHECK (IS_UUID(crop_disease_id)),
  CONSTRAINT chk_uuid_crop_disease_crop_id CHECK (IS_UUID(crop_id)),
  CONSTRAINT chk_uuid_crop_disease_disease_id CHECK (IS_UUID(disease_id))
);


CREATE TABLE equipment (
  equipment_id CHAR(36) PRIMARY KEY NOT NULL,
  farm_id CHAR(36) NOT NULL,
  equipment_name VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(80) NOT NULL,
  purchase_date DATE DEFAULT NULL,
  purchase_cost DECIMAL(12,2) DEFAULT NULL,
  equipment_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  KEY idx_equipment_farm (farm_id),
  CONSTRAINT fk_equipment_farm FOREIGN KEY (farm_id) REFERENCES farm (farm_id),
  CONSTRAINT chk_equipment_cost CHECK (purchase_cost IS NULL OR purchase_cost >= 0),
  CONSTRAINT chk_equipment_status CHECK (equipment_status IN ('AVAILABLE','IN_USE','MAINTENANCE','BROKEN','RETIRED')),
  CONSTRAINT chk_uuid_equipment_equipment_id CHECK (IS_UUID(equipment_id)),
  CONSTRAINT chk_uuid_equipment_farm_id CHECK (IS_UUID(farm_id))
);


CREATE TABLE equipment_maintenance (
  maintenance_id CHAR(36) PRIMARY KEY NOT NULL,
  equipment_id CHAR(36) NOT NULL,
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(80) NOT NULL,
  cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  description VARCHAR(500) DEFAULT NULL,
  KEY idx_maintenance_equipment (equipment_id),
  CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id) REFERENCES equipment (equipment_id),
  CONSTRAINT chk_maintenance_cost CHECK (cost >= 0),
  CONSTRAINT chk_uuid_equipment_maintenance_maintenance_id CHECK (IS_UUID(maintenance_id)),
  CONSTRAINT chk_uuid_equipment_maintenance_equipment_id CHECK (IS_UUID(equipment_id))
);


CREATE TABLE equipment_usage (
  usage_id CHAR(36) PRIMARY KEY NOT NULL,
  equipment_id CHAR(36) NOT NULL,
  employment_id CHAR(36) NOT NULL,
  usage_date DATE NOT NULL,
  hours_used DECIMAL(8,2) NOT NULL,
  KEY idx_usage_equipment (equipment_id),
  KEY idx_usage_employment (employment_id),
  CONSTRAINT fk_usage_equipment FOREIGN KEY (equipment_id) REFERENCES equipment (equipment_id),
  CONSTRAINT fk_usage_employment FOREIGN KEY (employment_id) REFERENCES employment (employment_id),
  CONSTRAINT chk_hours_used CHECK (hours_used > 0),
  CONSTRAINT chk_uuid_equipment_usage_usage_id CHECK (IS_UUID(usage_id)),
  CONSTRAINT chk_uuid_equipment_usage_equipment_id CHECK (IS_UUID(equipment_id)),
  CONSTRAINT chk_uuid_equipment_usage_employment_id CHECK (IS_UUID(employment_id))
);


CREATE TABLE fertilizer (
  fertilizer_id CHAR(36) PRIMARY KEY NOT NULL,
  fertilizer_name VARCHAR(100) NOT NULL,
  fertilizer_type VARCHAR(80) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  UNIQUE KEY uq_fertilizer_name (fertilizer_name),
  CONSTRAINT chk_fertilizer_price CHECK (unit_price >= 0),
  CONSTRAINT chk_fertilizer_quantity CHECK (quantity >= 0),
  CONSTRAINT chk_uuid_fertilizer_fertilizer_id CHECK (IS_UUID(fertilizer_id))
);


CREATE TABLE fertilizer_application (
  application_id CHAR(36) PRIMARY KEY NOT NULL,
  crop_id CHAR(36) NOT NULL,
  employment_id CHAR(36) NOT NULL,
  fertilizer_id CHAR(36) NOT NULL,
  application_date DATE NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  notes VARCHAR(500) DEFAULT NULL,
  KEY idx_application_crop (crop_id),
  KEY idx_application_employment (employment_id),
  KEY idx_application_fertilizer (fertilizer_id),
  CONSTRAINT fk_application_crop FOREIGN KEY (crop_id) REFERENCES crop (crop_id),
  CONSTRAINT fk_application_employment FOREIGN KEY (employment_id) REFERENCES employment (employment_id),
  CONSTRAINT fk_application_fertilizer FOREIGN KEY (fertilizer_id) REFERENCES fertilizer (fertilizer_id),
  CONSTRAINT chk_application_quantity CHECK (quantity > 0),
  CONSTRAINT chk_uuid_fertilizer_application_application_id CHECK (IS_UUID(application_id)),
  CONSTRAINT chk_uuid_fertilizer_application_crop_id CHECK (IS_UUID(crop_id)),
  CONSTRAINT chk_uuid_fertilizer_application_employment_id CHECK (IS_UUID(employment_id)),
  CONSTRAINT chk_uuid_fertilizer_application_fertilizer_id CHECK (IS_UUID(fertilizer_id))
);


CREATE TABLE fertilizer_transaction (
  transaction_id CHAR(36) PRIMARY KEY NOT NULL,
  fertilizer_id CHAR(36) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_fert_transaction_fertilizer (fertilizer_id),
  CONSTRAINT fk_fert_transaction_fertilizer FOREIGN KEY (fertilizer_id) REFERENCES fertilizer (fertilizer_id),
  CONSTRAINT chk_fertilizer_transaction_type CHECK (transaction_type IN ('PURCHASE','USAGE','ADJUSTMENT')),
  CONSTRAINT chk_fertilizer_transaction_qty CHECK (quantity > 0),
  CONSTRAINT chk_uuid_fertilizer_transaction_transaction_id CHECK (IS_UUID(transaction_id)),
  CONSTRAINT chk_uuid_fertilizer_transaction_fertilizer_id CHECK (IS_UUID(fertilizer_id))
);


CREATE TABLE harvest (
  harvest_id CHAR(36) PRIMARY KEY NOT NULL,
  crop_id CHAR(36) NOT NULL,
  harvest_date DATE NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  quality_grade VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
  KEY idx_harvest_crop (crop_id),
  CONSTRAINT fk_harvest_crop FOREIGN KEY (crop_id) REFERENCES crop (crop_id),
  CONSTRAINT chk_harvest_quantity CHECK (quantity > 0),
  CONSTRAINT chk_harvest_grade CHECK (quality_grade IN ('PREMIUM','STANDARD','SUBSTANDARD')),
  CONSTRAINT chk_uuid_harvest_harvest_id CHECK (IS_UUID(harvest_id)),
  CONSTRAINT chk_uuid_harvest_crop_id CHECK (IS_UUID(crop_id))
);


CREATE TABLE inventory (
  inventory_id CHAR(36) PRIMARY KEY NOT NULL,
  harvest_id CHAR(36) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(20) NOT NULL DEFAULT 'kg',
  storage_location VARCHAR(150) DEFAULT NULL,
  KEY idx_inventory_harvest (harvest_id),
  CONSTRAINT fk_inventory_harvest FOREIGN KEY (harvest_id) REFERENCES harvest (harvest_id),
  CONSTRAINT chk_inventory_qty CHECK (quantity >= 0),
  CONSTRAINT chk_uuid_inventory_inventory_id CHECK (IS_UUID(inventory_id)),
  CONSTRAINT chk_uuid_inventory_harvest_id CHECK (IS_UUID(harvest_id))
);


CREATE TABLE inventory_transaction (
  transaction_id CHAR(36) PRIMARY KEY NOT NULL,
  inventory_id CHAR(36) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  transaction_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_inv_transaction_inventory (inventory_id),
  CONSTRAINT fk_inv_transaction_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (inventory_id),
  CONSTRAINT chk_inventory_transaction_type CHECK (transaction_type IN ('IN','OUT','ADJUSTMENT')),
  CONSTRAINT chk_inventory_transaction_qty CHECK (quantity > 0),
  CONSTRAINT chk_uuid_inventory_transaction_transaction_id CHECK (IS_UUID(transaction_id)),
  CONSTRAINT chk_uuid_inventory_transaction_inventory_id CHECK (IS_UUID(inventory_id))
);


CREATE TABLE sale (
  sale_id CHAR(36) PRIMARY KEY NOT NULL,
  sale_seq BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id VARCHAR(20) DEFAULT NULL,
  customer_id CHAR(36) DEFAULT NULL,
  employment_id CHAR(36) NOT NULL,
  sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  sale_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
  is_voided TINYINT(1) NOT NULL DEFAULT 0,
  is_voided_at DATETIME DEFAULT NULL,
  voided_reason VARCHAR(500) DEFAULT NULL,
  voided_by CHAR(36) DEFAULT NULL,
  UNIQUE KEY uq_sale_seq (sale_seq),
  KEY idx_sale_customer (customer_id),
  KEY idx_sale_employment (employment_id),
  KEY idx_sale_voided_by (voided_by),
  CONSTRAINT fk_sale_customer FOREIGN KEY (customer_id) REFERENCES customer (customer_id),
  CONSTRAINT fk_sale_employment FOREIGN KEY (employment_id) REFERENCES employment (employment_id),
  CONSTRAINT fk_sale_voided_by FOREIGN KEY (voided_by) REFERENCES app_user (user_id),
  CONSTRAINT chk_sale_total CHECK (total >= 0),
  CONSTRAINT chk_sale_status CHECK (sale_status IN ('UNPAID','PARTIALLY_PAID','PAID','CANCELLED')),
  CONSTRAINT chk_uuid_sale_sale_id CHECK (IS_UUID(sale_id)),
  CONSTRAINT chk_uuid_sale_customer_id CHECK (customer_id IS NULL OR IS_UUID(customer_id)),
  CONSTRAINT chk_uuid_sale_employment_id CHECK (IS_UUID(employment_id)),
  CONSTRAINT chk_uuid_sale_voided_by CHECK (voided_by IS NULL OR IS_UUID(voided_by))
);


CREATE TABLE sale_item (
  sale_item_id CHAR(36) PRIMARY KEY NOT NULL,
  sale_id CHAR(36) NOT NULL,
  inventory_id CHAR(36) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  KEY idx_sale_item_sale (sale_id),
  KEY idx_sale_item_inventory (inventory_id),
  CONSTRAINT fk_sale_item_sale FOREIGN KEY (sale_id) REFERENCES sale (sale_id),
  CONSTRAINT fk_sale_item_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (inventory_id),
  CONSTRAINT chk_sale_item_quantity CHECK (quantity > 0),
  CONSTRAINT chk_sale_item_price CHECK (unit_price >= 0),
  CONSTRAINT chk_sale_item_subtotal CHECK (subtotal >= 0),
  CONSTRAINT chk_uuid_sale_item_sale_item_id CHECK (IS_UUID(sale_item_id)),
  CONSTRAINT chk_uuid_sale_item_sale_id CHECK (IS_UUID(sale_id)),
  CONSTRAINT chk_uuid_sale_item_inventory_id CHECK (IS_UUID(inventory_id))
);


CREATE TABLE payment (
  payment_id CHAR(36) PRIMARY KEY NOT NULL,
  payment_seq BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  public_id VARCHAR(20) DEFAULT NULL,
  sale_id CHAR(36) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payment_seq (payment_seq),
  KEY idx_payment_sale (sale_id),
  CONSTRAINT fk_payment_sale FOREIGN KEY (sale_id) REFERENCES sale (sale_id),
  CONSTRAINT chk_payment_amount CHECK (amount > 0),
  CONSTRAINT chk_payment_status CHECK (payment_status IN ('PENDING','CONFIRMED','FAILED','REFUNDED')),
  CONSTRAINT chk_uuid_payment_payment_id CHECK (IS_UUID(payment_id)),
  CONSTRAINT chk_uuid_payment_sale_id CHECK (IS_UUID(sale_id))
);


CREATE TABLE notification (
  notification_id CHAR(36) PRIMARY KEY NOT NULL,
  user_id CHAR(36) NOT NULL,
  category VARCHAR(20) NOT NULL DEFAULT 'SYSTEM',
  title VARCHAR(150) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notification_user (user_id),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES app_user (user_id),
  CONSTRAINT chk_notification_category CHECK (category IN ('SALE','HARVEST','DISEASE','EQUIPMENT','ATTENDANCE','PAYMENT','SYSTEM')),
  CONSTRAINT chk_uuid_notification_notification_id CHECK (IS_UUID(notification_id)),
  CONSTRAINT chk_uuid_notification_user_id CHECK (IS_UUID(user_id))
);