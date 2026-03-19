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
-- Tábla szerkezet ehhez a táblához `coins`
--

CREATE TABLE `coins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coinNumber` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `coins`
--

INSERT INTO `coins` (`id`, `user_id`, `coinNumber`) VALUES
(1, 1, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `draftrewards`
--

CREATE TABLE `draftrewards` (
  `id` int(11) NOT NULL,
  `packIds` varchar(20) DEFAULT NULL,
  `coins` int(11) DEFAULT NULL,
  `rewardValue` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `draftrewards`
--

INSERT INTO `draftrewards` (`id`, `packIds`, `coins`, `rewardValue`) VALUES
(1, '3', 2500, 'bad'),
(2, '1,2', 5000, 'bad'),
(3, '2,3', 20000, 'mid'),
(4, '4', 10000, 'mid'),
(5, '7', 20000, 'mid'),
(6, '6', 40000, 'good'),
(7, '3,4,5', 30000, 'good'),
(8, '7,16', 30000, 'great'),
(9, '8', 60000, 'great'),
(10, '6,9,16', 100000, 'excellent');

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
  `group_reward` int(11) NOT NULL,
  `group_progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `objectives`
--

INSERT INTO `objectives` (`id`, `category_id`, `name`, `group_reward`, `group_progress`) VALUES
(1, 1, 'Chemistry Mastery', 6, 0),
(2, 1, 'Rating Mastery', 17, 0),
(3, 1, 'Customize your squad', 9, 0),
(4, 2, 'Draft Mastery', 17, 0),
(5, 2, 'Squad Building Mastery', 5, 0),
(6, 2, 'Pack Opening Mastery', 6, 0),
(7, 3, 'The Best of \'25', 19, 0),
(8, 3, 'Once a baller always a baller', 13, 0),
(9, 3, 'Scare your opponent to death', 14, 0),
(10, 3, 'Pack Luck', 18, 0);

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
  `packIds` varchar(20) DEFAULT NULL,
  `coins` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rewards`
--

INSERT INTO `rewards` (`id`, `packIds`, `coins`) VALUES
(1, NULL, 2000),
(2, '5', NULL),
(3, '4', NULL),
(4, '7', NULL),
(5, '9', NULL),
(6, '6,7', 50000),
(7, '1', NULL),
(8, '2', NULL),
(9, '3', 5000),
(10, '8', NULL),
(11, '10', NULL),
(12, '11', NULL),
(13, '12', NULL),
(14, '13', NULL),
(15, '14', 50000),
(16, '15', NULL),
(17, '16', NULL),
(18, '17', NULL),
(19, '18', NULL),
(20, '19', NULL);

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
  `requirement_bool` tinyint(1) DEFAULT NULL,
  `reward` int(11) NOT NULL,
  `progress_int` int(11) DEFAULT NULL,
  `progress_bool` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `subobjectives`
--

INSERT INTO `subobjectives` (`id`, `objective_id`, `task`, `requirement_int`, `requirement_bool`, `reward`, `progress_int`, `progress_bool`) VALUES
(10, 1, 'Achieve 10 chemistry points in your starting 11', 10, NULL, 1, 0, NULL),
(11, 1, 'Achieve 20 chemistry points in your starting 11', 20, NULL, 2, 0, NULL),
(12, 1, 'Achieve 28 chemistry points in your starting 11', 28, NULL, 3, 0, NULL),
(13, 1, 'Achieve full chemistry in your starting 11', 33, NULL, 4, 0, NULL),
(14, 2, 'Achieve 75 rating in your squad', 75, NULL, 1, 0, NULL),
(15, 2, 'Achieve 80 rating in your squad', 80, NULL, 2, 0, NULL),
(16, 2, 'Achieve 85 rating in your squad', 85, NULL, 4, 0, NULL),
(17, 2, 'Achieve 90 rating in your squad', 90, NULL, 5, 0, NULL),
(18, 3, 'Change your formation', NULL, 1, 7, NULL, 0),
(19, 3, 'Change your team\'s name', NULL, 1, 8, NULL, 0),
(20, 4, 'Play 1 Draft', 1, NULL, 9, 0, NULL),
(21, 4, 'Play 3 Draft', 3, NULL, 3, 0, NULL),
(22, 4, 'Play 5 Draft', 5, NULL, 4, 0, NULL),
(23, 4, 'Play 10 Draft', 10, NULL, 10, 0, NULL),
(24, 4, 'Play 20 Draft', 20, NULL, 5, 0, NULL),
(25, 5, 'Complete 1 SBC', 1, NULL, 1, 0, NULL),
(26, 5, 'Complete 3 SBC', 3, NULL, 9, 0, NULL),
(27, 5, 'Complete 5 SBC', 5, NULL, 3, 0, NULL),
(28, 5, 'Complete 10 SBC', 10, NULL, 4, 0, NULL),
(29, 6, 'Open 1 pack', 1, NULL, 1, 0, NULL),
(30, 6, 'Open 3 packs', 3, NULL, 1, 0, NULL),
(31, 6, 'Open 5 packs', 5, NULL, 1, 0, NULL),
(32, 6, 'Open 10 packs', 10, NULL, 2, 0, NULL),
(33, 6, 'Open 20 packs', 20, NULL, 3, 0, NULL),
(34, 6, 'Open 50 packs', 50, NULL, 10, 0, NULL),
(35, 7, 'Pick a TOTY card in Draft', NULL, 1, 3, NULL, 0),
(36, 7, 'Open a TOTY card', NULL, 1, 17, NULL, 0),
(37, 7, 'Put a TOTY card in your squad', NULL, 1, 4, NULL, 0),
(38, 8, 'Pick a FLASHBACK card in Draft', NULL, 1, 3, NULL, 0),
(39, 8, 'Open a FLASHBACK card', NULL, 1, 10, NULL, 0),
(40, 8, 'Put a FLASHBACK card in your squad', NULL, 1, 2, NULL, 0),
(41, 9, 'Pick a SCREAM card in Draft', NULL, 1, 3, NULL, 0),
(42, 9, 'Open a SCREAM card', NULL, 1, 2, NULL, 0),
(43, 9, 'Put a SCREAM card in your squad', NULL, 1, 1, NULL, 0),
(44, 10, 'Open a Walkout Player', NULL, 1, 4, NULL, 0),
(45, 10, 'Open a 90+ Player', NULL, 1, 5, NULL, 0),
(46, 10, 'Open an Icon', NULL, 1, 17, NULL, 0);

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

--
-- Eseményindítók `users`
--
DELIMITER $$
CREATE TRIGGER `createCoins_afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO coins (user_id, coinNumber)
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
-- A tábla indexei `coins`
--
ALTER TABLE `coins`
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
-- AUTO_INCREMENT a táblához `coins`
--
ALTER TABLE `coins`
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
-- Megkötések a táblához `coins`
--
ALTER TABLE `coins`
  ADD CONSTRAINT `coins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
