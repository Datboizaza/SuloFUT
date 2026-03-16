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

CREATE TABLE rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  packIds VARCHAR(20),
  coins INT
);

INSERT INTO rewards(packIds, coins)
VALUES
(NULL, 2000),
("5", NULL),
("4", NULL),
("7", NULL),
("9", NULL),
("6,7", 50000),
("1", NULL),
("2", NULL),
("3", 5000),
("8", NULL),
("10", NULL),
("11", NULL),
("12", NULL),
("13", NULL),
("14", 50000),
("15", NULL),
("16", NULL),
("17", NULL),
("18", NULL),
("19", NULL);

CREATE TABLE draftRewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  packIds VARCHAR(20),
  coins INT,
  rewardValue VARCHAR(20)
);

INSERT INTO draftrewards(packIds, coins, rewardValue)
VALUES
("3", 2500 , "bad"),
("1,2", 5000 , "bad"),
("2,3", 20000 , "mid"),
("4", 10000 , "mid"),
("7", 20000 , "mid"),
("6", 40000 , "good"),
("3,4,5", 30000 , "good"),
("7,16", 30000 , "great"),
("8", 60000 , "great"),
("6,9,16", 100000 , "excellent");

CREATE TABLE packs (
  id INT PRIMARY KEY,
  packName TEXT NOT NULL,
  packPrice INT NOT NULL,
  packDesign TEXT NOT NULL
);

INSERT INTO packs(id, packName, packPrice, packDesign)
VALUES
(1, "Bronze Pack", 750, "bronze"),
(2, "Silver Pack", 3000, "silver"),
(3, "Gold Pack", 7500, "gold"),
(4, "Jumbo Gold Pack", 12000, "gold"),
(5, "Mixed Players Pack", 6000, "special"),
(6, "Mega Pack", 10000, "special"),
(7, "80+x10 Players Pack", 20000, "special"),
(8, "82+x10 Players Pack", 25000, "special"),
(9, "85+x4 Players Pack", 30000, "special"),
(10, "Icon Pack", 100000, "special"),
(11, "90+ Icon Pack", 200000, "special"),
(12, "SuloFUT Flashback Pack", 70000, "flashback"),
(13, "SuloFUT Scream Pack", 50000, "scream"),
(14, "Hero Pack", 60000, "special"),
(15, "87+ Hero Pack", 20000, "special"),
(16, "Campaign Mix Pack", 80000, "special"),
(17, "88+ Hero or Icon Pack", 80000, "special"),
(18, "TOTY Grind Pack", 50000, "toty"),
(19, "TOTY Pack", 200000, "toty"),
(20, "Welcome Pack", 0, "special");

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