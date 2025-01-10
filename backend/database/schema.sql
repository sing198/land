-- ============================================================================
-- ALRO Land & Citizen Management System Database Schema
-- Database: alro_land
-- MariaDB / MySQL Compatible
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `alro_land` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `alro_land` ;

-- 1. Roles Table (สิทธิ์การใช้งาน)
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` INT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table (ผู้ใช้งานและเจ้าหน้าที่)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NULL,
  `role_id` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Prefixes Table (คำนำหน้าชื่อ)
CREATE TABLE IF NOT EXISTS `prefixes` (
  `prefix_id` INT AUTO_INCREMENT PRIMARY KEY,
  `prefix_name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Relationships Table (ความสัมพันธ์ทายาท)
CREATE TABLE IF NOT EXISTS `relationships` (
  `relation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `relation_name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Land Statuses Table (สถานะเอกสารสิทธิ์ที่ดิน)
CREATE TABLE IF NOT EXISTS `land_statuses` (
  `id_land_status` INT AUTO_INCREMENT PRIMARY KEY,
  `land_status_name` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Alleys / Sois Table (ซอย)
CREATE TABLE IF NOT EXISTS `alleys` (
  `id_alley` INT AUTO_INCREMENT PRIMARY KEY,
  `alley_number` INT NOT NULL UNIQUE,
  `alley_name` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Citizens Table (ข้อมูลราษฎรผู้ได้รับสิทธิ์)
CREATE TABLE IF NOT EXISTS `citizens` (
  `id_card` VARCHAR(13) PRIMARY KEY,
  `prefix_id` INT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `birthday` DATE NULL,
  `gender` ENUM('male', 'female', 'other') DEFAULT 'male',
  `house_number` VARCHAR(50) NULL,
  `village_number` VARCHAR(50) NULL,
  `subdistrict` VARCHAR(100) NULL,
  `district` VARCHAR(100) NULL,
  `province` VARCHAR(100) DEFAULT 'นครศรีธรรมราช',
  `soi` INT NULL DEFAULT 0,
  `phone_number` VARCHAR(20) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_citizens_prefix` FOREIGN KEY (`prefix_id`) REFERENCES `prefixes` (`prefix_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_citizens_name` (`first_name`, `last_name`),
  INDEX `idx_citizens_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Lands Table (ข้อมูลแปลงที่ดิน ส.ป.ก.)
CREATE TABLE IF NOT EXISTS `lands` (
  `id_land` INT AUTO_INCREMENT PRIMARY KEY,
  `tf_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'แปลงเลขที่',
  `spk_area` VARCHAR(50) NOT NULL COMMENT 'ระวาง ส.ป.ก.',
  `number` VARCHAR(50) NULL COMMENT 'เลขที่',
  `volume` VARCHAR(50) NULL COMMENT 'เล่มที่',
  `l_house_number` VARCHAR(50) NULL,
  `current_soi` INT NOT NULL DEFAULT 0,
  `rai` DECIMAL(10,2) DEFAULT 0.00,
  `ngan` DECIMAL(10,2) DEFAULT 0.00,
  `square_wa` DECIMAL(10,2) DEFAULT 0.00,
  `total_rai` DECIMAL(10,4) GENERATED ALWAYS AS (`rai` + (`ngan` / 4.0) + (`square_wa` / 400.0)) STORED,
  `l_subdistrict` VARCHAR(100) NULL,
  `l_district` VARCHAR(100) NULL,
  `l_village_number` VARCHAR(50) NULL,
  `land_use_type` VARCHAR(100) DEFAULT 'ยางพารา' COMMENT 'ยางพารา, สวนผลไม้, ปศุสัตว์, อื่นๆ',
  `notation` TEXT NULL,
  `current_land_status` INT NOT NULL DEFAULT 1,
  `id_card` VARCHAR(13) NULL,
  `lat` DECIMAL(10,7) NULL,
  `lng` DECIMAL(10,7) NULL,
  `coordinates_polygon` LONGTEXT NULL COMMENT 'JSON string containing polygon coordinates',
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lands_status` FOREIGN KEY (`current_land_status`) REFERENCES `land_statuses` (`id_land_status`) ON UPDATE CASCADE,
  CONSTRAINT `fk_lands_citizen` FOREIGN KEY (`id_card`) REFERENCES `citizens` (`id_card`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_lands_tf` (`tf_number`),
  INDEX `idx_lands_spk` (`spk_area`),
  INDEX `idx_lands_soi` (`current_soi`),
  INDEX `idx_lands_use_type` (`land_use_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Heirs Table (ข้อมูลทายาท)
CREATE TABLE IF NOT EXISTS `heirs` (
  `heir_id` INT AUTO_INCREMENT PRIMARY KEY,
  `prefix_id` INT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone_number` VARCHAR(20) NULL,
  `id_card` VARCHAR(13) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_heirs_prefix` FOREIGN KEY (`prefix_id`) REFERENCES `prefixes` (`prefix_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_heirs_name` (`first_name`, `last_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Citizen-Heir Relationships (ความสัมพันธ์ราษฎรกับทายาท)
CREATE TABLE IF NOT EXISTS `citizen_heirs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `citizen_id` VARCHAR(13) NOT NULL,
  `heir_id` INT NOT NULL,
  `relationship_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ch_citizen` FOREIGN KEY (`citizen_id`) REFERENCES `citizens` (`id_card`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ch_heir` FOREIGN KEY (`heir_id`) REFERENCES `heirs` (`heir_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ch_relation` FOREIGN KEY (`relationship_id`) REFERENCES `relationships` (`relation_id`) ON UPDATE CASCADE,
  UNIQUE KEY `uk_citizen_heir` (`citizen_id`, `heir_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Land Documents & Photos Table (เอกสารและรูปภาพแนบ)
CREATE TABLE IF NOT EXISTS `land_documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_land` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NULL,
  `file_size` INT NULL,
  `category` ENUM('land_title', 'person_doc', 'other') DEFAULT 'land_title',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_documents_land` FOREIGN KEY (`id_land`) REFERENCES `lands` (`id_land`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_documents_land` (`id_land`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Activity Logs / Audit Trails Table (ประวัติการแก้ไข)
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NOT NULL,
  `details` LONGTEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_logs_entity` (`entity_type`, `entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
