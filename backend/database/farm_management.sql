-- --------------------------------------------------------
-- Agrify / Farm Management System
-- Full schema + seed data, written for MySQL 8.0 (also runs on MariaDB).
--
-- ID scheme: every primary key is a UUID-shaped CHAR(36) string, but the
-- first 8 hex characters are a fixed per-table prefix (10=farm, 11=app_user,
-- 12=employment, 13=disease, 14=crop, 15=crop_disease, 16=equipment,
-- 17=equipment_maintenance, 18=equipment_usage, 19=fertilizer,
-- 1a=fertilizer_application, 1b=fertilizer_transaction, 1c=harvest,
-- 1d=inventory, 1e=customer, 1f=sale, 20=sale_item, 21=payment,
-- 22=attendance, 23=notification) followed by a sequential suffix. This
-- keeps every foreign key traceable by eye while remaining a valid UUID
-- string (required — the Java layer binds these columns to java.util.UUID).
-- --------------------------------------------------------

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `farm_management`;
CREATE DATABASE `farm_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `farm_management`;

DROP TABLE IF EXISTS `notification`;
DROP TABLE IF EXISTS `payment`;
DROP TABLE IF EXISTS `sale_item`;
DROP TABLE IF EXISTS `sale`;
DROP TABLE IF EXISTS `inventory_transaction`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `harvest`;
DROP TABLE IF EXISTS `fertilizer_transaction`;
DROP TABLE IF EXISTS `fertilizer_application`;
DROP TABLE IF EXISTS `fertilizer`;
DROP TABLE IF EXISTS `equipment_usage`;
DROP TABLE IF EXISTS `equipment_maintenance`;
DROP TABLE IF EXISTS `equipment`;
DROP TABLE IF EXISTS `crop_disease`;
DROP TABLE IF EXISTS `crop`;
DROP TABLE IF EXISTS `disease`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `employment`;
DROP TABLE IF EXISTS `user_account`;
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `farm`;
DROP TABLE IF EXISTS `app_user`;

-- --------------------------------------------------------
-- app_user
-- --------------------------------------------------------
CREATE TABLE `app_user` (
  `user_id` CHAR(36) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone_number` VARCHAR(30) DEFAULT NULL,
  `other_phone_number` VARCHAR(30) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_app_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `app_user` (`user_id`, `first_name`, `last_name`, `email`, `phone_number`, `other_phone_number`) VALUES
('11000000-0000-0000-0000-000000000001', 'Kwame', 'Mensah', 'kwame.mensah@farm.com', '0240000001', '0200000001'),
('11000000-0000-0000-0000-000000000002', 'Ama', 'Owusu', 'ama.owusu@farm.com', '0240000002', '0200000002'),
('11000000-0000-0000-0000-000000000003', 'Kofi', 'Asare', 'kofi.asare@farm.com', '0240000003', '0200000003'),
('11000000-0000-0000-0000-000000000004', 'Akosua', 'Boateng', 'akosua.boateng@farm.com', '0240000004', '0200000004'),
('11000000-0000-0000-0000-000000000005', 'Yaw', 'Adjei', 'yaw.adjei@farm.com', '0240000005', '0200000005'),
('11000000-0000-0000-0000-000000000006', 'Abena', 'Frimpong', 'abena.frimpong@farm.com', '0240000006', '0200000006'),
('11000000-0000-0000-0000-000000000007', 'Kojo', 'Antwi', 'kojo.antwi@farm.com', '0240000007', '0200000007'),
('11000000-0000-0000-0000-000000000008', 'Efua', 'Darko', 'efua.darko@farm.com', '0240000008', '0200000008'),
('11000000-0000-0000-0000-000000000009', 'Kwesi', 'Ofori', 'kwesi.ofori@farm.com', '0240000009', '0200000009'),
('11000000-0000-0000-0000-000000000010', 'Adwoa', 'Asante', 'adwoa.asante@farm.com', '0240000010', '0200000010');

-- --------------------------------------------------------
-- user_account — JWT refresh token is stored only as a hash (never the raw
-- token). refresh_token_expires_at lets /api/auth/refresh reject stale
-- tokens without a second lookup.
-- --------------------------------------------------------
CREATE TABLE `user_account` (
  `account_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `account_status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  `role` VARCHAR(20) NOT NULL DEFAULT 'WORKER',
  `refresh_token_hash` VARCHAR(255) DEFAULT NULL,
  `refresh_token_expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `uq_user_account_user` (`user_id`),
  UNIQUE KEY `uq_user_account_username` (`username`),
  KEY `idx_user_account_refresh_hash` (`refresh_token_hash`),
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  CONSTRAINT `chk_account_status` CHECK (`account_status` IN ('ACTIVE','INACTIVE','SUSPENDED')),
  CONSTRAINT `chk_account_role` CHECK (`role` IN ('ADMIN','FARM_MANAGER','SALES_PERSON','WORKER'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Intentionally no seed rows here — demo accounts (admin + one per role) are
-- created on first application startup by AdminInitializer / DemoAccountInitializer
-- so passwords are always properly bcrypt-hashed by the app, never hand-written in SQL.

-- --------------------------------------------------------
-- farm
-- --------------------------------------------------------
CREATE TABLE `farm` (
  `farm_id` CHAR(36) NOT NULL,
  `farm_name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `size` DECIMAL(10,2) NOT NULL,
  `farm_status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`farm_id`),
  CONSTRAINT `chk_farm_size` CHECK (`size` > 0),
  CONSTRAINT `chk_farm_status` CHECK (`farm_status` IN ('ACTIVE','SEASONAL','INACTIVE','FALLOW'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `farm` (`farm_id`, `farm_name`, `location`, `size`, `farm_status`) VALUES
('10000000-0000-0000-0000-000000000001', 'Green Valley Farm', 'Kumasi', 120.50, 'ACTIVE'),
('10000000-0000-0000-0000-000000000002', 'Sunrise Agricultural Farm', 'Tamale', 200.00, 'ACTIVE'),
('10000000-0000-0000-0000-000000000003', 'Golden Harvest Farm', 'Accra', 85.75, 'SEASONAL'),
('10000000-0000-0000-0000-000000000004', 'Blue River Farm', 'Koforidua', 95.20, 'ACTIVE'),
('10000000-0000-0000-0000-000000000005', 'Peaceful Fields Farm', 'Ho', 110.40, 'FALLOW'),
('10000000-0000-0000-0000-000000000006', 'Northern Star Farm', 'Wa', 175.60, 'ACTIVE');

-- --------------------------------------------------------
-- customer
-- --------------------------------------------------------
CREATE TABLE `customer` (
  `customer_id` CHAR(36) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `phone_number` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `uq_customer_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `customer` (`customer_id`, `first_name`, `last_name`, `phone_number`, `email`, `address`) VALUES
('1e000000-0000-0000-0000-000000000001', 'Yaw', 'Boateng', '0241000001', 'yaw.boateng@gmail.com', 'Kumasi'),
('1e000000-0000-0000-0000-000000000002', 'Adwoa', 'Mensah', '0241000002', 'adwoa.mensah@gmail.com', 'Accra'),
('1e000000-0000-0000-0000-000000000003', 'Kwabena', 'Osei', '0241000003', 'kwabena.osei@gmail.com', 'Tamale'),
('1e000000-0000-0000-0000-000000000004', 'Akua', 'Frimpong', '0241000004', 'akua.frimpong@gmail.com', 'Sunyani'),
('1e000000-0000-0000-0000-000000000005', 'Kwadwo', 'Asante', '0241000005', 'kwadwo.asante@gmail.com', 'Cape Coast'),
('1e000000-0000-0000-0000-000000000006', 'Abigail', 'Owusu', '0241000006', 'abigail.owusu@gmail.com', 'Ho'),
('1e000000-0000-0000-0000-000000000007', 'Daniel', 'Addo', '0241000007', 'daniel.addo@gmail.com', 'Koforidua'),
('1e000000-0000-0000-0000-000000000008', 'Mabel', 'Amoah', '0241000008', 'mabel.amoah@gmail.com', 'Wa');

-- --------------------------------------------------------
-- employment
-- --------------------------------------------------------
CREATE TABLE `employment` (
  `employment_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `farm_id` CHAR(36) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `salary` DECIMAL(12,2) NOT NULL,
  `hire_date` DATE NOT NULL,
  `employment_status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`employment_id`),
  KEY `idx_employment_user` (`user_id`),
  KEY `idx_employment_farm` (`farm_id`),
  CONSTRAINT `fk_employment_user` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  CONSTRAINT `fk_employment_farm` FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_salary` CHECK (`salary` >= 0),
  CONSTRAINT `chk_employment_status` CHECK (`employment_status` IN ('ACTIVE','ON_LEAVE','SUSPENDED','TERMINATED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `employment` (`employment_id`, `user_id`, `farm_id`, `role`, `salary`, `hire_date`, `employment_status`) VALUES
('12000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Field Worker', 2200.00, '2025-01-20', 'ACTIVE'),
('12000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Sales Associate', 2400.00, '2025-01-25', 'ACTIVE'),
('12000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Field Worker', 2100.00, '2025-02-01', 'ACTIVE'),
('12000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Farm Manager', 4500.00, '2024-11-15', 'ACTIVE'),
('12000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Equipment Operator', 2800.00, '2025-02-10', 'ACTIVE'),
('12000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'Agricultural Officer', 3500.00, '2025-02-20', 'ON_LEAVE'),
('12000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Harvest Supervisor', 3000.00, '2025-03-01', 'ACTIVE'),
('12000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000005', 'Sales Associate', 2400.00, '2025-03-10', 'ACTIVE'),
('12000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000006', 'Field Worker', 2200.00, '2025-03-20', 'SUSPENDED'),
('12000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', 'Farm Manager', 4500.00, '2025-04-01', 'ACTIVE');

-- --------------------------------------------------------
-- attendance
-- --------------------------------------------------------
CREATE TABLE `attendance` (
  `attendance_id` CHAR(36) NOT NULL,
  `employment_id` CHAR(36) NOT NULL,
  `attendance_date` DATE NOT NULL,
  `check_in` TIME DEFAULT NULL,
  `check_out` TIME DEFAULT NULL,
  `attendance_status` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `uq_attendance_employment_date` (`employment_id`,`attendance_date`),
  CONSTRAINT `fk_attendance_employment` FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `chk_attendance_status` CHECK (`attendance_status` IN ('PRESENT','ABSENT','LATE','LEAVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attendance` (`attendance_id`, `employment_id`, `attendance_date`, `check_in`, `check_out`, `attendance_status`) VALUES
('22000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '2026-08-10', '07:55:00', '17:00:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000002', '2026-08-10', '08:00:00', '17:00:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000003', '2026-08-10', '08:30:00', '17:00:00', 'LATE'),
('22000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000004', '2026-08-10', '07:50:00', '17:00:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000005', '2026-08-10', NULL, NULL, 'ABSENT'),
('22000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000001', '2026-08-11', '07:58:00', '17:05:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000002', '2026-08-11', '08:02:00', '17:00:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000003', '2026-08-11', '07:55:00', '17:00:00', 'PRESENT'),
('22000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000006', '2026-08-10', NULL, NULL, 'LEAVE'),
('22000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000009', '2026-08-10', NULL, NULL, 'ABSENT');

-- --------------------------------------------------------
-- disease
-- --------------------------------------------------------
CREATE TABLE `disease` (
  `disease_id` CHAR(36) NOT NULL,
  `disease_name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`disease_id`),
  UNIQUE KEY `uq_disease_name` (`disease_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `disease` (`disease_id`, `disease_name`, `description`) VALUES
('13000000-0000-0000-0000-000000000001', 'Late Blight', 'Fungal disease causing dark lesions on leaves and fruit.'),
('13000000-0000-0000-0000-000000000002', 'Early Blight', 'Fungal disease causing circular spots on leaves.'),
('13000000-0000-0000-0000-000000000003', 'Leaf Spot', 'Disease causing spots and premature leaf loss.'),
('13000000-0000-0000-0000-000000000004', 'Powdery Mildew', 'White fungal growth on leaves and stems.'),
('13000000-0000-0000-0000-000000000005', 'Root Rot', 'Disease damaging roots in wet soil.'),
('13000000-0000-0000-0000-000000000006', 'Bacterial Wilt', 'Bacterial disease causing plant wilting.'),
('13000000-0000-0000-0000-000000000007', 'Downy Mildew', 'Disease affecting crop leaves.'),
('13000000-0000-0000-0000-000000000008', 'Black Rot', 'Bacterial disease affecting leaves and produce.');

-- --------------------------------------------------------
-- crop
-- --------------------------------------------------------
CREATE TABLE `crop` (
  `crop_id` CHAR(36) NOT NULL,
  `farm_id` CHAR(36) NOT NULL,
  `crop_name` VARCHAR(80) NOT NULL,
  `crop_variety` VARCHAR(80) DEFAULT NULL,
  `planting_date` DATE NOT NULL,
  `expected_harvest_date` DATE DEFAULT NULL,
  `crop_status` VARCHAR(20) NOT NULL DEFAULT 'GROWING',
  PRIMARY KEY (`crop_id`),
  KEY `idx_crop_farm` (`farm_id`),
  CONSTRAINT `fk_crop_farm` FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_crop_status` CHECK (`crop_status` IN ('GROWING','READY','HARVESTED','DISEASED','DORMANT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `crop` (`crop_id`, `farm_id`, `crop_name`, `crop_variety`, `planting_date`, `expected_harvest_date`, `crop_status`) VALUES
('14000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Tomato', 'Roma', '2026-01-10', '2026-04-10', 'HARVESTED'),
('14000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Maize', 'Obatanpa', '2026-02-01', '2026-06-01', 'HARVESTED'),
('14000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Pepper', 'Cayenne', '2026-01-20', '2026-05-20', 'READY'),
('14000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Cassava', 'Bankye Hemaa', '2025-12-10', '2026-08-10', 'GROWING'),
('14000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'Plantain', 'Apantu', '2025-11-15', '2026-07-15', 'GROWING'),
('14000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'Rice', 'Jasmine', '2026-01-25', '2026-06-25', 'HARVESTED'),
('14000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'Onion', 'Red Creole', '2026-02-05', '2026-05-05', 'HARVESTED'),
('14000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'Cabbage', 'Green Crown', '2026-01-18', '2026-04-18', 'DISEASED'),
('14000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'Groundnut', 'Chinese', '2026-01-30', '2026-05-30', 'HARVESTED'),
('14000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', 'Sweet Potato', 'Apomuden', '2026-01-05', '2026-05-05', 'DORMANT');

-- --------------------------------------------------------
-- crop_disease — surrogate PK (a crop can, in principle, have the same
-- disease recorded on two different dates), unique per (crop, disease).
-- --------------------------------------------------------
CREATE TABLE `crop_disease` (
  `crop_disease_id` CHAR(36) NOT NULL,
  `crop_id` CHAR(36) NOT NULL,
  `disease_id` CHAR(36) NOT NULL,
  `detected_date` DATE NOT NULL,
  `severity` VARCHAR(20) NOT NULL,
  `treatment` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`crop_disease_id`),
  UNIQUE KEY `uq_crop_disease` (`crop_id`,`disease_id`),
  KEY `idx_crop_disease_disease` (`disease_id`),
  CONSTRAINT `fk_crop_disease_crop` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`),
  CONSTRAINT `fk_crop_disease_disease` FOREIGN KEY (`disease_id`) REFERENCES `disease` (`disease_id`),
  CONSTRAINT `chk_severity` CHECK (`severity` IN ('LOW','MEDIUM','HIGH','CRITICAL'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `crop_disease` (`crop_disease_id`, `crop_id`, `disease_id`, `detected_date`, `severity`, `treatment`) VALUES
('15000000-0000-0000-0000-000000000001', '14000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', '2026-03-02', 'HIGH', 'Fungicide treatment'),
('15000000-0000-0000-0000-000000000002', '14000000-0000-0000-0000-000000000008', '13000000-0000-0000-0000-000000000003', '2026-03-14', 'MEDIUM', 'Remove affected leaves'),
('15000000-0000-0000-0000-000000000003', '14000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000006', '2026-03-05', 'CRITICAL', 'Quarantined section, agronomist review pending'),
('15000000-0000-0000-0000-000000000004', '14000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000002', '2026-03-03', 'LOW', 'Improved field drainage'),
('15000000-0000-0000-0000-000000000005', '14000000-0000-0000-0000-000000000009', '13000000-0000-0000-0000-000000000008', '2026-03-10', 'MEDIUM', 'Crop rotation planned');

-- --------------------------------------------------------
-- equipment
-- --------------------------------------------------------
CREATE TABLE `equipment` (
  `equipment_id` CHAR(36) NOT NULL,
  `farm_id` CHAR(36) NOT NULL,
  `equipment_name` VARCHAR(100) NOT NULL,
  `equipment_type` VARCHAR(80) NOT NULL,
  `purchase_date` DATE DEFAULT NULL,
  `purchase_cost` DECIMAL(12,2) DEFAULT NULL,
  `equipment_status` VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  PRIMARY KEY (`equipment_id`),
  KEY `idx_equipment_farm` (`farm_id`),
  CONSTRAINT `fk_equipment_farm` FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_equipment_cost` CHECK (`purchase_cost` IS NULL OR `purchase_cost` >= 0),
  CONSTRAINT `chk_equipment_status` CHECK (`equipment_status` IN ('AVAILABLE','IN_USE','MAINTENANCE','BROKEN','RETIRED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `equipment` (`equipment_id`, `farm_id`, `equipment_name`, `equipment_type`, `purchase_date`, `purchase_cost`, `equipment_status`) VALUES
('16000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'John Deere Tractor', 'Tractor', '2025-01-05', 85000.00, 'AVAILABLE'),
('16000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Massey Ferguson Tractor', 'Tractor', '2025-02-10', 78000.00, 'IN_USE'),
('16000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Honda Water Pump', 'Water Pump', '2025-03-12', 6500.00, 'AVAILABLE'),
('16000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Irrigation Pump', 'Irrigation', '2025-04-15', 12000.00, 'MAINTENANCE'),
('16000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'Rotary Tiller', 'Tiller', '2025-05-20', 18000.00, 'BROKEN'),
('16000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'Rice Transplanter', 'Planter', '2025-06-05', 32000.00, 'AVAILABLE'),
('16000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'Knapsack Sprayer', 'Sprayer', '2025-06-18', 1800.00, 'AVAILABLE'),
('16000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'Grain Harvester', 'Harvester', '2019-09-01', 65000.00, 'RETIRED');

-- --------------------------------------------------------
-- equipment_maintenance
-- --------------------------------------------------------
CREATE TABLE `equipment_maintenance` (
  `maintenance_id` CHAR(36) NOT NULL,
  `equipment_id` CHAR(36) NOT NULL,
  `maintenance_date` DATE NOT NULL,
  `maintenance_type` VARCHAR(80) NOT NULL,
  `cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `description` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`maintenance_id`),
  KEY `idx_maintenance_equipment` (`equipment_id`),
  CONSTRAINT `fk_maintenance_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  CONSTRAINT `chk_maintenance_cost` CHECK (`cost` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `equipment_maintenance` (`maintenance_id`, `equipment_id`, `maintenance_date`, `maintenance_type`, `cost`, `description`) VALUES
('17000000-0000-0000-0000-000000000001', '16000000-0000-0000-0000-000000000001', '2026-01-10', 'Oil Change', 375.00, 'Routine scheduled maintenance'),
('17000000-0000-0000-0000-000000000002', '16000000-0000-0000-0000-000000000002', '2026-01-15', 'Engine Service', 450.00, 'Routine scheduled maintenance'),
('17000000-0000-0000-0000-000000000003', '16000000-0000-0000-0000-000000000004', '2026-01-20', 'Pump Inspection', 300.00, 'Scheduled for maintenance'),
('17000000-0000-0000-0000-000000000004', '16000000-0000-0000-0000-000000000005', '2026-01-25', 'Gear Repair', 900.00, 'Reported broken, awaiting parts'),
('17000000-0000-0000-0000-000000000005', '16000000-0000-0000-0000-000000000006', '2026-02-01', 'Blade Sharpening', 220.00, 'Routine scheduled maintenance'),
('17000000-0000-0000-0000-000000000006', '16000000-0000-0000-0000-000000000008', '2018-04-12', 'Final Inspection', 150.00, 'Retired after inspection');

-- --------------------------------------------------------
-- equipment_usage
-- --------------------------------------------------------
CREATE TABLE `equipment_usage` (
  `usage_id` CHAR(36) NOT NULL,
  `equipment_id` CHAR(36) NOT NULL,
  `employment_id` CHAR(36) NOT NULL,
  `usage_date` DATE NOT NULL,
  `hours_used` DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (`usage_id`),
  KEY `idx_usage_equipment` (`equipment_id`),
  KEY `idx_usage_employment` (`employment_id`),
  CONSTRAINT `fk_usage_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  CONSTRAINT `fk_usage_employment` FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `chk_hours_used` CHECK (`hours_used` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `equipment_usage` (`usage_id`, `equipment_id`, `employment_id`, `usage_date`, `hours_used`) VALUES
('18000000-0000-0000-0000-000000000001', '16000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '2026-03-02', 4.00),
('18000000-0000-0000-0000-000000000002', '16000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000002', '2026-03-03', 5.00),
('18000000-0000-0000-0000-000000000003', '16000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000005', '2026-03-04', 6.00),
('18000000-0000-0000-0000-000000000004', '16000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', '2026-03-05', 3.50),
('18000000-0000-0000-0000-000000000005', '16000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000007', '2026-03-06', 8.00),
('18000000-0000-0000-0000-000000000006', '16000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000004', '2026-03-07', 2.00),
('18000000-0000-0000-0000-000000000007', '16000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000009', '2026-03-08', 4.50),
('18000000-0000-0000-0000-000000000008', '16000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000010', '2026-03-09', 5.50);

-- --------------------------------------------------------
-- fertilizer
-- --------------------------------------------------------
CREATE TABLE `fertilizer` (
  `fertilizer_id` CHAR(36) NOT NULL,
  `fertilizer_name` VARCHAR(100) NOT NULL,
  `fertilizer_type` VARCHAR(80) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`fertilizer_id`),
  UNIQUE KEY `uq_fertilizer_name` (`fertilizer_name`),
  CONSTRAINT `chk_fertilizer_price` CHECK (`unit_price` >= 0),
  CONSTRAINT `chk_fertilizer_quantity` CHECK (`quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fertilizer` (`fertilizer_id`, `fertilizer_name`, `fertilizer_type`, `unit_price`, `quantity`) VALUES
('19000000-0000-0000-0000-000000000001', 'NPK 15-15-15', 'Compound', 220.00, 480.00),
('19000000-0000-0000-0000-000000000002', 'Urea 46%', 'Nitrogen', 190.00, 150.00),
('19000000-0000-0000-0000-000000000003', 'Muriate of Potash', 'Potassium', 260.00, 60.00),
('19000000-0000-0000-0000-000000000004', 'Single Super Phosphate', 'Phosphorus', 175.00, 210.00),
('19000000-0000-0000-0000-000000000005', 'Organic Compost Blend', 'Organic', 90.00, 820.00),
('19000000-0000-0000-0000-000000000006', 'CAN', 'Nitrogen', 200.00, 400.00);

-- --------------------------------------------------------
-- fertilizer_application
-- --------------------------------------------------------
CREATE TABLE `fertilizer_application` (
  `application_id` CHAR(36) NOT NULL,
  `crop_id` CHAR(36) NOT NULL,
  `employment_id` CHAR(36) NOT NULL,
  `fertilizer_id` CHAR(36) NOT NULL,
  `application_date` DATE NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `notes` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `idx_application_crop` (`crop_id`),
  KEY `idx_application_employment` (`employment_id`),
  KEY `idx_application_fertilizer` (`fertilizer_id`),
  CONSTRAINT `fk_application_crop` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`),
  CONSTRAINT `fk_application_employment` FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `fk_application_fertilizer` FOREIGN KEY (`fertilizer_id`) REFERENCES `fertilizer` (`fertilizer_id`),
  CONSTRAINT `chk_application_quantity` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fertilizer_application` (`application_id`, `crop_id`, `employment_id`, `fertilizer_id`, `application_date`, `quantity`, `notes`) VALUES
('1a000000-0000-0000-0000-000000000001', '14000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '19000000-0000-0000-0000-000000000001', '2026-02-02', 21.00, 'Scheduled fertilizer application'),
('1a000000-0000-0000-0000-000000000002', '14000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', '19000000-0000-0000-0000-000000000002', '2026-02-03', 22.00, 'Scheduled fertilizer application'),
('1a000000-0000-0000-0000-000000000003', '14000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000005', '19000000-0000-0000-0000-000000000003', '2026-02-04', 23.00, 'Scheduled fertilizer application'),
('1a000000-0000-0000-0000-000000000004', '14000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000006', '19000000-0000-0000-0000-000000000004', '2026-02-05', 24.00, 'Scheduled fertilizer application'),
('1a000000-0000-0000-0000-000000000005', '14000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000007', '19000000-0000-0000-0000-000000000005', '2026-02-06', 25.00, 'Scheduled fertilizer application'),
('1a000000-0000-0000-0000-000000000006', '14000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000010', '19000000-0000-0000-0000-000000000001', '2026-02-07', 26.00, 'Scheduled fertilizer application');

-- --------------------------------------------------------
-- fertilizer_transaction
-- --------------------------------------------------------
CREATE TABLE `fertilizer_transaction` (
  `transaction_id` CHAR(36) NOT NULL,
  `fertilizer_id` CHAR(36) NOT NULL,
  `transaction_type` VARCHAR(20) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `transaction_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `idx_fert_transaction_fertilizer` (`fertilizer_id`),
  CONSTRAINT `fk_fert_transaction_fertilizer` FOREIGN KEY (`fertilizer_id`) REFERENCES `fertilizer` (`fertilizer_id`),
  CONSTRAINT `chk_fertilizer_transaction_type` CHECK (`transaction_type` IN ('PURCHASE','USAGE','ADJUSTMENT')),
  CONSTRAINT `chk_fertilizer_transaction_qty` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fertilizer_transaction` (`transaction_id`, `fertilizer_id`, `transaction_type`, `quantity`, `unit_price`, `transaction_date`) VALUES
('1b000000-0000-0000-0000-000000000001', '19000000-0000-0000-0000-000000000001', 'PURCHASE', 300.00, 20.00, '2026-01-02 00:00:00'),
('1b000000-0000-0000-0000-000000000002', '19000000-0000-0000-0000-000000000002', 'PURCHASE', 200.00, 19.00, '2026-01-03 00:00:00'),
('1b000000-0000-0000-0000-000000000003', '19000000-0000-0000-0000-000000000003', 'PURCHASE', 100.00, 25.00, '2026-01-04 00:00:00'),
('1b000000-0000-0000-0000-000000000004', '19000000-0000-0000-0000-000000000004', 'USAGE', 50.00, 18.00, '2026-01-20 00:00:00'),
('1b000000-0000-0000-0000-000000000005', '19000000-0000-0000-0000-000000000005', 'PURCHASE', 400.00, 9.00, '2026-01-05 00:00:00'),
('1b000000-0000-0000-0000-000000000006', '19000000-0000-0000-0000-000000000006', 'ADJUSTMENT', 20.00, 20.00, '2026-01-25 00:00:00');

-- --------------------------------------------------------
-- harvest
-- --------------------------------------------------------
CREATE TABLE `harvest` (
  `harvest_id` CHAR(36) NOT NULL,
  `crop_id` CHAR(36) NOT NULL,
  `harvest_date` DATE NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'kg',
  `quality_grade` VARCHAR(20) NOT NULL DEFAULT 'STANDARD',
  PRIMARY KEY (`harvest_id`),
  KEY `idx_harvest_crop` (`crop_id`),
  CONSTRAINT `fk_harvest_crop` FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`),
  CONSTRAINT `chk_harvest_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_harvest_grade` CHECK (`quality_grade` IN ('PREMIUM','STANDARD','SUBSTANDARD'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `harvest` (`harvest_id`, `crop_id`, `harvest_date`, `quantity`, `unit`, `quality_grade`) VALUES
('1c000000-0000-0000-0000-000000000001', '14000000-0000-0000-0000-000000000001', '2026-04-10', 420.00, 'kg', 'PREMIUM'),
('1c000000-0000-0000-0000-000000000002', '14000000-0000-0000-0000-000000000002', '2026-06-01', 900.00, 'kg', 'STANDARD'),
('1c000000-0000-0000-0000-000000000003', '14000000-0000-0000-0000-000000000006', '2026-06-25', 310.00, 'kg', 'STANDARD'),
('1c000000-0000-0000-0000-000000000004', '14000000-0000-0000-0000-000000000007', '2026-05-05', 260.00, 'kg', 'PREMIUM'),
('1c000000-0000-0000-0000-000000000005', '14000000-0000-0000-0000-000000000009', '2026-05-30', 380.00, 'kg', 'SUBSTANDARD'),
('1c000000-0000-0000-0000-000000000006', '14000000-0000-0000-0000-000000000001', '2026-04-20', 180.00, 'kg', 'SUBSTANDARD');

-- --------------------------------------------------------
-- inventory — one batch of stored produce per harvest
-- --------------------------------------------------------
CREATE TABLE `inventory` (
  `inventory_id` CHAR(36) NOT NULL,
  `harvest_id` CHAR(36) NOT NULL,
  `item_name` VARCHAR(100) NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'kg',
  `storage_location` VARCHAR(150) DEFAULT NULL,
  PRIMARY KEY (`inventory_id`),
  KEY `idx_inventory_harvest` (`harvest_id`),
  CONSTRAINT `fk_inventory_harvest` FOREIGN KEY (`harvest_id`) REFERENCES `harvest` (`harvest_id`),
  CONSTRAINT `chk_inventory_qty` CHECK (`quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `inventory` (`inventory_id`, `harvest_id`, `item_name`, `quantity`, `unit`, `storage_location`) VALUES
('1d000000-0000-0000-0000-000000000001', '1c000000-0000-0000-0000-000000000001', 'Tomatoes (Roma)', 380.00, 'kg', 'Warehouse A - Cold Room 1'),
('1d000000-0000-0000-0000-000000000002', '1c000000-0000-0000-0000-000000000002', 'Maize (Obatanpa)', 850.00, 'kg', 'Warehouse B - Dry Store'),
('1d000000-0000-0000-0000-000000000003', '1c000000-0000-0000-0000-000000000003', 'Rice (Jasmine)', 300.00, 'kg', 'Warehouse C - Dry Store'),
('1d000000-0000-0000-0000-000000000004', '1c000000-0000-0000-0000-000000000004', 'Onions (Red Creole)', 250.00, 'kg', 'Warehouse A - Dry Store'),
('1d000000-0000-0000-0000-000000000005', '1c000000-0000-0000-0000-000000000005', 'Groundnuts (Chinese)', 360.00, 'kg', 'Warehouse A - Dry Store'),
('1d000000-0000-0000-0000-000000000006', '1c000000-0000-0000-0000-000000000006', 'Tomatoes (Roma, batch 2)', 170.00, 'kg', 'Warehouse A - Cold Room 2');

-- --------------------------------------------------------
-- inventory_transaction
-- --------------------------------------------------------
CREATE TABLE `inventory_transaction` (
  `transaction_id` CHAR(36) NOT NULL,
  `inventory_id` CHAR(36) NOT NULL,
  `transaction_type` VARCHAR(20) NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL,
  `transaction_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `idx_inv_transaction_inventory` (`inventory_id`),
  CONSTRAINT `fk_inv_transaction_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  CONSTRAINT `chk_inventory_transaction_type` CHECK (`transaction_type` IN ('IN','OUT','ADJUSTMENT')),
  CONSTRAINT `chk_inventory_transaction_qty` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- sale — employment_id is the staff member who made the sale (drives the
-- frontend's "sales person can only edit their own sales" rule).
-- --------------------------------------------------------
CREATE TABLE `sale` (
  `sale_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) DEFAULT NULL,
  `employment_id` CHAR(36) NOT NULL,
  `sale_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `sale_status` VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
  PRIMARY KEY (`sale_id`),
  KEY `idx_sale_customer` (`customer_id`),
  KEY `idx_sale_employment` (`employment_id`),
  CONSTRAINT `fk_sale_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `fk_sale_employment` FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `chk_sale_total` CHECK (`total` >= 0),
  CONSTRAINT `chk_sale_status` CHECK (`sale_status` IN ('UNPAID','PARTIALLY_PAID','PAID','CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sale` (`sale_id`, `customer_id`, `employment_id`, `sale_date`, `total`, `sale_status`) VALUES
('1f000000-0000-0000-0000-000000000001', '1e000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000002', '2026-08-12 09:15:00', 1675.00, 'UNPAID'),
('1f000000-0000-0000-0000-000000000002', '1e000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000002', '2026-08-11 14:20:00', 1800.00, 'UNPAID'),
('1f000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000008', '2026-08-11 10:05:00', 1200.00, 'UNPAID'),
('1f000000-0000-0000-0000-000000000004', '1e000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000002', '2026-08-10 16:40:00', 760.00, 'UNPAID'),
('1f000000-0000-0000-0000-000000000005', '1e000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000008', '2026-08-10 11:30:00', 840.00, 'UNPAID'),
('1f000000-0000-0000-0000-000000000006', '1e000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000002', '2026-08-09 15:00:00', 0.00, 'CANCELLED');

-- --------------------------------------------------------
-- sale_item — inserted via plain INSERT here (not the stored procedure) so
-- the before/after triggers exercise their normal validation + inventory
-- decrement path during seeding, exactly as they would at runtime.
-- --------------------------------------------------------
CREATE TABLE `sale_item` (
  `sale_item_id` CHAR(36) NOT NULL,
  `sale_id` CHAR(36) NOT NULL,
  `inventory_id` CHAR(36) NOT NULL,
  `quantity` DECIMAL(12,2) NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (`sale_item_id`),
  KEY `idx_sale_item_sale` (`sale_id`),
  KEY `idx_sale_item_inventory` (`inventory_id`),
  CONSTRAINT `fk_sale_item_sale` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`),
  CONSTRAINT `fk_sale_item_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  CONSTRAINT `chk_sale_item_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_sale_item_price` CHECK (`unit_price` >= 0),
  CONSTRAINT `chk_sale_item_subtotal` CHECK (`subtotal` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- payment
-- --------------------------------------------------------
CREATE TABLE `payment` (
  `payment_id` CHAR(36) NOT NULL,
  `sale_id` CHAR(36) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `payment_method` VARCHAR(30) NOT NULL,
  `payment_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `payment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `idx_payment_sale` (`sale_id`),
  CONSTRAINT `fk_payment_sale` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`),
  CONSTRAINT `chk_payment_amount` CHECK (`amount` > 0),
  CONSTRAINT `chk_payment_status` CHECK (`payment_status` IN ('PENDING','CONFIRMED','FAILED','REFUNDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- notification — not part of the original ERD; added to power the
-- frontend's Notifications page (mark as read/unread, delete).
-- --------------------------------------------------------
CREATE TABLE `notification` (
  `notification_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `category` VARCHAR(20) NOT NULL DEFAULT 'SYSTEM',
  `title` VARCHAR(150) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notification_user` (`user_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  CONSTRAINT `chk_notification_category` CHECK (`category` IN ('SALE','HARVEST','DISEASE','EQUIPMENT','ATTENDANCE','PAYMENT','SYSTEM'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notification` (`notification_id`, `user_id`, `category`, `title`, `message`, `is_read`, `created_at`) VALUES
('23000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000004', 'SYSTEM', 'Weekly summary ready', 'Your farm performance summary for last week is ready to view.', 1, '2026-08-09 09:00:00'),
('23000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'SALE', 'New order placed', 'A new order was placed for ₵ 1,675.00.', 0, '2026-08-12 09:15:00'),
('23000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000004', 'DISEASE', 'Critical disease detected', 'Bacterial Wilt flagged as CRITICAL severity on Pepper at Golden Harvest Farm.', 0, '2026-08-12 08:15:00'),
('23000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000003', 'ATTENDANCE', 'Unreported absence', 'You were marked absent today with no leave request on file.', 0, '2026-08-10 09:00:00'),
('23000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000002', 'PAYMENT', 'Payment pending', 'Payment for order at Green Valley Farm is still pending.', 0, '2026-08-11 16:20:00'),
('23000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000004', 'EQUIPMENT', 'Equipment needs maintenance', 'Rotary Tiller at Peaceful Fields Farm is marked BROKEN.', 1, '2026-08-11 11:05:00'),
('23000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000003', 'HARVEST', 'Harvest ready for storage', '420 kg of Tomatoes harvested at Green Valley Farm.', 1, '2026-08-10 14:30:00'),
('23000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000004', 'HARVEST', 'Upcoming harvest reminder', 'Pepper at Golden Harvest Farm is marked READY for harvest.', 1, '2026-08-09 07:00:00');

-- --------------------------------------------------------
-- sp_record_sale_item — runtime path for POST /api/sale-items (uses the
-- procedure instead of a raw INSERT so the running sale.total is kept in
-- sync in one call). Declared before the seed data below on purpose —
-- MySQL only fires triggers/procedures that already exist at INSERT time.
-- --------------------------------------------------------
DELIMITER //
CREATE PROCEDURE `sp_record_sale_item`(
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

-- --------------------------------------------------------
-- trg_payment_after_insert — keeps sale.sale_status in sync with confirmed payments
-- --------------------------------------------------------
DELIMITER //
CREATE TRIGGER trg_payment_after_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    DECLARE paid_amount DECIMAL(12,2);
    DECLARE sale_total DECIMAL(12,2);

    IF NEW.payment_status = 'CONFIRMED' THEN
        SELECT COALESCE(SUM(amount), 0) INTO paid_amount
        FROM payment
        WHERE sale_id = NEW.sale_id AND payment_status = 'CONFIRMED';

        SELECT total INTO sale_total FROM sale WHERE sale_id = NEW.sale_id;

        IF paid_amount >= sale_total THEN
            UPDATE sale SET sale_status = 'PAID' WHERE sale_id = NEW.sale_id;
        ELSE
            UPDATE sale SET sale_status = 'PARTIALLY_PAID' WHERE sale_id = NEW.sale_id;
        END IF;
    END IF;
END//
DELIMITER ;

-- --------------------------------------------------------
-- trg_sale_item_before_insert — reject oversells before they happen
-- --------------------------------------------------------
DELIMITER //
CREATE TRIGGER trg_sale_item_before_insert
BEFORE INSERT ON sale_item
FOR EACH ROW
BEGIN
    DECLARE available_qty DECIMAL(12,2);

    SELECT quantity INTO available_qty
    FROM inventory
    WHERE inventory_id = NEW.inventory_id
    FOR UPDATE;

    IF available_qty IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory item does not exist.';
    END IF;

    IF NEW.quantity > available_qty THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot sell more inventory than available.';
    END IF;
END//
DELIMITER ;

-- --------------------------------------------------------
-- trg_sale_item_after_insert — decrement stock and log the movement
-- --------------------------------------------------------
DELIMITER //
CREATE TRIGGER trg_sale_item_after_insert
AFTER INSERT ON sale_item
FOR EACH ROW
BEGIN
    UPDATE inventory
    SET quantity = quantity - NEW.quantity
    WHERE inventory_id = NEW.inventory_id;

    INSERT INTO inventory_transaction (transaction_id, inventory_id, transaction_type, quantity)
    VALUES (UUID(), NEW.inventory_id, 'OUT', NEW.quantity);
END//
DELIMITER ;

-- --------------------------------------------------------
-- Seed sale_item rows through the normal INSERT path so triggers fire:
--   trg_sale_item_before_insert validates available inventory quantity
--   trg_sale_item_after_insert   decrements inventory + logs the OUT transaction
-- Running totals stay within each inventory row's starting quantity.
-- --------------------------------------------------------
INSERT INTO `sale_item` (`sale_item_id`, `sale_id`, `inventory_id`, `quantity`, `unit_price`, `subtotal`) VALUES
('20000000-0000-0000-0000-000000000001', '1f000000-0000-0000-0000-000000000001', '1d000000-0000-0000-0000-000000000001', 100.00, 8.50, 850.00),
('20000000-0000-0000-0000-000000000002', '1f000000-0000-0000-0000-000000000001', '1d000000-0000-0000-0000-000000000001', 50.00, 8.50, 425.00),
('20000000-0000-0000-0000-000000000003', '1f000000-0000-0000-0000-000000000001', '1d000000-0000-0000-0000-000000000006', 50.00, 8.00, 400.00),
('20000000-0000-0000-0000-000000000004', '1f000000-0000-0000-0000-000000000002', '1d000000-0000-0000-0000-000000000002', 200.00, 6.00, 1200.00),
('20000000-0000-0000-0000-000000000005', '1f000000-0000-0000-0000-000000000002', '1d000000-0000-0000-0000-000000000002', 100.00, 6.00, 600.00),
('20000000-0000-0000-0000-000000000006', '1f000000-0000-0000-0000-000000000003', '1d000000-0000-0000-0000-000000000003', 100.00, 12.00, 1200.00),
('20000000-0000-0000-0000-000000000007', '1f000000-0000-0000-0000-000000000004', '1d000000-0000-0000-0000-000000000004', 80.00, 9.50, 760.00),
('20000000-0000-0000-0000-000000000008', '1f000000-0000-0000-0000-000000000005', '1d000000-0000-0000-0000-000000000005', 120.00, 7.00, 840.00);

-- --------------------------------------------------------
-- Seed payments — trg_payment_after_insert recomputes each sale's
-- sale_status from its CONFIRMED payments vs its total automatically.
--   sale001 total 1675.00, paid 1675.00 CONFIRMED -> PAID
--   sale002 total 1800.00, paid 1000+500=1500 CONFIRMED -> PARTIALLY_PAID
--   sale003 total 1200.00, paid 1200.00 CONFIRMED -> PAID
--   sale004/sale005: no CONFIRMED payment yet -> stay UNPAID
-- --------------------------------------------------------
INSERT INTO `payment` (`payment_id`, `sale_id`, `amount`, `payment_method`, `payment_status`, `payment_date`) VALUES
('21000000-0000-0000-0000-000000000001', '1f000000-0000-0000-0000-000000000001', 1675.00, 'Mobile Money', 'CONFIRMED', '2026-08-12 09:20:00'),
('21000000-0000-0000-0000-000000000002', '1f000000-0000-0000-0000-000000000002', 1000.00, 'Bank Transfer', 'CONFIRMED', '2026-08-11 14:25:00'),
('21000000-0000-0000-0000-000000000003', '1f000000-0000-0000-0000-000000000003', 1200.00, 'Cash', 'CONFIRMED', '2026-08-11 10:10:00'),
('21000000-0000-0000-0000-000000000004', '1f000000-0000-0000-0000-000000000004', 760.00, 'Mobile Money', 'PENDING', '2026-08-10 16:45:00'),
('21000000-0000-0000-0000-000000000005', '1f000000-0000-0000-0000-000000000005', 840.00, 'Cash', 'FAILED', '2026-08-10 11:35:00'),
('21000000-0000-0000-0000-000000000006', '1f000000-0000-0000-0000-000000000002', 500.00, 'Bank Transfer', 'CONFIRMED', '2026-08-12 10:00:00');

SET FOREIGN_KEY_CHECKS = 1;
