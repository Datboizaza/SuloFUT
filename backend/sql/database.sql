-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Már 19. 22:12
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `sulofut`
--
CREATE DATABASE sulofut
DEFAULT CHARACTER SET utf8
COLLATE utf8_hungarian_ci;

USE sulofut;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userClub`
--

CREATE TABLE `userClub` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coinNumber` int(11) NOT NULL DEFAULT 0,
  `userPlayers` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `userClub`
--

INSERT INTO `userClub` (`id`, `user_id`, `coinNumber`) VALUES
(1, 1, 200000);

CREATE TABLE userPacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  pack_id INT(11) NOT NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `draftrewards`
--

CREATE TABLE `draftrewards` (
  `id` int(11) NOT NULL,
  `coins` int(11) DEFAULT NULL,
  `rewardValue` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

CREATE TABLE draftreward_packs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  draftreward_id INT NOT NULL,
  pack_id INT NOT NULL
) ENGINE=InnoDB;

--
-- A tábla adatainak kiíratása `draftrewards`
--

INSERT INTO `draftrewards` (`id`, `coins`, `rewardValue`) VALUES
(1, 2500, 'bad'),
(2, 5000, 'bad'),
(3, 20000, 'mid'),
(4, 10000, 'mid'),
(5, 20000, 'mid'),
(6, 40000, 'good'),
(7, 30000, 'good'),
(8, 30000, 'great'),
(9, 60000, 'great'),
(10, 100000, 'excellent');

INSERT INTO draftreward_packs (draftreward_id, pack_id) VALUES
(1, 3),
(2, 1),
(2, 2),
(3, 2),
(3, 3),
(4, 4),
(5, 7),
(6, 6),
(7, 3),
(7, 4),
(7, 5),
(8, 7),
(8, 16),
(9, 8),
(10, 6),
(10, 9),
(10, 16);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `objcategories`
--

CREATE TABLE `objcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `objcategories`
--

INSERT INTO `objcategories` (`id`, `name`) VALUES
(1, 'foundations'),
(2, 'milestones'),
(3, 'campaign');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `objectives`
--

CREATE TABLE `objectives` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `group_reward` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `objectives`
--

INSERT INTO `objectives` (`id`, `category_id`, `name`, `group_reward`) VALUES
(1, 1, 'Chemistry Mastery', 6),
(2, 1, 'Rating Mastery', 17),
(3, 1, 'Customize your squad', 9),
(4, 2, 'Draft Mastery', 17),
(5, 2, 'Squad Building Mastery', 5),
(6, 2, 'Pack Opening Mastery', 6),
(7, 3, 'The Best of \'25', 19),
(8, 3, 'Once a baller always a baller', 13),
(9, 3, 'Scare your opponent to death', 14),
(10, 3, 'Pack Luck', 18);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `packs`
--

CREATE TABLE `packs` (
  `id` int(11) NOT NULL,
  `packName` text NOT NULL,
  `packPrice` int(11) NOT NULL,
  `packDesign` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `packs`
--

INSERT INTO `packs` (`id`, `packName`, `packPrice`, `packDesign`) VALUES
(1, 'Bronze Pack', 750, 'bronze'),
(2, 'Silver Pack', 3000, 'silver'),
(3, 'Gold Pack', 7500, 'gold'),
(4, 'Jumbo Gold Pack', 12000, 'gold'),
(5, 'Mixed Players Pack', 6000, 'special'),
(6, 'Mega Pack', 10000, 'special'),
(7, '80+x10 Players Pack', 20000, 'special'),
(8, '82+x10 Players Pack', 25000, 'special'),
(9, '85+x4 Players Pack', 30000, 'special'),
(10, 'Icon Pack', 100000, 'special'),
(11, '90+ Icon Pack', 200000, 'special'),
(12, 'SuloFUT Flashback Pack', 70000, 'flashback'),
(13, 'SuloFUT Scream Pack', 50000, 'scream'),
(14, 'Hero Pack', 60000, 'special'),
(15, '87+ Hero Pack', 20000, 'special'),
(16, 'Campaign Mix Pack', 80000, 'special'),
(17, '88+ Hero or Icon Pack', 80000, 'special'),
(18, 'TOTY Grind Pack', 50000, 'toty'),
(19, 'TOTY Pack', 200000, 'toty'),
(20, 'Welcome Pack', 0, 'special');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rewards`
--

CREATE TABLE `rewards` (
  `id` int(11) NOT NULL,
  `packIds` int(11) DEFAULT NULL,
  `coins` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rewards`
--

INSERT INTO `rewards` (`id`, `packIds`, `coins`) VALUES
(1, NULL, 2000),
(2, 5, NULL),
(3, 4, NULL),
(4, 7, NULL),
(5, 9, NULL),
(6, 7, 50000),
(7, 1, NULL),
(8, 2, NULL),
(9, 3, 5000),
(10, 8, NULL),
(11, 10, NULL),
(12, 11, NULL),
(13, 12, NULL),
(14, 13, NULL),
(15, 14, 50000),
(16, 15, NULL),
(17, 16, NULL),
(18, 17, NULL),
(19, 18, NULL),
(20, 19, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stats`
--

CREATE TABLE `stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `best_draft` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `stats`
--

INSERT INTO `stats` (`id`, `user_id`, `best_draft`) VALUES
(1, 1, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subobjectives`
--

CREATE TABLE `subobjectives` (
  `id` int(11) NOT NULL,
  `objective_id` int(11) NOT NULL,
  `task` varchar(255) NOT NULL,
  `requirement_int` int(11) DEFAULT NULL,
  `reward` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `subobjectives`
--

INSERT INTO `subobjectives` (`id`, `objective_id`, `task`, `requirement_int`, `reward`) VALUES
(10, 1, 'Achieve 10 chemistry points in your starting 11', 10, 1),
(11, 1, 'Achieve 20 chemistry points in your starting 11', 20, 2),
(12, 1, 'Achieve 28 chemistry points in your starting 11', 28, 3),
(13, 1, 'Achieve full chemistry in your starting 11', 33, 4),
(14, 2, 'Achieve 75 rating in your squad', 75, 1),
(15, 2, 'Achieve 80 rating in your squad', 80, 2),
(16, 2, 'Achieve 85 rating in your squad', 85, 4),
(17, 2, 'Achieve 90 rating in your squad', 90, 5),
(18, 3, 'Change your formation', 1, 7),
(19, 3, 'Change your team name', 1, 8),
(20, 4, 'Play 1 Draft', 1, 9),
(21, 4, 'Play 3 Draft', 3, 3),
(22, 4, 'Play 5 Draft', 5, 4),
(23, 4, 'Play 10 Draft', 10, 10),
(24, 4, 'Play 20 Draft', 20, 5),
(25, 5, 'Complete 1 SBC', 1, 1),
(26, 5, 'Complete 3 SBC', 3, 9),
(27, 5, 'Complete 5 SBC', 5, 3),
(28, 5, 'Complete 10 SBC', 10, 4),
(29, 6, 'Open 1 pack', 1, 1),
(30, 6, 'Open 3 packs', 3, 1),
(31, 6, 'Open 5 packs', 5, 1),
(32, 6, 'Open 10 packs', 10, 2),
(33, 6, 'Open 20 packs', 20, 3),
(34, 6, 'Open 50 packs', 50, 10),
(35, 7, 'Pick a TOTY card in Draft', 1, 3),
(36, 7, 'Open a TOTY card', 1, 17),
(37, 7, 'Put a TOTY card in your squad', 1, 4),
(38, 8, 'Pick a FLASHBACK card in Draft', 1, 3),
(39, 8, 'Open a FLASHBACK card', 1, 10),
(40, 8, 'Put a FLASHBACK card in your squad', 1, 2),
(41, 9, 'Pick a SCREAM card in Draft', 1, 3),
(42, 9, 'Open a SCREAM card', 1, 2),
(43, 9, 'Put a SCREAM card in your squad', 1, 1),
(44, 10, 'Open a Walkout Player', 1, 4),
(45, 10, 'Open a 90+ Player', 1, 5),
(46, 10, 'Open an Icon', 1, 17);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'TestUser', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge');

CREATE TABLE user_subobjective_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subobjective_id INT NOT NULL,
  progress_int INT DEFAULT 0
);

CREATE TABLE user_objective_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  objective_id INT NOT NULL,
  progress_int INT DEFAULT 0
);

--
-- Eseményindítók `users`
--
DELIMITER $$
CREATE TRIGGER `createUserClub_afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO userClub (user_id, coinNumber, userPlayers)
  VALUES (NEW.id, 0);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `createStats_afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO stats (user_id, best_draft)
  VALUES (NEW.id, 0);
END
$$
DELIMITER ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `userClub`
--
ALTER TABLE `userClub`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- A tábla indexei `draftrewards`
--
ALTER TABLE `draftrewards`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `objcategories`
--
ALTER TABLE `objcategories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `objectives`
--
ALTER TABLE `objectives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `packs`
--
ALTER TABLE `packs`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- A tábla indexei `subobjectives`
--
ALTER TABLE `subobjectives`
  ADD PRIMARY KEY (`id`),
  ADD KEY `objective_id` (`objective_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `userCLub`
--
ALTER TABLE `userCLub`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `draftrewards`
--
ALTER TABLE `draftrewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `objcategories`
--
ALTER TABLE `objcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `objectives`
--
ALTER TABLE `objectives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `rewards`
--
ALTER TABLE `rewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT a táblához `stats`
--
ALTER TABLE `stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `subobjectives`
--
ALTER TABLE `subobjectives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `userCLub`
--
ALTER TABLE `userCLub`
  ADD CONSTRAINT `userCLub_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `userPacks`
  ADD CONSTRAINT `userPacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `userPacks`
  ADD CONSTRAINT `userPacks_ibfk_2` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `draftreward_packs`
  ADD CONSTRAINT `draftreward_packs_ibfk_1` FOREIGN KEY (`draftreward_id`) REFERENCES `draftrewards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `draftreward_packs`
  ADD CONSTRAINT `draftreward_packs_ibfk_2` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_subobjective_progress`
  ADD CONSTRAINT `user_subobjective_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_subobjective_progress`
  ADD CONSTRAINT `user_subobjective_progress_ibfk_2` FOREIGN KEY (`subobjective_id`) REFERENCES `subobjectives` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_objective_progress`
  ADD CONSTRAINT `user_objective_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_objective_progress`
  ADD CONSTRAINT `user_objective_progress_ibfk_2` FOREIGN KEY (`objective_id`) REFERENCES `objectives` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `objectives`
--
ALTER TABLE `objectives`
  ADD CONSTRAINT `objectives_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `objcategories` (`id`);

--
-- Megkötések a táblához `stats`
--
ALTER TABLE `stats`
  ADD CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `subobjectives`
--
ALTER TABLE `subobjectives`
  ADD CONSTRAINT `subobjectives_ibfk_1` FOREIGN KEY (`objective_id`) REFERENCES `objectives` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
