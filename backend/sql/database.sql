-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Már 23. 12:15
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
  `best_draft` int(11) NOT NULL DEFAULT 0,
  `top_squad` int(11) NOT NULL DEFAULT 0,
  `club_value` int(11) NOT NULL DEFAULT 0,
  `cards_opened` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `stats`
--

INSERT INTO `stats` (`id`, `user_id`, `best_draft`, `top_squad`, `club_value`, `cards_opened`) VALUES
(1, 1, 117, 100, 23750, 245),
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
(53, 53, 119, 122, 436720, 493);

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
  `userPlayers` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `userclub`
--

INSERT INTO `userclub` (`id`, `user_id`, `coinNumber`, `userPlayers`) VALUES
(1, 1, 200000, NULL);

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
(1, 'TestUser', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge'),
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
(53, 'bobberito', '$2b$10$1dtV5ww2JIl0pu4I1EQC3uEKvaTM4ADETEpeU03UE.e48Oe0.wPge');

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
  VALUES (NEW.id, 0);
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
(3, 1, 20, 2, 0),
(4, 1, 21, 2, 0),
(5, 1, 22, 2, 0),
(6, 1, 23, 2, 0),
(7, 1, 24, 2, 0);

--
-- Indexek a kiírt táblákhoz
--

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
-- AUTO_INCREMENT a táblához `userclub`
--
ALTER TABLE `userclub`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `userpacks`
--
ALTER TABLE `userpacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `user_subobjective_progress`
--
ALTER TABLE `user_subobjective_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
