-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 14. 20:10
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
-- Tábla szerkezet ehhez a táblához `draftrewards`
--

CREATE TABLE `draftrewards` (
  `id` int(11) NOT NULL,
  `coins` int(11) DEFAULT NULL,
  `rewardValue` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `draftreward_packs`
--

CREATE TABLE `draftreward_packs` (
  `id` int(11) NOT NULL,
  `draftreward_id` int(11) NOT NULL,
  `pack_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `draftreward_packs`
--

INSERT INTO `draftreward_packs` (`id`, `draftreward_id`, `pack_id`) VALUES
(1, 1, 3),
(2, 2, 1),
(3, 2, 2),
(4, 3, 2),
(5, 3, 3),
(6, 4, 4),
(7, 5, 7),
(8, 6, 6),
(9, 7, 3),
(10, 7, 4),
(11, 7, 5),
(12, 8, 7),
(13, 8, 16),
(14, 9, 8),
(15, 10, 6),
(16, 10, 9),
(17, 10, 16);

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
  `packDesign` text NOT NULL,
  `playerCount` int(11) NOT NULL,
  `playerQuality` text NOT NULL,
  `packWeightID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `packs`
--

INSERT INTO `packs` (`id`, `packName`, `packPrice`, `packDesign`, `playerCount`, `playerQuality`, `packWeightID`) VALUES
(1, 'Bronze Pack', 750, 'bronze', 12, 'bronze', 1),
(2, 'Silver Pack', 3000, 'silver', 12, 'silver', 2),
(3, 'Gold Pack', 7500, 'gold', 12, 'gold/flashback/scream/toty/icon/hero', 3),
(4, 'Jumbo Gold Pack', 15000, 'gold', 24, 'gold/flashback/scream/toty/icon/hero', 4),
(5, 'Mixed Players Pack', 6000, 'special', 12, 'bronze/silver/gold', 5),
(6, 'Mega Pack', 35000, 'special', 30, 'gold/flashback/scream/toty/icon/hero', 6),
(7, '80+x10 Players Pack', 20000, 'special', 10, 'gold/flashback/scream/toty/icon/hero', 7),
(8, '82+x10 Players Pack', 25000, 'special', 10, 'gold/flashback/scream/toty/icon/hero', 8),
(9, '85+x4 Players Pack', 30000, 'special', 4, 'gold/flashback/scream/toty/icon/hero', 9),
(10, 'Icon Pack', 100000, 'special', 1, 'icon', 10),
(11, '90+ Icon Pack', 200000, 'special', 1, 'icon', 11),
(12, 'SuloFUT Flashback Pack', 70000, 'flashback', 12, 'gold/flashback/scream/toty/icon/hero', 12),
(13, 'SuloFUT Scream Pack', 50000, 'scream', 12, 'gold/flashback/scream/toty/icon/hero', 13),
(14, 'Hero Pack', 60000, 'special', 1, 'hero', 14),
(15, '87+ Hero Pack', 20000, 'special', 1, 'hero', 15),
(16, 'Campaign Mix Pack', 80000, 'special', 1, 'flashback/scream/toty/icon/hero', 16),
(17, '88+ Hero or Icon Pack', 80000, 'special', 1, 'icon/hero', 17),
(18, 'TOTY Grind Pack', 50000, 'toty', 12, 'gold/flashback/scream/toty/icon/hero', 18),
(19, 'TOTY Pack', 200000, 'toty', 1, 'toty', 19),
(20, 'Welcome Pack', 0, 'special', 24, 'bronze/silver/gold', 20);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `packweights`
--

CREATE TABLE `packweights` (
  `id` int(11) NOT NULL,
  `bronzeWeight` float NOT NULL,
  `silverWeight` float NOT NULL,
  `goldWeight` float NOT NULL,
  `flashbackWeight` float NOT NULL,
  `screamWeight` float NOT NULL,
  `totyWeight` float NOT NULL,
  `iconWeight` float NOT NULL,
  `heroWeight` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `packweights`
--

INSERT INTO `packweights` (`id`, `bronzeWeight`, `silverWeight`, `goldWeight`, `flashbackWeight`, `screamWeight`, `totyWeight`, `iconWeight`, `heroWeight`) VALUES
(1, 100, 0, 0, 0, 0, 0, 0, 0),
(2, 0, 100, 0, 0, 0, 0, 0, 0),
(3, 0, 0, 94, 2, 2, 0.5, 0.5, 1),
(4, 0, 0, 97, 1, 1, 0.3, 0.3, 0.4),
(5, 33, 33, 33, 0.3, 0.3, 0.1, 0.1, 0.2),
(6, 0, 0, 98, 0.7, 0.7, 0.1, 0.1, 0.4),
(7, 0, 0, 94, 2, 2, 0.5, 0.5, 1),
(8, 0, 0, 98, 0.7, 0.7, 0.1, 0.1, 0.4),
(9, 0, 0, 80, 6, 6, 2, 2, 4),
(10, 0, 0, 0, 0, 0, 0, 100, 0),
(11, 0, 0, 0, 0, 0, 0, 100, 0),
(12, 0, 0, 94, 3, 1, 0.5, 0.5, 1),
(13, 0, 0, 94, 1, 3, 0.5, 0.5, 1),
(14, 0, 0, 0, 0, 0, 0, 0, 100),
(15, 0, 0, 0, 0, 0, 0, 0, 100),
(16, 0, 0, 0, 33, 33, 33, 0, 0),
(17, 0, 0, 0, 0, 0, 0, 30, 70),
(18, 0, 0, 94, 1.5, 1.5, 1.5, 0.5, 1),
(19, 0, 0, 0, 0, 0, 100, 0, 0),
(20, 33, 33, 33, 0, 0, 0, 0, 0);

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



-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sbccategories`
--

CREATE TABLE `sbccategories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `sbccategories`
--

INSERT INTO `sbccategories` (`id`, `name`) VALUES
(1, 'challenges'),
(2, 'upgrades'),
(3, 'foundations');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stats`
--

CREATE TABLE `stats` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `best_draft` int(11) NOT NULL DEFAULT 0,
  `top_squad` int(11) NOT NULL DEFAULT 0,
  `club_value` int(11) NOT NULL DEFAULT 0,
  `cards_opened` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `stats`
--

INSERT INTO `stats` (`id`, `user_id`, `best_draft`, `top_squad`, `club_value`, `cards_opened`) VALUES
(2, 2, 115, 99, 23000, 240),
(3, 3, 118, 101, 24000, 250),
(4, 4, 116, 100, 23500, 248),
(5, 5, 117, 100, 23750, 245),
(6, 6, 119, 102, 24500, 255),
(7, 7, 114, 98, 22500, 235),
(8, 8, 120, 103, 25000, 260),
(9, 9, 113, 97, 22000, 230),
(10, 10, 117, 100, 136789, 245),
(11, 11, 118, 101, 24000, 250),
(12, 12, 116, 100, 23500, 248),
(13, 13, 119, 112, 24500, 302),
(14, 14, 115, 99, 23000, 240),
(15, 15, 117, 113, 23750, 245),
(16, 16, 118, 101, 24000, 567),
(17, 17, 114, 98, 22500, 142),
(18, 18, 120, 103, 25000, 260),
(19, 19, 113, 97, 22000, 230),
(20, 20, 117, 100, 112675, 543),
(21, 21, 116, 100, 234612, 248),
(22, 22, 119, 102, 24500, 73),
(23, 23, 115, 99, 23000, 500),
(24, 24, 118, 101, 24000, 250),
(25, 25, 117, 100, 23750, 245),
(26, 26, 114, 117, 22500, 313),
(27, 27, 120, 103, 69250, 438),
(28, 28, 113, 97, 22000, 230),
(29, 29, 118, 101, 24000, 250),
(30, 30, 116, 118, 23500, 248),
(31, 31, 119, 102, 24500, 255),
(32, 32, 115, 99, 23000, 240),
(33, 33, 117, 100, 23750, 245),
(34, 34, 118, 101, 24000, 250),
(35, 35, 114, 98, 22500, 235),
(36, 36, 120, 119, 25000, 260),
(37, 37, 113, 97, 300000, 230),
(38, 38, 117, 100, 23750, 245),
(39, 39, 116, 100, 23500, 248),
(40, 40, 119, 118, 24500, 398),
(41, 41, 115, 99, 23000, 240),
(42, 42, 118, 101, 24000, 250),
(43, 43, 117, 122, 23750, 245),
(44, 44, 114, 98, 312560, 358),
(45, 45, 120, 103, 25000, 260),
(46, 46, 113, 97, 22000, 230),
(47, 47, 118, 101, 24000, 250),
(48, 48, 116, 100, 23500, 248),
(49, 49, 119, 102, 24500, 255),
(50, 50, 115, 99, 23000, 240),
(51, 51, 117, 100, 23750, 379),
(52, 52, 120, 121, 412780, 245),
(53, 53, 122, 122, 436720, 493);

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
-- Tábla szerkezet ehhez a táblához `userclub`
--

CREATE TABLE `userclub` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coinNumber` int(11) NOT NULL DEFAULT 0,
  `userPlayers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`userPlayers`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `userclub`
--

INSERT INTO `userclub` (`id`, `user_id`, `coinNumber`, `userPlayers`) VALUES
(2, 2, 92734, NULL),
(3, 3, 245678, NULL),
(4, 4, 156789, NULL),
(5, 5, 312456, NULL),
(6, 6, 87432, NULL),
(7, 7, 198765, NULL),
(8, 8, 223344, NULL),
(9, 9, 167890, NULL),
(10, 10, 95432, NULL),
(11, 11, 278901, NULL),
(12, 12, 134567, NULL),
(13, 13, 189234, NULL),
(14, 14, 305678, NULL),
(15, 15, 112233, NULL),
(16, 16, 267890, NULL),
(17, 17, 145678, NULL),
(18, 18, 198234, NULL),
(19, 19, 176543, NULL),
(20, 20, 234567, NULL),
(21, 21, 98765, NULL),
(22, 22, 210987, NULL),
(23, 23, 154321, NULL),
(24, 24, 276543, NULL),
(25, 25, 198765, NULL),
(26, 26, 223456, NULL),
(27, 27, 145678, NULL),
(28, 28, 189765, NULL),
(29, 29, 256789, NULL),
(30, 30, 167890, NULL),
(31, 31, 298765, NULL),
(32, 32, 134890, NULL),
(33, 33, 176543, NULL),
(34, 34, 243210, NULL),
(35, 35, 198432, NULL),
(36, 36, 165789, NULL),
(37, 37, 278654, NULL),
(38, 38, 143276, NULL),
(39, 39, 189765, NULL),
(40, 40, 212345, NULL),
(41, 41, 176890, NULL),
(42, 42, 234567, NULL),
(43, 43, 198765, NULL),
(44, 44, 156789, NULL),
(45, 45, 289012, NULL),
(46, 46, 134567, NULL),
(47, 47, 176543, NULL),
(48, 48, 245678, NULL),
(49, 49, 198234, NULL),
(50, 50, 167890, NULL),
(51, 51, 223456, NULL),
(52, 52, 189765, NULL),
(53, 53, 14308371, '[{\"player_id\":\"212831\",\"short_name\":\"Alisson\",\"long_name\":\"Alisson Ramsés Becker\",\"player_positions\":\"GK\",\"overall\":\"89\",\"league_id\":\"13\",\"league_name\":\"Premier League\",\"league_level\":\"1\",\"club_team_id\":\"9\",\"club_name\":\"Liverpool\",\"nationality_id\":\"54\",\"nationality_name\":\"Brazil\",\"goalkeeping_diving\":\"86\",\"goalkeeping_handling\":\"85\",\"goalkeeping_kicking\":\"86\",\"goalkeeping_positioning\":\"90\",\"goalkeeping_reflexes\":\"89\",\"goalkeeping_speed\":\"56\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p212831.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l13.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/54.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l9.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"200389\",\"short_name\":\"J. Oblak\",\"long_name\":\"Jan Oblak\",\"player_positions\":\"GK\",\"overall\":\"88\",\"league_id\":\"53\",\"league_name\":\"La Liga\",\"league_level\":\"1\",\"club_team_id\":\"240\",\"club_name\":\"Atlético Madrid\",\"nationality_id\":\"44\",\"nationality_name\":\"Slovenia\",\"goalkeeping_diving\":\"85\",\"goalkeeping_handling\":\"90\",\"goalkeeping_kicking\":\"78\",\"goalkeeping_positioning\":\"86\",\"goalkeeping_reflexes\":\"87\",\"goalkeeping_speed\":\"46\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p200389.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l53.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/44.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l240.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"247635\",\"short_name\":\"K. Kvaratskhelia\",\"long_name\":\"Khvicha Kvaratskheliaხვიჩა კვარაცხელია\",\"player_positions\":\"LW, RW, LM\",\"overall\":\"87\",\"league_id\":\"16\",\"league_name\":\"Ligue 1\",\"league_level\":\"1\",\"club_team_id\":\"73\",\"club_name\":\"Paris Saint-Germain\",\"nationality_id\":\"20\",\"nationality_name\":\"Georgia\",\"pace\":\"86\",\"shooting\":\"80\",\"passing\":\"83\",\"dribbling\":\"88\",\"defending\":\"58\",\"physic\":\"78\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p247635.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l16.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/20.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l73.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"239818\",\"short_name\":\"Rúben Dias\",\"long_name\":\"Rúben dos Santos Gato Alves Dias\",\"player_positions\":\"CB\",\"overall\":\"86\",\"league_id\":\"13\",\"league_name\":\"Premier League\",\"league_level\":\"1\",\"club_team_id\":\"10\",\"club_name\":\"Manchester City\",\"nationality_id\":\"38\",\"nationality_name\":\"Portugal\",\"pace\":\"59\",\"shooting\":\"39\",\"passing\":\"69\",\"dribbling\":\"69\",\"defending\":\"86\",\"physic\":\"84\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p239818.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l13.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/38.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l10.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"210257\",\"short_name\":\"Ederson\",\"long_name\":\"Ederson Santana de Moraes\",\"player_positions\":\"GK\",\"overall\":\"85\",\"league_id\":\"68\",\"league_name\":\"Süper Lig\",\"league_level\":\"1\",\"club_team_id\":\"326\",\"club_name\":\"Fenerbahçe SK\",\"nationality_id\":\"54\",\"nationality_name\":\"Brazil\",\"goalkeeping_diving\":\"83\",\"goalkeeping_handling\":\"82\",\"goalkeeping_kicking\":\"91\",\"goalkeeping_positioning\":\"83\",\"goalkeeping_reflexes\":\"83\",\"goalkeeping_speed\":\"64\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p210257.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l68.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/54.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l326.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"256675\",\"short_name\":\"O. Marmoush\",\"long_name\":\"Omar Khaled Mohamed Marmoush\",\"player_positions\":\"ST, CAM, LW\",\"overall\":\"84\",\"league_id\":\"13\",\"league_name\":\"Premier League\",\"league_level\":\"1\",\"club_team_id\":\"10\",\"club_name\":\"Manchester City\",\"nationality_id\":\"111\",\"nationality_name\":\"Egypt\",\"pace\":\"89\",\"shooting\":\"85\",\"passing\":\"76\",\"dribbling\":\"86\",\"defending\":\"34\",\"physic\":\"71\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p256675.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l13.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/111.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l10.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"204638\",\"short_name\":\"W. Orban\",\"long_name\":\"Vilmos Tamás Orbán\",\"player_positions\":\"CB\",\"overall\":\"84\",\"league_id\":\"19\",\"league_name\":\"Bundesliga\",\"league_level\":\"1\",\"club_team_id\":\"112172\",\"club_name\":\"RB Leipzig\",\"nationality_id\":\"23\",\"nationality_name\":\"Hungary\",\"pace\":\"57\",\"shooting\":\"40\",\"passing\":\"56\",\"dribbling\":\"56\",\"defending\":\"86\",\"physic\":\"83\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p204638.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l19.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/23.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l112172.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"222077\",\"short_name\":\"M. Locatelli\",\"long_name\":\"Manuel Locatelli\",\"player_positions\":\"CDM, CM\",\"overall\":\"84\",\"league_id\":\"31\",\"league_name\":\"Serie A\",\"league_level\":\"1\",\"club_team_id\":\"45\",\"club_name\":\"Juventus\",\"nationality_id\":\"27\",\"nationality_name\":\"Italy\",\"pace\":\"63\",\"shooting\":\"69\",\"passing\":\"80\",\"dribbling\":\"76\",\"defending\":\"81\",\"physic\":\"78\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p222077.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l31.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/27.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l45.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"199845\",\"short_name\":\"F. Acerbi\",\"long_name\":\"Francesco Acerbi\",\"player_positions\":\"CB\",\"overall\":\"84\",\"league_id\":\"31\",\"league_name\":\"Serie A\",\"league_level\":\"1\",\"club_team_id\":\"44\",\"club_name\":\"Inter\",\"nationality_id\":\"27\",\"nationality_name\":\"Italy\",\"pace\":\"57\",\"shooting\":\"50\",\"passing\":\"65\",\"dribbling\":\"65\",\"defending\":\"87\",\"physic\":\"81\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p199845.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l31.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/27.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l44.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"243245\",\"short_name\":\"O. Kökçü\",\"long_name\":\"Orkun Kökçü\",\"player_positions\":\"CM, CAM, CDM\",\"overall\":\"82\",\"league_id\":\"68\",\"league_name\":\"Süper Lig\",\"league_level\":\"1\",\"club_team_id\":\"327\",\"club_name\":\"Beşiktaş JK\",\"nationality_id\":\"48\",\"nationality_name\":\"Türkiye\",\"pace\":\"72\",\"shooting\":\"80\",\"passing\":\"84\",\"dribbling\":\"80\",\"defending\":\"70\",\"physic\":\"79\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p243245.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l68.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/48.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l327.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"207865\",\"short_name\":\"Marquinhos\",\"long_name\":\"Marcos Aoás Corrêa\",\"player_positions\":\"CB\",\"overall\":\"88\",\"league_id\":\"16\",\"league_name\":\"Ligue 1\",\"league_level\":\"1\",\"club_team_id\":\"73\",\"club_name\":\"Paris Saint-Germain\",\"nationality_id\":\"54\",\"nationality_name\":\"Brazil\",\"pace\":\"83\",\"shooting\":\"56\",\"passing\":\"81\",\"dribbling\":\"79\",\"defending\":\"92\",\"physic\":\"88\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p207865.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l16.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/54.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l73.png?v=11\",\"rarity\":\"flashback\",\"value\":15480},{\"player_id\":\"252145\",\"short_name\":\"Nuno Mendes\",\"long_name\":\"Nuno Alexandre Tavares Mendes\",\"player_positions\":\"LB, LM\",\"overall\":\"86\",\"league_id\":\"16\",\"league_name\":\"Ligue 1\",\"league_level\":\"1\",\"club_team_id\":\"73\",\"club_name\":\"Paris Saint-Germain\",\"nationality_id\":\"38\",\"nationality_name\":\"Portugal\",\"pace\":\"95\",\"shooting\":\"65\",\"passing\":\"76\",\"dribbling\":\"82\",\"defending\":\"80\",\"physic\":\"77\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p252145.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l16.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/38.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l73.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"230869\",\"short_name\":\"Unai Simón\",\"long_name\":\"Unai Simón Mendibil\",\"player_positions\":\"GK\",\"overall\":\"85\",\"league_id\":\"53\",\"league_name\":\"La Liga\",\"league_level\":\"1\",\"club_team_id\":\"448\",\"club_name\":\"Athletic Club\",\"nationality_id\":\"45\",\"nationality_name\":\"Spain\",\"goalkeeping_diving\":\"84\",\"goalkeeping_handling\":\"80\",\"goalkeeping_kicking\":\"76\",\"goalkeeping_positioning\":\"84\",\"goalkeeping_reflexes\":\"85\",\"goalkeeping_speed\":\"49\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p230869.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l53.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/45.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l448.png?v=11\",\"rarity\":\"gold\",\"value\":628},{\"player_id\":\"247090\",\"short_name\":\"E. Fernández\",\"long_name\":\"Enzo Jeremías Fernández\",\"player_positions\":\"CM, CDM, CAM\",\"overall\":\"84\",\"league_id\":\"13\",\"league_name\":\"Premier League\",\"league_level\":\"1\",\"club_team_id\":\"5\",\"club_name\":\"Chelsea\",\"nationality_id\":\"52\",\"nationality_name\":\"Argentina\",\"pace\":\"68\",\"shooting\":\"75\",\"passing\":\"85\",\"dribbling\":\"81\",\"defending\":\"73\",\"physic\":\"75\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p247090.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l13.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/52.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l5.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"210514\",\"short_name\":\"João Cancelo\",\"long_name\":\"João Pedro Cavaco Cancelo\",\"player_positions\":\"RB, LB, RM\",\"overall\":\"84\",\"league_id\":\"350\",\"league_name\":\"Pro League\",\"league_level\":\"1\",\"club_team_id\":\"605\",\"club_name\":\"Al Hilal\",\"nationality_id\":\"38\",\"nationality_name\":\"Portugal\",\"pace\":\"83\",\"shooting\":\"73\",\"passing\":\"84\",\"dribbling\":\"84\",\"defending\":\"78\",\"physic\":\"74\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p210514.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l350.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/38.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l605.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"186153\",\"short_name\":\"W. Szczęsny\",\"long_name\":\"Wojciech Tomasz Szczęsny\",\"player_positions\":\"GK\",\"overall\":\"84\",\"league_id\":\"53\",\"league_name\":\"La Liga\",\"league_level\":\"1\",\"club_team_id\":\"241\",\"club_name\":\"FC Barcelona\",\"nationality_id\":\"37\",\"nationality_name\":\"Poland\",\"goalkeeping_diving\":\"82\",\"goalkeeping_handling\":\"83\",\"goalkeeping_kicking\":\"75\",\"goalkeeping_positioning\":\"84\",\"goalkeeping_reflexes\":\"84\",\"goalkeeping_speed\":\"48\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p186153.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l53.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/37.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l241.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"229582\",\"short_name\":\"G. Mancini\",\"long_name\":\"Gianluca Mancini\",\"player_positions\":\"CB\",\"overall\":\"83\",\"league_id\":\"31\",\"league_name\":\"Serie A\",\"league_level\":\"1\",\"club_team_id\":\"52\",\"club_name\":\"Roma\",\"nationality_id\":\"27\",\"nationality_name\":\"Italy\",\"pace\":\"70\",\"shooting\":\"50\",\"passing\":\"57\",\"dribbling\":\"64\",\"defending\":\"85\",\"physic\":\"82\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p229582.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l31.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/27.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l52.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"225375\",\"short_name\":\"K. Laimer\",\"long_name\":\"Konrad Laimer\",\"player_positions\":\"RB, CDM, CM, RM\",\"overall\":\"82\",\"league_id\":\"19\",\"league_name\":\"Bundesliga\",\"league_level\":\"1\",\"club_team_id\":\"21\",\"club_name\":\"FC Bayern München\",\"nationality_id\":\"4\",\"nationality_name\":\"Austria\",\"pace\":\"82\",\"shooting\":\"69\",\"passing\":\"76\",\"dribbling\":\"75\",\"defending\":\"81\",\"physic\":\"76\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p225375.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l19.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/4.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l21.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"278046\",\"short_name\":\"Pau Cubarsí\",\"long_name\":\"Pau Cubarsí Paredes\",\"player_positions\":\"CB\",\"overall\":\"82\",\"league_id\":\"53\",\"league_name\":\"La Liga\",\"league_level\":\"1\",\"club_team_id\":\"241\",\"club_name\":\"FC Barcelona\",\"nationality_id\":\"45\",\"nationality_name\":\"Spain\",\"pace\":\"70\",\"shooting\":\"42\",\"passing\":\"66\",\"dribbling\":\"77\",\"defending\":\"84\",\"physic\":\"76\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p278046.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l53.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/45.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l241.png?v=11\",\"rarity\":\"gold\",\"value\":596},{\"player_id\":\"231352\",\"short_name\":\"T. Abraham\",\"long_name\":\"Kevin Oghenetega Tamaraebi Bakumo-Abraham\",\"player_positions\":\"ST\",\"overall\":\"85\",\"league_id\":\"68\",\"league_name\":\"Süper Lig\",\"league_level\":\"1\",\"club_team_id\":\"327\",\"club_name\":\"Beşiktaş JK\",\"nationality_id\":\"14\",\"nationality_name\":\"England\",\"pace\":\"83\",\"shooting\":\"87\",\"passing\":\"68\",\"dribbling\":\"82\",\"defending\":\"39\",\"physic\":\"83\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p231352.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l68.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/14.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l327.png?v=11\",\"rarity\":\"scream\",\"value\":15480},{\"player_id\":\"238388\",\"short_name\":\"Bergkamp\",\"long_name\":\"Dennis Bergkamp\",\"player_positions\":\"ST, CAM\",\"overall\":\"90\",\"league_id\":\"2118\",\"league_name\":\"Icon\",\"league_level\":\"1\",\"club_team_id\":\"2118\",\"club_name\":\"Icon\",\"nationality_id\":\"34\",\"nationality_name\":\"Netherlands\",\"pace\":83,\"shooting\":89,\"passing\":84,\"dribbling\":88,\"defending\":35,\"physic\":76,\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p238388.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2118.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/34.png?v=11\",\"club_team_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2118.png\",\"rarity\":\"icon\",\"value\":68250},{\"player_id\":\"232083\",\"short_name\":\"J. Yaro\",\"long_name\":\"Joshua Yaro\",\"player_positions\":\"CB\",\"overall\":\"64\",\"league_id\":\"39\",\"league_name\":\"Major League Soccer\",\"league_level\":\"1\",\"club_team_id\":\"113018\",\"club_name\":\"St. Louis CITY SC\",\"nationality_id\":\"117\",\"nationality_name\":\"Ghana\",\"pace\":\"78\",\"shooting\":\"26\",\"passing\":\"46\",\"dribbling\":\"55\",\"defending\":\"65\",\"physic\":\"67\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p232083.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l39.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/117.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l113018.png?v=11\",\"rarity\":\"bronze\",\"value\":46},{\"player_id\":\"275062\",\"short_name\":\"D. Guðjohnsen\",\"long_name\":\"Daníel Tristan Guðjohnsen\",\"player_positions\":\"ST\",\"overall\":\"63\",\"league_id\":\"56\",\"league_name\":\"Allsvenskan\",\"league_level\":\"1\",\"club_team_id\":\"320\",\"club_name\":\"Malmö FF\",\"nationality_id\":\"24\",\"nationality_name\":\"Iceland\",\"pace\":\"69\",\"shooting\":\"62\",\"passing\":\"51\",\"dribbling\":\"63\",\"defending\":\"19\",\"physic\":\"66\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p275062.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l56.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/24.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l320.png?v=11\",\"rarity\":\"bronze\",\"value\":46},{\"player_id\":\"179543\",\"short_name\":\"A. Nouri\",\"long_name\":\"Amin Mimoun Nouri\",\"player_positions\":\"RB, LB, RM\",\"overall\":\"63\",\"league_id\":\"41\",\"league_name\":\"Eliteserien\",\"league_level\":\"1\",\"club_team_id\":\"131491\",\"club_name\":\"KFUM-Kameratene Oslo\",\"nationality_id\":\"36\",\"nationality_name\":\"Norway\",\"pace\":\"43\",\"shooting\":\"48\",\"passing\":\"59\",\"dribbling\":\"62\",\"defending\":\"63\",\"physic\":\"68\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p179543.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l41.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/36.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l131491.png?v=11\",\"rarity\":\"bronze\",\"value\":46},{\"player_id\":\"279686\",\"short_name\":\"E. Vaca\",\"long_name\":\"Ervin Vaca Moreno\",\"player_positions\":\"LB, CM, LM\",\"overall\":\"62\",\"league_id\":\"2017\",\"league_name\":\"División de Fútbol Profesional\",\"league_level\":\"1\",\"club_team_id\":\"110968\",\"club_name\":\"Bolívar\",\"nationality_id\":\"53\",\"nationality_name\":\"Bolivia\",\"pace\":\"65\",\"shooting\":\"49\",\"passing\":\"59\",\"dribbling\":\"56\",\"defending\":\"58\",\"physic\":\"59\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p279686.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2017.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/53.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l110968.png?v=11\",\"rarity\":\"bronze\",\"value\":46},{\"player_id\":\"75843\",\"short_name\":\"J. Mbalanda\",\"long_name\":\"Jay-David Mbalanda Nziang\",\"player_positions\":\"ST\",\"overall\":\"59\",\"league_id\":\"4\",\"league_name\":\"Pro League\",\"league_level\":\"1\",\"club_team_id\":\"680\",\"club_name\":\"Sint-Truidense VV\",\"nationality_id\":\"7\",\"nationality_name\":\"Belgium\",\"pace\":\"71\",\"shooting\":\"61\",\"passing\":\"45\",\"dribbling\":\"54\",\"defending\":\"33\",\"physic\":\"59\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p75843.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l4.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/7.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l680.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"78646\",\"short_name\":\"L. Bausenwein\",\"long_name\":\"Lauris Bausenwein\",\"player_positions\":\"RM, RB, RW\",\"overall\":\"58\",\"league_id\":\"2076\",\"league_name\":\"3. Liga\",\"league_level\":\"3\",\"club_team_id\":\"583\",\"club_name\":\"1. FC Schweinfurt 05\",\"nationality_id\":\"21\",\"nationality_name\":\"Germany\",\"pace\":\"81\",\"shooting\":\"48\",\"passing\":\"53\",\"dribbling\":\"57\",\"defending\":\"42\",\"physic\":\"47\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p78646.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2076.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/21.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l583.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"74005\",\"short_name\":\"K. Morgan\",\"long_name\":\"Kevin Mario Morgan Michelena\",\"player_positions\":\"GK\",\"overall\":\"58\",\"league_id\":\"338\",\"league_name\":\"Primera División\",\"league_level\":\"1\",\"club_team_id\":\"101110\",\"club_name\":\"Peñarol\",\"nationality_id\":\"60\",\"nationality_name\":\"Uruguay\",\"goalkeeping_diving\":\"63\",\"goalkeeping_handling\":\"60\",\"goalkeeping_kicking\":\"51\",\"goalkeeping_positioning\":\"47\",\"goalkeeping_reflexes\":\"63\",\"goalkeeping_speed\":\"37\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p74005.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l338.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/60.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l101110.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"253015\",\"short_name\":\"M. Al Shanqeeti\",\"long_name\":\"Mohammed Ali Al Shanqitiمحمد الشنقيطي\",\"player_positions\":\"LB, LM\",\"overall\":\"57\",\"league_id\":\"350\",\"league_name\":\"Pro League\",\"league_level\":\"1\",\"club_team_id\":\"112391\",\"club_name\":\"Al Qadsiah FC\",\"nationality_id\":\"183\",\"nationality_name\":\"Saudi Arabia\",\"pace\":\"66\",\"shooting\":\"30\",\"passing\":\"44\",\"dribbling\":\"52\",\"defending\":\"54\",\"physic\":\"56\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p253015.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l350.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/183.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l112391.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"78665\",\"short_name\":\"M. Persson\",\"long_name\":\"Malte Persson\",\"player_positions\":\"ST\",\"overall\":\"56\",\"league_id\":\"56\",\"league_name\":\"Allsvenskan\",\"league_level\":\"1\",\"club_team_id\":\"321\",\"club_name\":\"Halmstads BK\",\"nationality_id\":\"46\",\"nationality_name\":\"Sweden\",\"pace\":\"74\",\"shooting\":\"53\",\"passing\":\"47\",\"dribbling\":\"54\",\"defending\":\"18\",\"physic\":\"54\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p78665.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l56.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/46.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l321.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"75170\",\"short_name\":\"D. Lordkipanidze\",\"long_name\":\"Dachi Lordkipanidzeდაჩი ლორთქიფანიძე\",\"player_positions\":\"CM\",\"overall\":\"56\",\"league_id\":\"31\",\"league_name\":\"Serie A\",\"league_level\":\"1\",\"club_team_id\":\"111434\",\"club_name\":\"Cremonese\",\"nationality_id\":\"20\",\"nationality_name\":\"Georgia\",\"pace\":\"58\",\"shooting\":\"45\",\"passing\":\"52\",\"dribbling\":\"56\",\"defending\":\"48\",\"physic\":\"53\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p75170.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l31.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/20.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l111434.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"257475\",\"short_name\":\"Shi Chenglong\",\"long_name\":\"Shi Chenglong史成龙\",\"player_positions\":\"GK\",\"overall\":\"51\",\"league_id\":\"2012\",\"league_name\":\"Super League\",\"league_level\":\"1\",\"club_team_id\":\"111779\",\"club_name\":\"Henan FC\",\"nationality_id\":\"155\",\"nationality_name\":\"China PR\",\"goalkeeping_diving\":\"50\",\"goalkeeping_handling\":\"50\",\"goalkeeping_kicking\":\"51\",\"goalkeeping_positioning\":\"52\",\"goalkeeping_reflexes\":\"52\",\"goalkeeping_speed\":\"24\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p257475.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2012.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/155.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l111779.png?v=11\",\"rarity\":\"bronze\",\"value\":44},{\"player_id\":\"72003\",\"short_name\":\"Yu Tianxiang\",\"long_name\":\"Yu Tianxiang余天翔\",\"player_positions\":\"RB, RM\",\"overall\":\"49\",\"league_id\":\"2012\",\"league_name\":\"Super League\",\"league_level\":\"1\",\"club_team_id\":\"116361\",\"club_name\":\"Wuhan Three Towns\",\"nationality_id\":\"155\",\"nationality_name\":\"China PR\",\"pace\":\"60\",\"shooting\":\"28\",\"passing\":\"31\",\"dribbling\":\"46\",\"defending\":\"44\",\"physic\":\"57\",\"player_face_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/players/p72003.png?v=26\",\"league_url\":\"https://www.fifacm.com/content/media/imgs/fc26/leagues/l2012.png\",\"nation_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/nations/155.png?v=11\",\"club_team_url\":\"https://cdn.fifacm.com/content/media/imgs/fc26/teams/52/l116361.png?v=11\",\"rarity\":\"bronze\",\"value\":42}]');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userpacks`
--

CREATE TABLE `userpacks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pack_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
(2, 'AlphaWolf', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(3, 'NeonFalcon', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(4, 'ShadowByte', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(5, 'CrimsonFox', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(6, 'NovaStrike', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(7, 'IronClaw', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(8, 'GhostPulse', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(9, 'TurboKnight', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(10, 'PixelHunter', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(11, 'CyberDrift', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(12, 'LunarBlaze', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(13, 'StormBreaker', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(14, 'FrostNova', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(15, 'BlazeRider', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(16, 'DarkVortex', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(17, 'QuantumEdge', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(18, 'SteelPhantom', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(19, 'RapidEcho', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(20, 'VenomStrike', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(21, 'NightGlider', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(22, 'SolarFlareX', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(23, 'EchoSniper', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(24, 'HyperRogue', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(25, 'ThunderCore', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(26, 'MysticDrake', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(27, 'PhantomZero', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(28, 'InfernoX', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(29, 'GlitchMaster', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(30, 'OmegaRush', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(31, 'CyberKnightX', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(32, 'AstroBlade', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(33, 'VoidSniper', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(34, 'BlitzCore', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(35, 'ShadowRift', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(36, 'NeonSpecter', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(37, 'IronSpectra', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(38, 'SkyBreaker', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(39, 'NovaHunter', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(40, 'PhantomDash', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(41, 'StormPulse', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(42, 'TurboShadow', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(43, 'VortexPrime', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(44, 'CrystalByte', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(45, 'NightFuryX', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(46, 'SolarKnight', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(47, 'EchoStorm', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(48, 'DarkNovaX', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(49, 'GlacierWolf', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(50, 'BlazePhantom', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(51, 'CyberTitan', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(52, 'datboizaza', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
(53, 'bobberito', '$2b$10$1JX4rdM.zfDUhMH2ejR9xeE327df26SQa24QF4V/qxQsK47mIT6Wu');

--
-- Eseményindítók `users`
--
DELIMITER $$
CREATE TRIGGER `createStats_afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO stats (user_id, best_draft, top_squad, club_value, cards_opened)
  VALUES (NEW.id, 0, 0, 0, 0);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `createUserClub_afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO userClub (user_id, coinNumber, userPlayers)
  VALUES (NEW.id, 0, NULL);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_objective_claims`
--

CREATE TABLE `user_objective_claims` (
  `user_id` int(11) DEFAULT NULL,
  `objective_id` int(11) DEFAULT NULL,
  `claimed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_subobjective_progress`
--

CREATE TABLE `user_subobjective_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subobjective_id` int(11) NOT NULL,
  `progress_int` int(11) DEFAULT 0,
  `claimed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `user_subobjective_progress`
--

INSERT INTO `user_subobjective_progress` (`id`, `user_id`, `subobjective_id`, `progress_int`, `claimed`) VALUES
(13, 53, 20, 2, 0),
(14, 53, 21, 2, 0),
(15, 53, 22, 2, 0),
(16, 53, 23, 2, 0),
(17, 53, 24, 2, 0);

--
-- Indexek a kiírt táblákhoz
--
-- Tábla szerkezet ehhez a táblához `packs`
--

CREATE TABLE `sbc` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `sbcName` text NOT NULL,
  `repeat` int(11),
  `rewardPack` text NOT NULL,
  `rarity` text,
  `rating` text,
  `chemistry` text,
  `leagues` text,
  `sameLeague` text,
  `nations` text,
  `sameNation` text,
  `sameClub` text,
  `chemPP` text,
  `special` text,
  `formation` text NOT NULL,
  `design` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `sbc`
--

INSERT INTO `sbc` (`id`, `category_id`, `sbcName`, `repeat`, `rewardPack`, `rarity`, `rating`, `chemistry`, `leagues`, `sameLeague`, `nations`, `sameNation`, `sameClub`, `chemPP`, `special`,`formation`, `design`) VALUES
(1, 1, 'Spooky Scary Skeletons', 0, 'SuloFUT Scream Pack', NULL, NULL, 'min 24', 'min 3', NULL, 'max 3', NULL, NULL, NULL, NULL, '4-5-1',  'scream'),
(2, 1, 'Old But Still Money', 0, 'SuloFUT Flashback Pack', NULL, 'min 84', 'min 20', NULL, 'max 3', NULL, 'max 3', NULL, NULL, NULL, '4-2-2-2',  'flashback'),
(3, 1, 'Man Of The Year', 0, 'TOTY Grind Pack', NULL, 'min 84', 'min 28', NULL, 'max 3', 'min 2', NULL, 'max 2', 'min 1', 'min 1', '4-4-1-1',  'toty'),
(4, 1, 'The Special One', 0, 'Campaign Mix Pack', NULL, 'min 83', 'min 22', NULL, 'max 3', NULL, 'max 3', 'max 2', NULL, NULL, '4-4-2',  'special'),
(5, 2, 'Bronze Upgrade', NULL, 'Silver Pack', 'bronze', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-3-3', 'bronze'),
(6, 2, 'Silver Upgrade', NULL, 'Gold Pack', 'silver', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-3-3', 'silver'),
(7, 2, 'Gold Upgrade', NULL, 'Jumbo Gold Pack', 'gold', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-3-3', 'gold'),
(8, 2, 'TOTY Upgrade', '0', 'TOTY Pack', NULL, 'min 90', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '5-4-1', 'toty'),
(9, 2, '80+ x10 Upgrade', '10', '80+x10 Players Pack', NULL, 'min 83', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-3-1-2', 'special'),
(10, 2, '82+ x10 Upgrade', '10', '82+x10 Players Pack', NULL, 'min 85', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-2-1-3', 'special'),
(11, 2, '85+ x4 Upgrade', '10', '85+x4 Players Pack', NULL, 'min 86', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-1-4-1', 'special'),
(12, 2, '87+ Hero Upgrade', '5', '87+ Hero Pack', NULL, 'min 87', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '3-5-2', 'hero'),
(13, 2, '88+ Icon or Hero Upgrade', '5', '88+ Hero or Icon Pack', NULL, 'min 88', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '3-1-4-2', 'icon-hero'),
(14, 2, '90+ Icon Upgrade', '5', '90+ Icon Pack', NULL, 'min 90', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-1-2-1-2', 'icon'),
(15, 3, 'Getting Started', '0', 'Mixed Players Pack', NULL, 'min 62', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4-2-4', 'start'),
(16, 3, 'Learning Chemistry', '0', 'Gold Pack', NULL, 'min 64', NULL, NULL, NULL, NULL, NULL, 'min 1', NULL, NULL, '3-4-3', 'learn'),
(17, 3, 'League Links', '0', 'Jumbo Gold Pack', NULL, 'min 68', 'min 15', 'max 3', NULL, NULL, NULL, NULL, NULL, NULL, '5-2-1-2', 'league'),
(18, 3, 'Nation Links', '0', 'Jumbo Gold Pack', NULL, 'min 68', 'min 15', NULL, NULL, 'max 3', NULL, NULL, NULL, NULL, '3-4-2-1', 'nation'),
(19, 3, 'League and Nation Hybrid', '0', 'Mega Pack', NULL, 'min 80', 'min 20', 'min 3', NULL, 'min 2', NULL, NULL, NULL, NULL, '4-3-2-1', 'hybrid');


-- --------------------------------------------------------
--
-- A tábla indexei `draftrewards`
--
ALTER TABLE `draftrewards`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `draftreward_packs`
--
ALTER TABLE `draftreward_packs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `draftreward_packs_ibfk_1` (`draftreward_id`),
  ADD KEY `draftreward_packs_ibfk_2` (`pack_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `packWeightID` (`packWeightID`);

--
-- A tábla indexei `packweights`
--
ALTER TABLE `packweights`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `rewards`
--
ALTER TABLE `rewards`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `sbc`
--
ALTER TABLE `sbc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- A tábla indexei `sbccategories`
--
ALTER TABLE `sbccategories`
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
-- A tábla indexei `userclub`
--
ALTER TABLE `userclub`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- A tábla indexei `userpacks`
--
ALTER TABLE `userpacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userPacks_ibfk_1` (`user_id`),
  ADD KEY `userPacks_ibfk_2` (`pack_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- A tábla indexei `user_objective_claims`
--
ALTER TABLE `user_objective_claims`
  ADD UNIQUE KEY `user_id` (`user_id`,`objective_id`);

--
-- A tábla indexei `user_subobjective_progress`
--
ALTER TABLE `user_subobjective_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_sub` (`user_id`,`subobjective_id`),
  ADD KEY `user_subobjective_progress_ibfk_1` (`user_id`),
  ADD KEY `user_subobjective_progress_ibfk_2` (`subobjective_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `draftrewards`
--
ALTER TABLE `draftrewards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `draftreward_packs`
--
ALTER TABLE `draftreward_packs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
-- AUTO_INCREMENT a táblához `sbccategories`
--
ALTER TABLE `sbccategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `stats`
--
ALTER TABLE `stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `subobjectives`
--
ALTER TABLE `subobjectives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT a táblához `userclub`
--
ALTER TABLE `userclub`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `userpacks`
--
ALTER TABLE `userpacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `user_subobjective_progress`
--
ALTER TABLE `user_subobjective_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `draftreward_packs`
--
ALTER TABLE `draftreward_packs`
  ADD CONSTRAINT `draftreward_packs_ibfk_1` FOREIGN KEY (`draftreward_id`) REFERENCES `draftrewards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `draftreward_packs_ibfk_2` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `objectives`
--
ALTER TABLE `objectives`
  ADD CONSTRAINT `objectives_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `objcategories` (`id`);

--
-- Megkötések a táblához `sbc`
--
ALTER TABLE `sbc`
  ADD CONSTRAINT `sbc_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `sbccategories` (`id`);

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

--
-- Megkötések a táblához `userclub`
--
ALTER TABLE `userclub`
  ADD CONSTRAINT `userCLub_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `userpacks`
--
ALTER TABLE `userpacks`
  ADD CONSTRAINT `userPacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userPacks_ibfk_2` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `user_subobjective_progress`
--
ALTER TABLE `user_subobjective_progress`
  ADD CONSTRAINT `user_subobjective_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_subobjective_progress_ibfk_2` FOREIGN KEY (`subobjective_id`) REFERENCES `subobjectives` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
