-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.3.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for farm_management
CREATE DATABASE IF NOT EXISTS `farm_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `farm_management`;

-- Dumping structure for table farm_management.app_user
CREATE TABLE IF NOT EXISTS `app_user` (
  `user_id` char(36) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `other_phone_number` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.app_user: ~15 rows (approximately)
INSERT INTO `app_user` (`user_id`, `first_name`, `last_name`, `email`, `phone_number`, `other_phone_number`, `created_at`, `updated_at`) VALUES
	('3b58f5cb-95e3-11f1-ad8c-088e902d5f0e', 'Kwame', 'Mensah', 'kwame.mensah@farm.com', '0240000001', '0200000001', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f7a8-95e3-11f1-ad8c-088e902d5f0e', 'Ama', 'Owusu', 'ama.owusu@farm.com', '0240000002', '0200000002', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f83a-95e3-11f1-ad8c-088e902d5f0e', 'Kofi', 'Asare', 'kofi.asare@farm.com', '0240000003', '0200000003', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f860-95e3-11f1-ad8c-088e902d5f0e', 'Akosua', 'Boateng', 'akosua.boateng@farm.com', '0240000004', '0200000004', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f87c-95e3-11f1-ad8c-088e902d5f0e', 'Yaw', 'Adjei', 'yaw.adjei@farm.com', '0240000005', '0200000005', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f89b-95e3-11f1-ad8c-088e902d5f0e', 'Abena', 'Frimpong', 'abena.frimpong@farm.com', '0240000006', '0200000006', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f8b3-95e3-11f1-ad8c-088e902d5f0e', 'Kojo', 'Antwi', 'kojo.antwi@farm.com', '0240000007', '0200000007', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f8d1-95e3-11f1-ad8c-088e902d5f0e', 'Efua', 'Darko', 'efua.darko@farm.com', '0240000008', '0200000008', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f8f0-95e3-11f1-ad8c-088e902d5f0e', 'Kwesi', 'Ofori', 'kwesi.ofori@farm.com', '0240000009', '0200000009', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f90a-95e3-11f1-ad8c-088e902d5f0e', 'Adwoa', 'Asante', 'adwoa.asante@farm.com', '0240000010', '0200000010', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f922-95e3-11f1-ad8c-088e902d5f0e', 'Nana', 'Amoah', 'nana.amoah@farm.com', '0240000011', '0200000011', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f943-95e3-11f1-ad8c-088e902d5f0e', 'Esi', 'Addo', 'esi.addo@farm.com', '0240000012', '0200000012', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f95c-95e3-11f1-ad8c-088e902d5f0e', 'Fiifi', 'Quaye', 'fiifi.quaye@farm.com', '0240000013', '0200000013', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f975-95e3-11f1-ad8c-088e902d5f0e', 'Mavis', 'Tetteh', 'mavis.tetteh@farm.com', '0240000014', '0200000014', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b58f990-95e3-11f1-ad8c-088e902d5f0e', 'Selorm', 'Klu', 'selorm.klu@farm.com', '0240000015', '0200000015', '2026-08-12 00:17:25', '2026-08-12 00:17:25');

-- Dumping structure for table farm_management.attendance
CREATE TABLE IF NOT EXISTS `attendance` (
  `attendance_id` char(36) NOT NULL,
  `employment_id` char(36) NOT NULL,
  `attendance_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `attendance_status` varchar(20) NOT NULL,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `employment_id` (`employment_id`,`attendance_date`),
  FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `chk_attendance_status` CHECK (`attendance_status` in ('PRESENT','ABSENT','LATE','LEAVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.attendance: ~15 rows (approximately)
INSERT INTO `attendance` (`attendance_id`, `employment_id`, `attendance_date`, `check_in`, `check_out`, `attendance_status`) VALUES
	('3b67ee67-95e3-11f1-ad8c-088e902d5f0e', '3b5aa915-95e3-11f1-ad8c-088e902d5f0e', '2026-05-02', '07:55:00', '17:00:00', 'PRESENT'),
	('3b67f020-95e3-11f1-ad8c-088e902d5f0e', '3b5aaaf7-95e3-11f1-ad8c-088e902d5f0e', '2026-05-03', '08:00:00', '17:00:00', 'PRESENT'),
	('3b67f0b1-95e3-11f1-ad8c-088e902d5f0e', '3b5aabe7-95e3-11f1-ad8c-088e902d5f0e', '2026-05-04', '08:15:00', '17:00:00', 'PRESENT'),
	('3b67f0ea-95e3-11f1-ad8c-088e902d5f0e', '3b5aac8d-95e3-11f1-ad8c-088e902d5f0e', '2026-05-05', '08:30:00', '17:00:00', 'LATE'),
	('3b67f120-95e3-11f1-ad8c-088e902d5f0e', '3b5aacf3-95e3-11f1-ad8c-088e902d5f0e', '2026-05-06', '07:55:00', '17:00:00', 'PRESENT'),
	('3b67f151-95e3-11f1-ad8c-088e902d5f0e', '3b5aad45-95e3-11f1-ad8c-088e902d5f0e', '2026-05-07', '08:00:00', '17:00:00', 'PRESENT'),
	('3b67f180-95e3-11f1-ad8c-088e902d5f0e', '3b5aad9a-95e3-11f1-ad8c-088e902d5f0e', '2026-05-08', '08:15:00', '17:00:00', 'PRESENT'),
	('3b67f1af-95e3-11f1-ad8c-088e902d5f0e', '3b5aaded-95e3-11f1-ad8c-088e902d5f0e', '2026-05-09', '08:30:00', '17:00:00', 'LATE'),
	('3b67f1e2-95e3-11f1-ad8c-088e902d5f0e', '3b5aae45-95e3-11f1-ad8c-088e902d5f0e', '2026-05-10', '07:55:00', '17:00:00', 'PRESENT'),
	('3b67f210-95e3-11f1-ad8c-088e902d5f0e', '3b5aae97-95e3-11f1-ad8c-088e902d5f0e', '2026-05-11', '08:00:00', '17:00:00', 'PRESENT'),
	('3b67f23e-95e3-11f1-ad8c-088e902d5f0e', '3b5aaee9-95e3-11f1-ad8c-088e902d5f0e', '2026-05-12', '08:15:00', '17:00:00', 'PRESENT'),
	('3b67f26d-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf3c-95e3-11f1-ad8c-088e902d5f0e', '2026-05-13', '08:30:00', '17:00:00', 'LATE'),
	('3b67f29f-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf94-95e3-11f1-ad8c-088e902d5f0e', '2026-05-14', '07:55:00', '17:00:00', 'PRESENT'),
	('3b67f2cf-95e3-11f1-ad8c-088e902d5f0e', '3b5aafeb-95e3-11f1-ad8c-088e902d5f0e', '2026-05-15', '08:00:00', '17:00:00', 'PRESENT'),
	('3b67f300-95e3-11f1-ad8c-088e902d5f0e', '3b5ab044-95e3-11f1-ad8c-088e902d5f0e', '2026-05-16', '08:15:00', '17:00:00', 'PRESENT');

-- Dumping structure for table farm_management.crop
CREATE TABLE IF NOT EXISTS `crop` (
  `crop_id` char(36) NOT NULL,
  `farm_id` char(36) NOT NULL,
  `crop_name` varchar(80) NOT NULL,
  `crop_variety` varchar(80) DEFAULT NULL,
  `planting_date` date NOT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `crop_status` varchar(20) NOT NULL DEFAULT 'GROWING',
  PRIMARY KEY (`crop_id`),
  KEY `farm_id` (`farm_id`),
  FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_crop_status` CHECK (`crop_status` in ('PLANNED','GROWING','HARVESTED','FAILED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.crop: ~15 rows (approximately)
INSERT INTO `crop` (`crop_id`, `farm_id`, `crop_name`, `crop_variety`, `planting_date`, `expected_harvest_date`, `crop_status`) VALUES
	('3b5b5af2-95e3-11f1-ad8c-088e902d5f0e', '3b586b26-95e3-11f1-ad8c-088e902d5f0e', 'Tomato', 'Roma', '2026-01-10', '2026-04-10', 'HARVESTED'),
	('3b5b5c92-95e3-11f1-ad8c-088e902d5f0e', '3b586c7c-95e3-11f1-ad8c-088e902d5f0e', 'Maize', 'Obatanpa', '2026-02-01', '2026-06-01', 'HARVESTED'),
	('3b5b5d2b-95e3-11f1-ad8c-088e902d5f0e', '3b586ceb-95e3-11f1-ad8c-088e902d5f0e', 'Pepper', 'Cayenne', '2026-01-20', '2026-05-20', 'HARVESTED'),
	('3b5b5d6d-95e3-11f1-ad8c-088e902d5f0e', '3b586d06-95e3-11f1-ad8c-088e902d5f0e', 'Cassava', 'Bankye Hemaa', '2025-12-10', '2026-08-10', 'GROWING'),
	('3b5b5da9-95e3-11f1-ad8c-088e902d5f0e', '3b586d1c-95e3-11f1-ad8c-088e902d5f0e', 'Plantain', 'Apantu', '2025-11-15', '2026-07-15', 'GROWING'),
	('3b5b5ddf-95e3-11f1-ad8c-088e902d5f0e', '3b586d33-95e3-11f1-ad8c-088e902d5f0e', 'Rice', 'Jasmine', '2026-01-25', '2026-06-25', 'HARVESTED'),
	('3b5b5e16-95e3-11f1-ad8c-088e902d5f0e', '3b586d46-95e3-11f1-ad8c-088e902d5f0e', 'Onion', 'Red Creole', '2026-02-05', '2026-05-05', 'HARVESTED'),
	('3b5b5e4b-95e3-11f1-ad8c-088e902d5f0e', '3b586d5a-95e3-11f1-ad8c-088e902d5f0e', 'Carrot', 'Nantes', '2026-02-12', '2026-05-12', 'HARVESTED'),
	('3b5b5e81-95e3-11f1-ad8c-088e902d5f0e', '3b586d71-95e3-11f1-ad8c-088e902d5f0e', 'Cabbage', 'Green Crown', '2026-01-18', '2026-04-18', 'HARVESTED'),
	('3b5b5eb6-95e3-11f1-ad8c-088e902d5f0e', '3b586d84-95e3-11f1-ad8c-088e902d5f0e', 'Soybean', 'Jenguma', '2026-02-15', '2026-06-15', 'GROWING'),
	('3b5b5eea-95e3-11f1-ad8c-088e902d5f0e', '3b586d97-95e3-11f1-ad8c-088e902d5f0e', 'Watermelon', 'Crimson Sweet', '2026-02-20', '2026-05-20', 'HARVESTED'),
	('3b5b5f1f-95e3-11f1-ad8c-088e902d5f0e', '3b586daa-95e3-11f1-ad8c-088e902d5f0e', 'Cucumber', 'Marketmore', '2026-01-22', '2026-04-22', 'HARVESTED'),
	('3b5b5f56-95e3-11f1-ad8c-088e902d5f0e', '3b586dbe-95e3-11f1-ad8c-088e902d5f0e', 'Okra', 'Clemson Spineless', '2026-02-08', '2026-05-08', 'GROWING'),
	('3b5b5f8c-95e3-11f1-ad8c-088e902d5f0e', '3b586dd1-95e3-11f1-ad8c-088e902d5f0e', 'Groundnut', 'Chinese', '2026-01-30', '2026-05-30', 'HARVESTED'),
	('3b5b5fc7-95e3-11f1-ad8c-088e902d5f0e', '3b586de4-95e3-11f1-ad8c-088e902d5f0e', 'Sweet Potato', 'Apomuden', '2026-01-05', '2026-05-05', 'HARVESTED');

-- Dumping structure for table farm_management.crop_disease
CREATE TABLE IF NOT EXISTS `crop_disease` (
  `crop_id` char(36) NOT NULL,
  `disease_id` char(36) NOT NULL,
  `detected_date` date NOT NULL,
  `severity` varchar(20) NOT NULL,
  `treatment` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`crop_id`,`disease_id`),
  KEY `disease_id` (`disease_id`),
  FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`),
  FOREIGN KEY (`disease_id`) REFERENCES `disease` (`disease_id`),
  CONSTRAINT `chk_severity` CHECK (`severity` in ('LOW','MEDIUM','HIGH','CRITICAL'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.crop_disease: ~15 rows (approximately)
INSERT INTO `crop_disease` (`crop_id`, `disease_id`, `detected_date`, `severity`, `treatment`) VALUES
	('3b5b5af2-95e3-11f1-ad8c-088e902d5f0e', '3b5c1a24-95e3-11f1-ad8c-088e902d5f0e', '2026-03-02', 'HIGH', 'Fungicide treatment'),
	('3b5b5c92-95e3-11f1-ad8c-088e902d5f0e', '3b5c1c40-95e3-11f1-ad8c-088e902d5f0e', '2026-03-03', 'MEDIUM', 'Remove affected plants'),
	('3b5b5d2b-95e3-11f1-ad8c-088e902d5f0e', '3b5c1cc6-95e3-11f1-ad8c-088e902d5f0e', '2026-03-04', 'LOW', 'Improve drainage'),
	('3b5b5d6d-95e3-11f1-ad8c-088e902d5f0e', '3b5c1d74-95e3-11f1-ad8c-088e902d5f0e', '2026-03-05', 'HIGH', 'Organic spray'),
	('3b5b5da9-95e3-11f1-ad8c-088e902d5f0e', '3b5c1dc7-95e3-11f1-ad8c-088e902d5f0e', '2026-03-06', 'MEDIUM', 'Fungicide treatment'),
	('3b5b5ddf-95e3-11f1-ad8c-088e902d5f0e', '3b5c1d1d-95e3-11f1-ad8c-088e902d5f0e', '2026-03-07', 'LOW', 'Remove affected plants'),
	('3b5b5e16-95e3-11f1-ad8c-088e902d5f0e', '3b5c1cf4-95e3-11f1-ad8c-088e902d5f0e', '2026-03-08', 'HIGH', 'Improve drainage'),
	('3b5b5e4b-95e3-11f1-ad8c-088e902d5f0e', '3b5c1c9a-95e3-11f1-ad8c-088e902d5f0e', '2026-03-09', 'MEDIUM', 'Organic spray'),
	('3b5b5e81-95e3-11f1-ad8c-088e902d5f0e', '3b5c1dc7-95e3-11f1-ad8c-088e902d5f0e', '2026-03-10', 'LOW', 'Fungicide treatment'),
	('3b5b5eb6-95e3-11f1-ad8c-088e902d5f0e', '3b5c1c6c-95e3-11f1-ad8c-088e902d5f0e', '2026-03-11', 'HIGH', 'Remove affected plants'),
	('3b5b5eea-95e3-11f1-ad8c-088e902d5f0e', '3b5c1d4c-95e3-11f1-ad8c-088e902d5f0e', '2026-03-12', 'MEDIUM', 'Improve drainage'),
	('3b5b5f1f-95e3-11f1-ad8c-088e902d5f0e', '3b5c1cf4-95e3-11f1-ad8c-088e902d5f0e', '2026-03-13', 'LOW', 'Organic spray'),
	('3b5b5f56-95e3-11f1-ad8c-088e902d5f0e', '3b5c1c40-95e3-11f1-ad8c-088e902d5f0e', '2026-03-14', 'HIGH', 'Fungicide treatment'),
	('3b5b5f8c-95e3-11f1-ad8c-088e902d5f0e', '3b5c1d1d-95e3-11f1-ad8c-088e902d5f0e', '2026-03-15', 'MEDIUM', 'Remove affected plants'),
	('3b5b5fc7-95e3-11f1-ad8c-088e902d5f0e', '3b5c1d9c-95e3-11f1-ad8c-088e902d5f0e', '2026-03-16', 'LOW', 'Improve drainage');

-- Dumping structure for table farm_management.customer
CREATE TABLE IF NOT EXISTS `customer` (
  `customer_id` char(36) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.customer: ~15 rows (approximately)
INSERT INTO `customer` (`customer_id`, `first_name`, `last_name`, `phone_number`, `email`, `address`) VALUES
	('3b654963-95e3-11f1-ad8c-088e902d5f0e', 'Yaw', 'Boateng', '0241000001', 'yaw.boateng@gmail.com', 'Kumasi'),
	('3b654bc9-95e3-11f1-ad8c-088e902d5f0e', 'Adwoa', 'Mensah', '0241000002', 'adwoa.mensah@gmail.com', 'Accra'),
	('3b654c45-95e3-11f1-ad8c-088e902d5f0e', 'Kwabena', 'Osei', '0241000003', 'kwabena.osei@gmail.com', 'Tamale'),
	('3b654c67-95e3-11f1-ad8c-088e902d5f0e', 'Akua', 'Frimpong', '0241000004', 'akua.frimpong@gmail.com', 'Sunyani'),
	('3b654c84-95e3-11f1-ad8c-088e902d5f0e', 'Kwadwo', 'Asante', '0241000005', 'kwadwo.asante@gmail.com', 'Cape Coast'),
	('3b654ca0-95e3-11f1-ad8c-088e902d5f0e', 'Abigail', 'Owusu', '0241000006', 'abigail.owusu@gmail.com', 'Ho'),
	('3b654cbd-95e3-11f1-ad8c-088e902d5f0e', 'Daniel', 'Addo', '0241000007', 'daniel.addo@gmail.com', 'Koforidua'),
	('3b654cd7-95e3-11f1-ad8c-088e902d5f0e', 'Mabel', 'Amoah', '0241000008', 'mabel.amoah@gmail.com', 'Wa'),
	('3b654cf5-95e3-11f1-ad8c-088e902d5f0e', 'Richard', 'Tetteh', '0241000009', 'richard.tetteh@gmail.com', 'Takoradi'),
	('3b654d11-95e3-11f1-ad8c-088e902d5f0e', 'Linda', 'Quartey', '0241000010', 'linda.quartey@gmail.com', 'Tema'),
	('3b654d2b-95e3-11f1-ad8c-088e902d5f0e', 'Michael', 'Kusi', '0241000011', 'michael.kusi@gmail.com', 'Obuasi'),
	('3b654d46-95e3-11f1-ad8c-088e902d5f0e', 'Patricia', 'Asare', '0241000012', 'patricia.asare@gmail.com', 'Techiman'),
	('3b654d61-95e3-11f1-ad8c-088e902d5f0e', 'Samuel', 'Darko', '0241000013', 'samuel.darko@gmail.com', 'Bolgatanga'),
	('3b654d7a-95e3-11f1-ad8c-088e902d5f0e', 'Esther', 'Agyemang', '0241000014', 'esther.agyemang@gmail.com', 'Berekum'),
	('3b654d97-95e3-11f1-ad8c-088e902d5f0e', 'Joseph', 'Nyarko', '0241000015', 'joseph.nyarko@gmail.com', 'Nkawkaw');

-- Dumping structure for table farm_management.disease
CREATE TABLE IF NOT EXISTS `disease` (
  `disease_id` char(36) NOT NULL,
  `disease_name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`disease_id`),
  UNIQUE KEY `disease_name` (`disease_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.disease: ~15 rows (approximately)
INSERT INTO `disease` (`disease_id`, `disease_name`, `description`) VALUES
	('3b5c1a24-95e3-11f1-ad8c-088e902d5f0e', 'Late Blight', 'Fungal disease causing dark lesions on leaves and fruit.'),
	('3b5c1bb8-95e3-11f1-ad8c-088e902d5f0e', 'Early Blight', 'Fungal disease causing circular spots on leaves.'),
	('3b5c1c40-95e3-11f1-ad8c-088e902d5f0e', 'Leaf Spot', 'Disease causing spots and premature leaf loss.'),
	('3b5c1c6c-95e3-11f1-ad8c-088e902d5f0e', 'Powdery Mildew', 'White fungal growth on leaves and stems.'),
	('3b5c1c9a-95e3-11f1-ad8c-088e902d5f0e', 'Root Rot', 'Disease damaging roots in wet soil.'),
	('3b5c1cc6-95e3-11f1-ad8c-088e902d5f0e', 'Bacterial Wilt', 'Bacterial disease causing plant wilting.'),
	('3b5c1cf4-95e3-11f1-ad8c-088e902d5f0e', 'Downy Mildew', 'Disease affecting crop leaves.'),
	('3b5c1d1d-95e3-11f1-ad8c-088e902d5f0e', 'Rust', 'Disease producing rust-colored spots.'),
	('3b5c1d4c-95e3-11f1-ad8c-088e902d5f0e', 'Anthracnose', 'Fungal disease causing dark sunken lesions.'),
	('3b5c1d74-95e3-11f1-ad8c-088e902d5f0e', 'Mosaic Virus', 'Viral disease causing mosaic patterns.'),
	('3b5c1d9c-95e3-11f1-ad8c-088e902d5f0e', 'Fusarium Wilt', 'Soil-borne fungal disease causing wilting.'),
	('3b5c1dc7-95e3-11f1-ad8c-088e902d5f0e', 'Black Rot', 'Bacterial disease affecting leaves and produce.'),
	('3b5c1dfa-95e3-11f1-ad8c-088e902d5f0e', 'Damping Off', 'Disease affecting young seedlings.'),
	('3b5c1e23-95e3-11f1-ad8c-088e902d5f0e', 'Canker', 'Disease causing damaged areas on stems.'),
	('3b5c1e4f-95e3-11f1-ad8c-088e902d5f0e', 'Smut', 'Fungal disease producing dark spores.');

-- Dumping structure for table farm_management.employment
CREATE TABLE IF NOT EXISTS `employment` (
  `employment_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `farm_id` char(36) NOT NULL,
  `role` varchar(50) NOT NULL,
  `salary` decimal(12,2) NOT NULL,
  `hire_date` date NOT NULL,
  `employment_status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`employment_id`),
  KEY `user_id` (`user_id`),
  KEY `farm_id` (`farm_id`),
  FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_salary` CHECK (`salary` >= 0),
  CONSTRAINT `chk_employment_status` CHECK (`employment_status` in ('ACTIVE','INACTIVE','ENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.employment: ~15 rows (approximately)
INSERT INTO `employment` (`employment_id`, `user_id`, `farm_id`, `role`, `salary`, `hire_date`, `employment_status`) VALUES
	('3b5aa915-95e3-11f1-ad8c-088e902d5f0e', '3b58f5cb-95e3-11f1-ad8c-088e902d5f0e', '3b586b26-95e3-11f1-ad8c-088e902d5f0e', 'Farm Manager', 4500.00, '2025-01-20', 'ACTIVE'),
	('3b5aaaf7-95e3-11f1-ad8c-088e902d5f0e', '3b58f7a8-95e3-11f1-ad8c-088e902d5f0e', '3b586c7c-95e3-11f1-ad8c-088e902d5f0e', 'Field Worker', 2200.00, '2025-01-30', 'ACTIVE'),
	('3b5aabe7-95e3-11f1-ad8c-088e902d5f0e', '3b58f83a-95e3-11f1-ad8c-088e902d5f0e', '3b586ceb-95e3-11f1-ad8c-088e902d5f0e', 'Equipment Operator', 2800.00, '2025-02-09', 'ACTIVE'),
	('3b5aac8d-95e3-11f1-ad8c-088e902d5f0e', '3b58f860-95e3-11f1-ad8c-088e902d5f0e', '3b586d06-95e3-11f1-ad8c-088e902d5f0e', 'Agricultural Officer', 3500.00, '2025-02-19', 'ACTIVE'),
	('3b5aacf3-95e3-11f1-ad8c-088e902d5f0e', '3b58f87c-95e3-11f1-ad8c-088e902d5f0e', '3b586d1c-95e3-11f1-ad8c-088e902d5f0e', 'Harvest Supervisor', 3000.00, '2025-03-01', 'ACTIVE'),
	('3b5aad45-95e3-11f1-ad8c-088e902d5f0e', '3b58f89b-95e3-11f1-ad8c-088e902d5f0e', '3b586d33-95e3-11f1-ad8c-088e902d5f0e', 'Farm Manager', 4500.00, '2025-03-11', 'ACTIVE'),
	('3b5aad9a-95e3-11f1-ad8c-088e902d5f0e', '3b58f8b3-95e3-11f1-ad8c-088e902d5f0e', '3b586d46-95e3-11f1-ad8c-088e902d5f0e', 'Field Worker', 2200.00, '2025-03-21', 'ACTIVE'),
	('3b5aaded-95e3-11f1-ad8c-088e902d5f0e', '3b58f8d1-95e3-11f1-ad8c-088e902d5f0e', '3b586d5a-95e3-11f1-ad8c-088e902d5f0e', 'Equipment Operator', 2800.00, '2025-03-31', 'ACTIVE'),
	('3b5aae45-95e3-11f1-ad8c-088e902d5f0e', '3b58f8f0-95e3-11f1-ad8c-088e902d5f0e', '3b586d71-95e3-11f1-ad8c-088e902d5f0e', 'Agricultural Officer', 3500.00, '2025-04-10', 'ACTIVE'),
	('3b5aae97-95e3-11f1-ad8c-088e902d5f0e', '3b58f90a-95e3-11f1-ad8c-088e902d5f0e', '3b586d84-95e3-11f1-ad8c-088e902d5f0e', 'Harvest Supervisor', 3000.00, '2025-04-20', 'ACTIVE'),
	('3b5aaee9-95e3-11f1-ad8c-088e902d5f0e', '3b58f922-95e3-11f1-ad8c-088e902d5f0e', '3b586d97-95e3-11f1-ad8c-088e902d5f0e', 'Farm Manager', 4500.00, '2025-04-30', 'ACTIVE'),
	('3b5aaf3c-95e3-11f1-ad8c-088e902d5f0e', '3b58f943-95e3-11f1-ad8c-088e902d5f0e', '3b586daa-95e3-11f1-ad8c-088e902d5f0e', 'Field Worker', 2200.00, '2025-05-10', 'ACTIVE'),
	('3b5aaf94-95e3-11f1-ad8c-088e902d5f0e', '3b58f95c-95e3-11f1-ad8c-088e902d5f0e', '3b586dbe-95e3-11f1-ad8c-088e902d5f0e', 'Equipment Operator', 2800.00, '2025-05-20', 'ACTIVE'),
	('3b5aafeb-95e3-11f1-ad8c-088e902d5f0e', '3b58f975-95e3-11f1-ad8c-088e902d5f0e', '3b586dd1-95e3-11f1-ad8c-088e902d5f0e', 'Agricultural Officer', 3500.00, '2025-05-30', 'ACTIVE'),
	('3b5ab044-95e3-11f1-ad8c-088e902d5f0e', '3b58f990-95e3-11f1-ad8c-088e902d5f0e', '3b586de4-95e3-11f1-ad8c-088e902d5f0e', 'Harvest Supervisor', 3000.00, '2025-06-09', 'ACTIVE');

-- Dumping structure for table farm_management.equipment
CREATE TABLE IF NOT EXISTS `equipment` (
  `equipment_id` char(36) NOT NULL,
  `farm_id` char(36) NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `equipment_type` varchar(80) NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `purchase_cost` decimal(12,2) DEFAULT NULL,
  `equipment_status` varchar(20) NOT NULL DEFAULT 'AVAILABLE',
  PRIMARY KEY (`equipment_id`),
  KEY `farm_id` (`farm_id`),
  FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_equipment_cost` CHECK (`purchase_cost` is null or `purchase_cost` >= 0),
  CONSTRAINT `chk_equipment_status` CHECK (`equipment_status` in ('AVAILABLE','IN_USE','MAINTENANCE','RETIRED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.equipment: ~15 rows (approximately)
INSERT INTO `equipment` (`equipment_id`, `farm_id`, `equipment_name`, `equipment_type`, `purchase_date`, `purchase_cost`, `equipment_status`) VALUES
	('3b5dc919-95e3-11f1-ad8c-088e902d5f0e', '3b586b26-95e3-11f1-ad8c-088e902d5f0e', 'John Deere Tractor', 'Tractor', '2025-01-05', 85000.00, 'AVAILABLE'),
	('3b5dcb21-95e3-11f1-ad8c-088e902d5f0e', '3b586c7c-95e3-11f1-ad8c-088e902d5f0e', 'Massey Ferguson Tractor', 'Tractor', '2025-02-10', 78000.00, 'IN_USE'),
	('3b5dcbda-95e3-11f1-ad8c-088e902d5f0e', '3b586ceb-95e3-11f1-ad8c-088e902d5f0e', 'Honda Water Pump', 'Water Pump', '2025-03-12', 6500.00, 'AVAILABLE'),
	('3b5dcc45-95e3-11f1-ad8c-088e902d5f0e', '3b586d06-95e3-11f1-ad8c-088e902d5f0e', 'Irrigation Pump', 'Irrigation', '2025-04-15', 12000.00, 'AVAILABLE'),
	('3b5dcca3-95e3-11f1-ad8c-088e902d5f0e', '3b586d1c-95e3-11f1-ad8c-088e902d5f0e', 'Rotary Tiller', 'Tiller', '2025-05-20', 18000.00, 'MAINTENANCE'),
	('3b5dccdf-95e3-11f1-ad8c-088e902d5f0e', '3b586d33-95e3-11f1-ad8c-088e902d5f0e', 'Rice Transplanter', 'Planter', '2025-06-05', 32000.00, 'AVAILABLE'),
	('3b5dcd18-95e3-11f1-ad8c-088e902d5f0e', '3b586d46-95e3-11f1-ad8c-088e902d5f0e', 'Knapsack Sprayer', 'Sprayer', '2025-06-18', 1800.00, 'AVAILABLE'),
	('3b5dcd50-95e3-11f1-ad8c-088e902d5f0e', '3b586d5a-95e3-11f1-ad8c-088e902d5f0e', 'Motorized Cultivator', 'Cultivator', '2025-07-02', 22000.00, 'IN_USE'),
	('3b5dcd8a-95e3-11f1-ad8c-088e902d5f0e', '3b586d71-95e3-11f1-ad8c-088e902d5f0e', 'Harvesting Machine', 'Harvester', '2025-07-15', 65000.00, 'AVAILABLE'),
	('3b5dcdc3-95e3-11f1-ad8c-088e902d5f0e', '3b586d84-95e3-11f1-ad8c-088e902d5f0e', 'Seed Drill', 'Seeder', '2025-08-01', 28000.00, 'AVAILABLE'),
	('3b5dcdfb-95e3-11f1-ad8c-088e902d5f0e', '3b586d97-95e3-11f1-ad8c-088e902d5f0e', 'Water Tanker', 'Tanker', '2025-08-20', 42000.00, 'AVAILABLE'),
	('3b5dce32-95e3-11f1-ad8c-088e902d5f0e', '3b586daa-95e3-11f1-ad8c-088e902d5f0e', 'Brush Cutter', 'Cutter', '2025-09-05', 4500.00, 'AVAILABLE'),
	('3b5dce6c-95e3-11f1-ad8c-088e902d5f0e', '3b586dbe-95e3-11f1-ad8c-088e902d5f0e', 'Solar Pump', 'Water Pump', '2025-09-18', 15000.00, 'AVAILABLE'),
	('3b5dcea5-95e3-11f1-ad8c-088e902d5f0e', '3b586dd1-95e3-11f1-ad8c-088e902d5f0e', 'Disc Harrow', 'Harrow', '2025-10-03', 19500.00, 'AVAILABLE'),
	('3b5dcede-95e3-11f1-ad8c-088e902d5f0e', '3b586de4-95e3-11f1-ad8c-088e902d5f0e', 'Trailer', 'Trailer', '2025-10-20', 35000.00, 'AVAILABLE');

-- Dumping structure for table farm_management.equipment_maintenance
CREATE TABLE IF NOT EXISTS `equipment_maintenance` (
  `maintenance_id` char(36) NOT NULL,
  `equipment_id` char(36) NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_type` varchar(80) NOT NULL,
  `cost` decimal(12,2) NOT NULL DEFAULT 0.00,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`maintenance_id`),
  KEY `equipment_id` (`equipment_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  CONSTRAINT `chk_maintenance_cost` CHECK (`cost` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.equipment_maintenance: ~15 rows (approximately)
INSERT INTO `equipment_maintenance` (`maintenance_id`, `equipment_id`, `maintenance_date`, `maintenance_type`, `cost`, `description`) VALUES
	('3b5edb42-95e3-11f1-ad8c-088e902d5f0e', '3b5dc919-95e3-11f1-ad8c-088e902d5f0e', '2026-01-10', 'Oil Change', 375.00, 'Routine scheduled maintenance'),
	('3b5edce7-95e3-11f1-ad8c-088e902d5f0e', '3b5dcb21-95e3-11f1-ad8c-088e902d5f0e', '2026-01-15', 'Engine Service', 450.00, 'Routine scheduled maintenance'),
	('3b5edd8c-95e3-11f1-ad8c-088e902d5f0e', '3b5dcbda-95e3-11f1-ad8c-088e902d5f0e', '2026-01-20', 'Tyre Replacement', 525.00, 'Routine scheduled maintenance'),
	('3b5eddfe-95e3-11f1-ad8c-088e902d5f0e', '3b5dcc45-95e3-11f1-ad8c-088e902d5f0e', '2026-01-25', 'General Inspection', 600.00, 'Routine scheduled maintenance'),
	('3b5ede59-95e3-11f1-ad8c-088e902d5f0e', '3b5dcca3-95e3-11f1-ad8c-088e902d5f0e', '2026-01-30', 'Oil Change', 675.00, 'Routine scheduled maintenance'),
	('3b5ede98-95e3-11f1-ad8c-088e902d5f0e', '3b5dccdf-95e3-11f1-ad8c-088e902d5f0e', '2026-02-04', 'Engine Service', 750.00, 'Routine scheduled maintenance'),
	('3b5eded5-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd18-95e3-11f1-ad8c-088e902d5f0e', '2026-02-09', 'Tyre Replacement', 825.00, 'Routine scheduled maintenance'),
	('3b5edf12-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd50-95e3-11f1-ad8c-088e902d5f0e', '2026-02-14', 'General Inspection', 900.00, 'Routine scheduled maintenance'),
	('3b5edf4f-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd8a-95e3-11f1-ad8c-088e902d5f0e', '2026-02-19', 'Oil Change', 975.00, 'Routine scheduled maintenance'),
	('3b5edf8a-95e3-11f1-ad8c-088e902d5f0e', '3b5dcdc3-95e3-11f1-ad8c-088e902d5f0e', '2026-02-24', 'Engine Service', 1050.00, 'Routine scheduled maintenance'),
	('3b5edfc3-95e3-11f1-ad8c-088e902d5f0e', '3b5dcdfb-95e3-11f1-ad8c-088e902d5f0e', '2026-03-01', 'Tyre Replacement', 1125.00, 'Routine scheduled maintenance'),
	('3b5edffb-95e3-11f1-ad8c-088e902d5f0e', '3b5dce32-95e3-11f1-ad8c-088e902d5f0e', '2026-03-06', 'General Inspection', 1200.00, 'Routine scheduled maintenance'),
	('3b5ee036-95e3-11f1-ad8c-088e902d5f0e', '3b5dce6c-95e3-11f1-ad8c-088e902d5f0e', '2026-03-11', 'Oil Change', 1275.00, 'Routine scheduled maintenance'),
	('3b5ee072-95e3-11f1-ad8c-088e902d5f0e', '3b5dcea5-95e3-11f1-ad8c-088e902d5f0e', '2026-03-16', 'Engine Service', 1350.00, 'Routine scheduled maintenance'),
	('3b5ee0aa-95e3-11f1-ad8c-088e902d5f0e', '3b5dcede-95e3-11f1-ad8c-088e902d5f0e', '2026-03-21', 'Tyre Replacement', 1425.00, 'Routine scheduled maintenance');

-- Dumping structure for table farm_management.equipment_usage
CREATE TABLE IF NOT EXISTS `equipment_usage` (
  `usage_id` char(36) NOT NULL,
  `equipment_id` char(36) NOT NULL,
  `employment_id` char(36) NOT NULL,
  `usage_date` date NOT NULL,
  `hours_used` decimal(8,2) NOT NULL,
  PRIMARY KEY (`usage_id`),
  KEY `equipment_id` (`equipment_id`),
  KEY `employment_id` (`employment_id`),
  FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  CONSTRAINT `chk_hours_used` CHECK (`hours_used` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.equipment_usage: ~15 rows (approximately)
INSERT INTO `equipment_usage` (`usage_id`, `equipment_id`, `employment_id`, `usage_date`, `hours_used`) VALUES
	('3b5fb48b-95e3-11f1-ad8c-088e902d5f0e', '3b5dc919-95e3-11f1-ad8c-088e902d5f0e', '3b5aa915-95e3-11f1-ad8c-088e902d5f0e', '2026-03-02', 4.00),
	('3b5fb688-95e3-11f1-ad8c-088e902d5f0e', '3b5dcb21-95e3-11f1-ad8c-088e902d5f0e', '3b5aaaf7-95e3-11f1-ad8c-088e902d5f0e', '2026-03-03', 5.00),
	('3b5fb749-95e3-11f1-ad8c-088e902d5f0e', '3b5dcbda-95e3-11f1-ad8c-088e902d5f0e', '3b5aabe7-95e3-11f1-ad8c-088e902d5f0e', '2026-03-04', 6.00),
	('3b5fb7b5-95e3-11f1-ad8c-088e902d5f0e', '3b5dcc45-95e3-11f1-ad8c-088e902d5f0e', '3b5aac8d-95e3-11f1-ad8c-088e902d5f0e', '2026-03-05', 7.00),
	('3b5fb819-95e3-11f1-ad8c-088e902d5f0e', '3b5dcca3-95e3-11f1-ad8c-088e902d5f0e', '3b5aacf3-95e3-11f1-ad8c-088e902d5f0e', '2026-03-06', 8.00),
	('3b5fb875-95e3-11f1-ad8c-088e902d5f0e', '3b5dccdf-95e3-11f1-ad8c-088e902d5f0e', '3b5aad45-95e3-11f1-ad8c-088e902d5f0e', '2026-03-07', 9.00),
	('3b5fb8d5-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd18-95e3-11f1-ad8c-088e902d5f0e', '3b5aad9a-95e3-11f1-ad8c-088e902d5f0e', '2026-03-08', 10.00),
	('3b5fb933-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd50-95e3-11f1-ad8c-088e902d5f0e', '3b5aaded-95e3-11f1-ad8c-088e902d5f0e', '2026-03-09', 11.00),
	('3b5fb994-95e3-11f1-ad8c-088e902d5f0e', '3b5dcd8a-95e3-11f1-ad8c-088e902d5f0e', '3b5aae45-95e3-11f1-ad8c-088e902d5f0e', '2026-03-10', 12.00),
	('3b5fb9ef-95e3-11f1-ad8c-088e902d5f0e', '3b5dcdc3-95e3-11f1-ad8c-088e902d5f0e', '3b5aae97-95e3-11f1-ad8c-088e902d5f0e', '2026-03-11', 13.00),
	('3b5fba47-95e3-11f1-ad8c-088e902d5f0e', '3b5dcdfb-95e3-11f1-ad8c-088e902d5f0e', '3b5aaee9-95e3-11f1-ad8c-088e902d5f0e', '2026-03-12', 14.00),
	('3b5fbaa3-95e3-11f1-ad8c-088e902d5f0e', '3b5dce32-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf3c-95e3-11f1-ad8c-088e902d5f0e', '2026-03-13', 15.00),
	('3b5fbb06-95e3-11f1-ad8c-088e902d5f0e', '3b5dce6c-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf94-95e3-11f1-ad8c-088e902d5f0e', '2026-03-14', 16.00),
	('3b5fbb68-95e3-11f1-ad8c-088e902d5f0e', '3b5dcea5-95e3-11f1-ad8c-088e902d5f0e', '3b5aafeb-95e3-11f1-ad8c-088e902d5f0e', '2026-03-15', 17.00),
	('3b5fbbc9-95e3-11f1-ad8c-088e902d5f0e', '3b5dcede-95e3-11f1-ad8c-088e902d5f0e', '3b5ab044-95e3-11f1-ad8c-088e902d5f0e', '2026-03-16', 18.00);

-- Dumping structure for table farm_management.farm
CREATE TABLE IF NOT EXISTS `farm` (
  `farm_id` char(36) NOT NULL,
  `farm_name` varchar(100) NOT NULL,
  `location` varchar(150) NOT NULL,
  `size` decimal(10,2) NOT NULL,
  `farm_status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`farm_id`),
  CONSTRAINT `chk_farm_size` CHECK (`size` > 0),
  CONSTRAINT `chk_farm_status` CHECK (`farm_status` in ('ACTIVE','INACTIVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.farm: ~15 rows (approximately)
INSERT INTO `farm` (`farm_id`, `farm_name`, `location`, `size`, `farm_status`, `created_at`, `updated_at`) VALUES
	('3b586b26-95e3-11f1-ad8c-088e902d5f0e', 'Green Valley Farm', 'Kumasi', 120.50, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586c7c-95e3-11f1-ad8c-088e902d5f0e', 'Sunrise Agricultural Farm', 'Tamale', 200.00, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586ceb-95e3-11f1-ad8c-088e902d5f0e', 'Golden Harvest Farm', 'Accra', 85.75, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d06-95e3-11f1-ad8c-088e902d5f0e', 'Blue River Farm', 'Koforidua', 95.20, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d1c-95e3-11f1-ad8c-088e902d5f0e', 'Peaceful Fields Farm', 'Ho', 110.40, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d33-95e3-11f1-ad8c-088e902d5f0e', 'Northern Star Farm', 'Wa', 175.60, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d46-95e3-11f1-ad8c-088e902d5f0e', 'Adom Farms', 'Sunyani', 130.80, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d5a-95e3-11f1-ad8c-088e902d5f0e', 'Royal Roots Farm', 'Techiman', 145.25, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d71-95e3-11f1-ad8c-088e902d5f0e', 'Fresh Earth Farm', 'Cape Coast', 90.00, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d84-95e3-11f1-ad8c-088e902d5f0e', 'Unity Agro Farm', 'Takoradi', 105.50, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586d97-95e3-11f1-ad8c-088e902d5f0e', 'Prosperity Farm', 'Bolgatanga', 160.75, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586daa-95e3-11f1-ad8c-088e902d5f0e', 'Evergreen Farms', 'Nkawkaw', 75.30, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586dbe-95e3-11f1-ad8c-088e902d5f0e', 'Harvest Plus Farm', 'Obuasi', 115.90, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586dd1-95e3-11f1-ad8c-088e902d5f0e', 'Farmers Pride Farm', 'Dambai', 140.10, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b586de4-95e3-11f1-ad8c-088e902d5f0e', 'New Dawn Farm', 'Berekum', 100.00, 'ACTIVE', '2026-08-12 00:17:25', '2026-08-12 00:17:25');

-- Dumping structure for table farm_management.fertilizer
CREATE TABLE IF NOT EXISTS `fertilizer` (
  `fertilizer_id` char(36) NOT NULL,
  `fertilizer_name` varchar(100) NOT NULL,
  `fertilizer_type` varchar(80) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`fertilizer_id`),
  UNIQUE KEY `fertilizer_name` (`fertilizer_name`),
  CONSTRAINT `chk_fertilizer_price` CHECK (`unit_price` >= 0),
  CONSTRAINT `chk_fertilizer_quantity` CHECK (`quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.fertilizer: ~15 rows (approximately)
INSERT INTO `fertilizer` (`fertilizer_id`, `fertilizer_name`, `fertilizer_type`, `unit_price`, `quantity`) VALUES
	('3b60c809-95e3-11f1-ad8c-088e902d5f0e', 'NPK 15-15-15', 'Granular', 25.00, 1000.00),
	('3b60c971-95e3-11f1-ad8c-088e902d5f0e', 'NPK 20-10-10', 'Granular', 28.00, 900.00),
	('3b60c9e8-95e3-11f1-ad8c-088e902d5f0e', 'Urea', 'Nitrogen', 22.00, 1200.00),
	('3b60ca13-95e3-11f1-ad8c-088e902d5f0e', 'DAP', 'Phosphate', 30.00, 800.00),
	('3b60ca32-95e3-11f1-ad8c-088e902d5f0e', 'MOP', 'Potassium', 24.00, 700.00),
	('3b60ca4d-95e3-11f1-ad8c-088e902d5f0e', 'Ammonium Sulphate', 'Nitrogen', 20.00, 950.00),
	('3b60ca67-95e3-11f1-ad8c-088e902d5f0e', 'CAN', 'Nitrogen', 23.00, 850.00),
	('3b60ca81-95e3-11f1-ad8c-088e902d5f0e', 'SSP', 'Phosphate', 18.00, 650.00),
	('3b60caa0-95e3-11f1-ad8c-088e902d5f0e', 'Potassium Nitrate', 'Potassium', 35.00, 500.00),
	('3b60cabb-95e3-11f1-ad8c-088e902d5f0e', 'Organic Compost', 'Organic', 10.00, 1500.00),
	('3b60cad8-95e3-11f1-ad8c-088e902d5f0e', 'Poultry Manure', 'Organic', 8.00, 1800.00),
	('3b60caf7-95e3-11f1-ad8c-088e902d5f0e', 'Fish Fertilizer', 'Organic', 15.00, 600.00),
	('3b60cb10-95e3-11f1-ad8c-088e902d5f0e', 'Bio Fertilizer A', 'Bio', 19.00, 500.00),
	('3b60cb2c-95e3-11f1-ad8c-088e902d5f0e', 'Bio Fertilizer B', 'Bio', 21.00, 550.00),
	('3b60cb4c-95e3-11f1-ad8c-088e902d5f0e', 'Foliar Feed', 'Liquid', 27.00, 450.00);

-- Dumping structure for table farm_management.fertilizer_application
CREATE TABLE IF NOT EXISTS `fertilizer_application` (
  `application_id` char(36) NOT NULL,
  `crop_id` char(36) NOT NULL,
  `employment_id` char(36) NOT NULL,
  `fertilizer_id` char(36) NOT NULL,
  `application_date` date NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `crop_id` (`crop_id`),
  KEY `employment_id` (`employment_id`),
  KEY `fertilizer_id` (`fertilizer_id`),
  FOREIGN KEY (`crop_id`) REFERENCES `crop` (`crop_id`),
  FOREIGN KEY (`employment_id`) REFERENCES `employment` (`employment_id`),
  FOREIGN KEY (`fertilizer_id`) REFERENCES `fertilizer` (`fertilizer_id`),
  CONSTRAINT `chk_application_quantity` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.fertilizer_application: ~15 rows (approximately)
INSERT INTO `fertilizer_application` (`application_id`, `crop_id`, `employment_id`, `fertilizer_id`, `application_date`, `quantity`, `notes`) VALUES
	('3b628d13-95e3-11f1-ad8c-088e902d5f0e', '3b5b5af2-95e3-11f1-ad8c-088e902d5f0e', '3b5aa915-95e3-11f1-ad8c-088e902d5f0e', '3b60c809-95e3-11f1-ad8c-088e902d5f0e', '2026-02-02', 21.00, 'Scheduled fertilizer application'),
	('3b628fc3-95e3-11f1-ad8c-088e902d5f0e', '3b5b5c92-95e3-11f1-ad8c-088e902d5f0e', '3b5aaaf7-95e3-11f1-ad8c-088e902d5f0e', '3b60c9e8-95e3-11f1-ad8c-088e902d5f0e', '2026-02-03', 22.00, 'Scheduled fertilizer application'),
	('3b6290ae-95e3-11f1-ad8c-088e902d5f0e', '3b5b5d2b-95e3-11f1-ad8c-088e902d5f0e', '3b5aabe7-95e3-11f1-ad8c-088e902d5f0e', '3b60ca13-95e3-11f1-ad8c-088e902d5f0e', '2026-02-04', 23.00, 'Scheduled fertilizer application'),
	('3b629130-95e3-11f1-ad8c-088e902d5f0e', '3b5b5d6d-95e3-11f1-ad8c-088e902d5f0e', '3b5aac8d-95e3-11f1-ad8c-088e902d5f0e', '3b60ca32-95e3-11f1-ad8c-088e902d5f0e', '2026-02-05', 24.00, 'Scheduled fertilizer application'),
	('3b6291b7-95e3-11f1-ad8c-088e902d5f0e', '3b5b5da9-95e3-11f1-ad8c-088e902d5f0e', '3b5aacf3-95e3-11f1-ad8c-088e902d5f0e', '3b60cabb-95e3-11f1-ad8c-088e902d5f0e', '2026-02-06', 25.00, 'Scheduled fertilizer application'),
	('3b62922c-95e3-11f1-ad8c-088e902d5f0e', '3b5b5ddf-95e3-11f1-ad8c-088e902d5f0e', '3b5aad45-95e3-11f1-ad8c-088e902d5f0e', '3b60c809-95e3-11f1-ad8c-088e902d5f0e', '2026-02-07', 26.00, 'Scheduled fertilizer application'),
	('3b6292a6-95e3-11f1-ad8c-088e902d5f0e', '3b5b5e16-95e3-11f1-ad8c-088e902d5f0e', '3b5aad9a-95e3-11f1-ad8c-088e902d5f0e', '3b60c9e8-95e3-11f1-ad8c-088e902d5f0e', '2026-02-08', 27.00, 'Scheduled fertilizer application'),
	('3b629321-95e3-11f1-ad8c-088e902d5f0e', '3b5b5e4b-95e3-11f1-ad8c-088e902d5f0e', '3b5aaded-95e3-11f1-ad8c-088e902d5f0e', '3b60ca13-95e3-11f1-ad8c-088e902d5f0e', '2026-02-09', 28.00, 'Scheduled fertilizer application'),
	('3b62939e-95e3-11f1-ad8c-088e902d5f0e', '3b5b5e81-95e3-11f1-ad8c-088e902d5f0e', '3b5aae45-95e3-11f1-ad8c-088e902d5f0e', '3b60ca32-95e3-11f1-ad8c-088e902d5f0e', '2026-02-10', 29.00, 'Scheduled fertilizer application'),
	('3b629416-95e3-11f1-ad8c-088e902d5f0e', '3b5b5eb6-95e3-11f1-ad8c-088e902d5f0e', '3b5aae97-95e3-11f1-ad8c-088e902d5f0e', '3b60cabb-95e3-11f1-ad8c-088e902d5f0e', '2026-02-11', 30.00, 'Scheduled fertilizer application'),
	('3b629516-95e3-11f1-ad8c-088e902d5f0e', '3b5b5eea-95e3-11f1-ad8c-088e902d5f0e', '3b5aaee9-95e3-11f1-ad8c-088e902d5f0e', '3b60c809-95e3-11f1-ad8c-088e902d5f0e', '2026-02-12', 31.00, 'Scheduled fertilizer application'),
	('3b629595-95e3-11f1-ad8c-088e902d5f0e', '3b5b5f1f-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf3c-95e3-11f1-ad8c-088e902d5f0e', '3b60c9e8-95e3-11f1-ad8c-088e902d5f0e', '2026-02-13', 32.00, 'Scheduled fertilizer application'),
	('3b629612-95e3-11f1-ad8c-088e902d5f0e', '3b5b5f56-95e3-11f1-ad8c-088e902d5f0e', '3b5aaf94-95e3-11f1-ad8c-088e902d5f0e', '3b60ca13-95e3-11f1-ad8c-088e902d5f0e', '2026-02-14', 33.00, 'Scheduled fertilizer application'),
	('3b629697-95e3-11f1-ad8c-088e902d5f0e', '3b5b5f8c-95e3-11f1-ad8c-088e902d5f0e', '3b5aafeb-95e3-11f1-ad8c-088e902d5f0e', '3b60ca32-95e3-11f1-ad8c-088e902d5f0e', '2026-02-15', 34.00, 'Scheduled fertilizer application'),
	('3b62971e-95e3-11f1-ad8c-088e902d5f0e', '3b5b5fc7-95e3-11f1-ad8c-088e902d5f0e', '3b5ab044-95e3-11f1-ad8c-088e902d5f0e', '3b60cabb-95e3-11f1-ad8c-088e902d5f0e', '2026-02-16', 35.00, 'Scheduled fertilizer application');

-- Dumping structure for table farm_management.fertilizer_transaction
CREATE TABLE IF NOT EXISTS `fertilizer_transaction` (
  `transaction_id` char(36) NOT NULL,
  `fertilizer_id` char(36) NOT NULL,
  `transaction_type` varchar(20) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `transaction_date` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`transaction_id`),
  KEY `fertilizer_id` (`fertilizer_id`),
  FOREIGN KEY (`fertilizer_id`) REFERENCES `fertilizer` (`fertilizer_id`),
  CONSTRAINT `chk_fertilizer_transaction_type` CHECK (`transaction_type` in ('PURCHASE','USAGE','ADJUSTMENT')),
  CONSTRAINT `chk_fertilizer_transaction_qty` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.fertilizer_transaction: ~15 rows (approximately)
INSERT INTO `fertilizer_transaction` (`transaction_id`, `fertilizer_id`, `transaction_type`, `quantity`, `unit_price`, `transaction_date`) VALUES
	('3b616e00-95e3-11f1-ad8c-088e902d5f0e', '3b60ca4d-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 20.00, '2026-01-02 00:00:00'),
	('3b616f5c-95e3-11f1-ad8c-088e902d5f0e', '3b60cb10-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 19.00, '2026-01-03 00:00:00'),
	('3b616ff8-95e3-11f1-ad8c-088e902d5f0e', '3b60cb2c-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 21.00, '2026-01-04 00:00:00'),
	('3b617037-95e3-11f1-ad8c-088e902d5f0e', '3b60ca67-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 23.00, '2026-01-05 00:00:00'),
	('3b617070-95e3-11f1-ad8c-088e902d5f0e', '3b60ca13-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 30.00, '2026-01-06 00:00:00'),
	('3b6170a2-95e3-11f1-ad8c-088e902d5f0e', '3b60caf7-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 15.00, '2026-01-07 00:00:00'),
	('3b6170d9-95e3-11f1-ad8c-088e902d5f0e', '3b60cb4c-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 27.00, '2026-01-08 00:00:00'),
	('3b617112-95e3-11f1-ad8c-088e902d5f0e', '3b60ca32-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 24.00, '2026-01-09 00:00:00'),
	('3b617146-95e3-11f1-ad8c-088e902d5f0e', '3b60c809-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 25.00, '2026-01-10 00:00:00'),
	('3b617176-95e3-11f1-ad8c-088e902d5f0e', '3b60c971-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 28.00, '2026-01-11 00:00:00'),
	('3b6171a8-95e3-11f1-ad8c-088e902d5f0e', '3b60cabb-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 10.00, '2026-01-12 00:00:00'),
	('3b6171da-95e3-11f1-ad8c-088e902d5f0e', '3b60caa0-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 35.00, '2026-01-13 00:00:00'),
	('3b61720a-95e3-11f1-ad8c-088e902d5f0e', '3b60cad8-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 8.00, '2026-01-14 00:00:00'),
	('3b61723e-95e3-11f1-ad8c-088e902d5f0e', '3b60ca81-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 18.00, '2026-01-15 00:00:00'),
	('3b617272-95e3-11f1-ad8c-088e902d5f0e', '3b60c9e8-95e3-11f1-ad8c-088e902d5f0e', 'PURCHASE', 300.00, 22.00, '2026-01-16 00:00:00');

-- Tables missing from the supplied SQL but required by sale_item, triggers and procedure
CREATE TABLE IF NOT EXISTS `inventory` (
  `inventory_id` char(36) NOT NULL,
  `farm_id` char(36) DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `quantity` decimal(12,2) NOT NULL DEFAULT 0.00,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`inventory_id`),
  KEY `farm_id` (`farm_id`),
  CONSTRAINT `fk_inventory_farm` FOREIGN KEY (`farm_id`) REFERENCES `farm` (`farm_id`),
  CONSTRAINT `chk_inventory_qty` CHECK (`quantity` >= 0),
  CONSTRAINT `chk_inventory_price` CHECK (`unit_price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sale` (
  `sale_id` char(36) NOT NULL,
  `customer_id` char(36) DEFAULT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sale_status` varchar(20) NOT NULL DEFAULT 'UNPAID',
  PRIMARY KEY (`sale_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `fk_sale_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `chk_sale_total` CHECK (`total` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payment` (
  `payment_id` char(36) NOT NULL,
  `sale_id` char(36) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(30) NOT NULL,
  `payment_status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`payment_id`),
  KEY `sale_id` (`sale_id`),
  CONSTRAINT `fk_payment_sale` FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`),
  CONSTRAINT `chk_payment_amount` CHECK (`amount` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inventory_transaction` (
  `transaction_id` char(36) NOT NULL,
  `inventory_id` char(36) NOT NULL,
  `transaction_type` varchar(20) NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`transaction_id`),
  KEY `inventory_id` (`inventory_id`),
  CONSTRAINT `fk_inventory_transaction_inventory` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  CONSTRAINT `chk_inventory_transaction_qty` CHECK (`quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `inventory` (`inventory_id`,`item_name`,`quantity`,`unit_price`) VALUES
('3b644ac8-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 1',1000.00,10.00),
('3b644d9d-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 2',1000.00,10.00),
('3b644ea9-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 3',1000.00,10.00),
('3b644f3f-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 4',1000.00,10.00),
('3b644fcc-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 5',1000.00,10.00),
('3b64503e-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 6',1000.00,10.00),
('3b6450b1-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 7',1000.00,10.00),
('3b645136-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 8',1000.00,10.00),
('3b645199-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 9',1000.00,10.00),
('3b6451eb-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 10',1000.00,10.00),
('3b64523c-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 11',1000.00,10.00),
('3b645292-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 12',1000.00,10.00),
('3b6452e9-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 13',1000.00,10.00),
('3b645340-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 14',1000.00,10.00),
('3b645398-95e3-11f1-ad8c-088e902d5f0e','Harvest Product 15',1000.00,10.00);

INSERT INTO `sale` (`sale_id`,`sale_date`,`total`,`sale_status`) VALUES
('b12c3c96-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4114-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c424e-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c42cb-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4341-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c43ab-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4415-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c447f-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c44ef-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4555-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c45bd-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4627-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4696-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c4706-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID'),
('b12c477d-95e4-11f1-ad8c-088e902d5f0e',CURRENT_TIMESTAMP,0.00,'UNPAID');

-- Dumping structure for table farm_management.sale_item
CREATE TABLE IF NOT EXISTS `sale_item` (
  `sale_item_id` char(36) NOT NULL,
  `sale_id` char(36) NOT NULL,
  `inventory_id` char(36) NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`sale_item_id`),
  KEY `sale_id` (`sale_id`),
  KEY `inventory_id` (`inventory_id`),
  FOREIGN KEY (`sale_id`) REFERENCES `sale` (`sale_id`),
  FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  CONSTRAINT `chk_sale_item_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_sale_item_price` CHECK (`unit_price` >= 0),
  CONSTRAINT `chk_sale_item_subtotal` CHECK (`subtotal` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.sale_item: ~17 rows (approximately)
INSERT INTO `sale_item` (`sale_item_id`, `sale_id`, `inventory_id`, `quantity`, `unit_price`, `subtotal`) VALUES
	('544e7d85-95e5-11f1-ad8c-088e902d5f0e', 'b12c3c96-95e4-11f1-ad8c-088e902d5f0e', '3b645199-95e3-11f1-ad8c-088e902d5f0e', 100.00, 8.50, 850.00),
	('5bab28fe-95e5-11f1-ad8c-088e902d5f0e', 'b12c3c96-95e4-11f1-ad8c-088e902d5f0e', '3b645199-95e3-11f1-ad8c-088e902d5f0e', 100.00, 8.50, 850.00),
	('c5085012-95e4-11f1-ad8c-088e902d5f0e', 'b12c3c96-95e4-11f1-ad8c-088e902d5f0e', '3b645199-95e3-11f1-ad8c-088e902d5f0e', 100.00, 8.50, 850.00),
	('c50a3ec8-95e4-11f1-ad8c-088e902d5f0e', 'b12c4114-95e4-11f1-ad8c-088e902d5f0e', '3b645136-95e3-11f1-ad8c-088e902d5f0e', 100.00, 6.00, 600.00),
	('c50b0f0e-95e4-11f1-ad8c-088e902d5f0e', 'b12c424e-95e4-11f1-ad8c-088e902d5f0e', '3b644f3f-95e3-11f1-ad8c-088e902d5f0e', 100.00, 12.00, 1200.00),
	('c50bd511-95e4-11f1-ad8c-088e902d5f0e', 'b12c42cb-95e4-11f1-ad8c-088e902d5f0e', '3b645292-95e3-11f1-ad8c-088e902d5f0e', 100.00, 4.50, 450.00),
	('c50c9152-95e4-11f1-ad8c-088e902d5f0e', 'b12c4341-95e4-11f1-ad8c-088e902d5f0e', '3b645340-95e3-11f1-ad8c-088e902d5f0e', 100.00, 7.00, 700.00),
	('c50d78e6-95e4-11f1-ad8c-088e902d5f0e', 'b12c43ab-95e4-11f1-ad8c-088e902d5f0e', '3b644d9d-95e3-11f1-ad8c-088e902d5f0e', 100.00, 10.00, 1000.00),
	('c50e4ed1-95e4-11f1-ad8c-088e902d5f0e', 'b12c4415-95e4-11f1-ad8c-088e902d5f0e', '3b6452e9-95e3-11f1-ad8c-088e902d5f0e', 100.00, 9.00, 900.00),
	('c50f09cc-95e4-11f1-ad8c-088e902d5f0e', 'b12c447f-95e4-11f1-ad8c-088e902d5f0e', '3b6450b1-95e3-11f1-ad8c-088e902d5f0e', 100.00, 8.00, 800.00),
	('c50fb17e-95e4-11f1-ad8c-088e902d5f0e', 'b12c44ef-95e4-11f1-ad8c-088e902d5f0e', '3b644ea9-95e3-11f1-ad8c-088e902d5f0e', 100.00, 6.50, 650.00),
	('c510415a-95e4-11f1-ad8c-088e902d5f0e', 'b12c4555-95e4-11f1-ad8c-088e902d5f0e', '3b644fcc-95e3-11f1-ad8c-088e902d5f0e', 100.00, 11.00, 1100.00),
	('c510ea2a-95e4-11f1-ad8c-088e902d5f0e', 'b12c45bd-95e4-11f1-ad8c-088e902d5f0e', '3b64503e-95e3-11f1-ad8c-088e902d5f0e', 100.00, 9.00, 900.00),
	('c511aeda-95e4-11f1-ad8c-088e902d5f0e', 'b12c4627-95e4-11f1-ad8c-088e902d5f0e', '3b6451eb-95e3-11f1-ad8c-088e902d5f0e', 100.00, 7.50, 750.00),
	('c512630f-95e4-11f1-ad8c-088e902d5f0e', 'b12c4696-95e4-11f1-ad8c-088e902d5f0e', '3b645398-95e3-11f1-ad8c-088e902d5f0e', 100.00, 10.00, 1000.00),
	('c51336e5-95e4-11f1-ad8c-088e902d5f0e', 'b12c4706-95e4-11f1-ad8c-088e902d5f0e', '3b644ac8-95e3-11f1-ad8c-088e902d5f0e', 100.00, 8.00, 800.00),
	('c5d1c68d-95e4-11f1-ad8c-088e902d5f0e', 'b12c477d-95e4-11f1-ad8c-088e902d5f0e', '3b64523c-95e3-11f1-ad8c-088e902d5f0e', 100.00, 5.50, 550.00);

-- Dumping structure for procedure farm_management.sp_record_sale_item
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

    INSERT INTO SALE_ITEM
        (sale_id, inventory_id, quantity, unit_price, subtotal)
    VALUES
        (p_sale_id, p_inventory_id, p_quantity, p_unit_price, v_subtotal);

    UPDATE SALE
    SET total = (
        SELECT COALESCE(SUM(subtotal), 0)
        FROM SALE_ITEM
        WHERE sale_id = p_sale_id
    )
    WHERE sale_id = p_sale_id;
END//
DELIMITER ;

-- Dumping structure for table farm_management.user_account
CREATE TABLE IF NOT EXISTS `user_account` (
  `account_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `account_status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `role` varchar(20) NOT NULL DEFAULT 'USER',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `fk_account_user` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`user_id`),
  CONSTRAINT `chk_account_status` CHECK (`account_status` in ('ACTIVE','INACTIVE','SUSPENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table farm_management.user_account: ~15 rows (approximately)
INSERT INTO `user_account` (`account_id`, `user_id`, `username`, `password_hash`, `account_status`, `role`, `created_at`, `updated_at`) VALUES
	('3b59b4c7-95e3-11f1-ad8c-088e902d5f0e', '3b58f5cb-95e3-11f1-ad8c-088e902d5f0e', 'kwame.mensah', 'HASHED_PASSWORD_1', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b620-95e3-11f1-ad8c-088e902d5f0e', '3b58f7a8-95e3-11f1-ad8c-088e902d5f0e', 'ama.owusu', 'HASHED_PASSWORD_2', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b6a7-95e3-11f1-ad8c-088e902d5f0e', '3b58f83a-95e3-11f1-ad8c-088e902d5f0e', 'kofi.asare', 'HASHED_PASSWORD_3', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b6dd-95e3-11f1-ad8c-088e902d5f0e', '3b58f860-95e3-11f1-ad8c-088e902d5f0e', 'akosua.boateng', 'HASHED_PASSWORD_4', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b711-95e3-11f1-ad8c-088e902d5f0e', '3b58f87c-95e3-11f1-ad8c-088e902d5f0e', 'yaw.adjei', 'HASHED_PASSWORD_5', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b741-95e3-11f1-ad8c-088e902d5f0e', '3b58f89b-95e3-11f1-ad8c-088e902d5f0e', 'abena.frimpong', 'HASHED_PASSWORD_6', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b76e-95e3-11f1-ad8c-088e902d5f0e', '3b58f8b3-95e3-11f1-ad8c-088e902d5f0e', 'kojo.antwi', 'HASHED_PASSWORD_7', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b79d-95e3-11f1-ad8c-088e902d5f0e', '3b58f8d1-95e3-11f1-ad8c-088e902d5f0e', 'efua.darko', 'HASHED_PASSWORD_8', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b7cf-95e3-11f1-ad8c-088e902d5f0e', '3b58f8f0-95e3-11f1-ad8c-088e902d5f0e', 'kwesi.ofori', 'HASHED_PASSWORD_9', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b7fd-95e3-11f1-ad8c-088e902d5f0e', '3b58f90a-95e3-11f1-ad8c-088e902d5f0e', 'adwoa.asante', 'HASHED_PASSWORD_10', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b82c-95e3-11f1-ad8c-088e902d5f0e', '3b58f922-95e3-11f1-ad8c-088e902d5f0e', 'nana.amoah', 'HASHED_PASSWORD_11', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b85c-95e3-11f1-ad8c-088e902d5f0e', '3b58f943-95e3-11f1-ad8c-088e902d5f0e', 'esi.addo', 'HASHED_PASSWORD_12', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b88b-95e3-11f1-ad8c-088e902d5f0e', '3b58f95c-95e3-11f1-ad8c-088e902d5f0e', 'fiifi.quaye', 'HASHED_PASSWORD_13', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b8e0-95e3-11f1-ad8c-088e902d5f0e', '3b58f975-95e3-11f1-ad8c-088e902d5f0e', 'mavis.tetteh', 'HASHED_PASSWORD_14', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25'),
	('3b59b912-95e3-11f1-ad8c-088e902d5f0e', '3b58f990-95e3-11f1-ad8c-088e902d5f0e', 'selorm.klu', 'HASHED_PASSWORD_15', 'ACTIVE', 'USER', '2026-08-12 00:17:25', '2026-08-12 00:17:25');

-- Dumping structure for trigger farm_management.trg_payment_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_payment_after_insert
AFTER INSERT ON PAYMENT
FOR EACH ROW
BEGIN

    DECLARE paid_amount DECIMAL(12,2);
    DECLARE sale_total DECIMAL(12,2);

    IF NEW.payment_status = 'CONFIRMED' THEN

        SELECT COALESCE(SUM(amount), 0)
        INTO paid_amount
        FROM PAYMENT
        WHERE sale_id = NEW.sale_id
        AND payment_status = 'CONFIRMED';

        SELECT total
        INTO sale_total
        FROM SALE
        WHERE sale_id = NEW.sale_id;

        IF paid_amount >= sale_total THEN

            UPDATE SALE
            SET sale_status = 'PAID'
            WHERE sale_id = NEW.sale_id;

        ELSE

            UPDATE SALE
            SET sale_status = 'PARTIALLY_PAID'
            WHERE sale_id = NEW.sale_id;

        END IF;

    END IF;

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger farm_management.trg_sale_item_after_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_sale_item_after_insert
AFTER INSERT ON SALE_ITEM
FOR EACH ROW
BEGIN

    UPDATE INVENTORY
    SET quantity = quantity - NEW.quantity
    WHERE inventory_id = NEW.inventory_id;

    INSERT INTO INVENTORY_TRANSACTION
    (
        inventory_id,
        transaction_type,
        quantity
    )
    VALUES
    (
        NEW.inventory_id,
        'OUT',
        NEW.quantity
    );

END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger farm_management.trg_sale_item_before_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_sale_item_before_insert
BEFORE INSERT ON SALE_ITEM
FOR EACH ROW
BEGIN
    DECLARE available_qty DECIMAL(12,2);

    SELECT quantity
    INTO available_qty
    FROM INVENTORY
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
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
