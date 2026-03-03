CREATE DATABASE sulofut
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE sulofut;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE coins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  coinNumber INT NOT NULL DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  best_draft INT NOT NULL DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

/* Coins létrehozása triggers */
DELIMITER $$

CREATE TRIGGER createCoins_afterUserInsert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO coins (user_id, coinNumber)
  VALUES (NEW.id, 0);
END$$

DELIMITER ;

/* Stats létrehozása triggers */
DELIMITER $$

CREATE TRIGGER createStats_afterUserInsert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO stats (user_id, best_draft)
  VALUES (NEW.id, 0);
END$$

DELIMITER ;