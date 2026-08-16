-- Luodaan tietokanta, jos sitä ei vielä ole.
CREATE DATABASE IF NOT EXISTS raportointijarjestelma
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Otetaan juuri luotu tai olemassa oleva tietokanta käyttöön.
USE raportointijarjestelma;

-- Varmistetaan, että kaikki tekstikentät käyttävät UTF-8:n laajennettua muotoa.
SET NAMES utf8mb4;

-- Käyttäjätaulu loginia varten. 
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('operaattori', 'esimies') NOT NULL DEFAULT 'operaattori',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Yksi yhteinen taulu kaikille osastoille. Kentistä osa jää tyhjäksi osastosta riippuen.
CREATE TABLE IF NOT EXISTS production_records (
  id INT NOT NULL AUTO_INCREMENT,
  department ENUM('keitto', 'pakkaamo', 'separointi') NOT NULL,
  record_date DATE NOT NULL,
  record_time TIME NOT NULL,
  product VARCHAR(120) DEFAULT NULL,
  amount DECIMAL(10,2) DEFAULT NULL,
  temperature DECIMAL(5,2) DEFAULT NULL,
  duration_min INT DEFAULT NULL,
  packages_count INT DEFAULT NULL,
  weight_kg DECIMAL(10,2) DEFAULT NULL,
  line_name VARCHAR(120) DEFAULT NULL,
  fat_percentage DECIMAL(4,2) DEFAULT NULL,
  equipment_name VARCHAR(120) DEFAULT NULL,
  operator_name VARCHAR(120) NOT NULL,
  notes VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_department_date (department, record_date, record_time),
  KEY idx_operator (operator_name),
  KEY idx_product (product),
  KEY idx_line (line_name),
  KEY idx_equipment (equipment_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demo-käyttäjät vastaavat Figman testitunnuksia.
INSERT INTO users (username, password, name, role)
VALUES
  ('matti.virtanen', 'meijeri1', 'Matti Virtanen', 'operaattori'),
  ('liisa.makinen', 'meijeri2', 'Liisa Mäkinen', 'operaattori'),
  ('esimies', 'esimies123', 'Timo Korhonen', 'esimies')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role);