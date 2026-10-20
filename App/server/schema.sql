-- SPEAK — core schema for teacher auth, classes, students
-- Loaded automatically by the MySQL container on first start
-- (docker-entrypoint-initdb.d), or run manually with:
--   mysql -h 127.0.0.1 -P 3306 -u root -p speak < schema.sql

CREATE TABLE IF NOT EXISTS teachers (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  full_name               VARCHAR(120) NOT NULL,
  email                   VARCHAR(190) NOT NULL UNIQUE,
  password_hash           VARCHAR(100) NOT NULL,
  is_active               TINYINT(1) NOT NULL DEFAULT 1,
  reset_token_hash        CHAR(64) NULL,
  reset_token_expires_at  TIMESTAMP NULL DEFAULT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS classes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  name       VARCHAR(80) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  class_id       INT NOT NULL,
  display_name   VARCHAR(80) NOT NULL,
  access_code    CHAR(6) NOT NULL UNIQUE,
  status         ENUM('active','deactivated') NOT NULL DEFAULT 'active',
  last_active_at TIMESTAMP NULL DEFAULT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT chk_access_code_numeric CHECK (access_code REGEXP '^[0-9]{6}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_students_class ON students(class_id);
