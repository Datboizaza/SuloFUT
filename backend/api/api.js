const express = require("express");
const router = express.Router();
const database = require("../sql/database.js");
const fs = require("fs/promises");
const bcrypt = require("bcrypt");

//!Multer
const multer = require("multer"); //?npm install multer
const path = require("path");

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, path.join(__dirname, "../uploads"));
  },
  filename: (request, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname); //?egyedi név: dátum - file eredeti neve
  },
});

const upload = multer({ storage });

//! Json fájl beolvasása
const readJsonFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw); // JS objektum/tömb
  } catch (error) {
    throw new Error(`Olvasási hiba (json): ${error.message}`);
  }
};

//*Endpoints:

//! Formációk /api/formations
router.get("/formations", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/formations.json"),
    );
    response.status(200).json({ formations: data });
  } catch (error) {
    console.log("GET /api/formations error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Players /api/players
router.get("/players", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/players.json"),
    );
    response.status(200).json({ players: data });
  } catch (error) {
    console.log("GET /api/players error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// //! Chemistry kiszámolása
// router.get("/chemistry", async (request, response) => {
//   try {
//     function chemFromCountryCount(count) {
//       if (count >= 8) return 3;
//       if (count >= 5) return 2;
//       if (count >= 2) return 1;
//       return 0;
//     }
//     function chemFromLeagueCount(count) {
//       if (count >= 8) return 3;
//       if (count >= 5) return 2;
//       if (count >= 3) return 1;
//       return 0;
//     }
//     function chemFromClubCount(count) {
//       if (count >= 7) return 3;
//       if (count >= 4) return 2;
//       if (count >= 2) return 1;
//       return 0;
//     }
//     function chemFromIconCount(count) {
//       if (count >= 6) return 3;
//       if (count >= 4) return 2;
//       if (count >= 2) return 1;
//       return 0;
//     }

//     function inPosition(player) {
//       const slotPos = player.slotPos;
//       const positions = player.player_positions.split(", ");
//       if (!slotPos || slotPos === "ANY") return true;

//       if (slotPos === "DEF")
//         return positions.some((p) => ["LB", "CB", "RB"].includes(p));
//       if (slotPos === "MID")
//         return positions.some((p) =>
//           ["CDM", "CM", "CAM", "LM", "RM"].includes(p),
//         );
//       if (slotPos === "ATT")
//         return positions.some((p) => ["ST", "LW", "RW"].includes(p));

//       return positions.includes(slotPos);
//     }

//     function calculateChemistry(players) {
//       const activePlayers = players.filter((p) => p && inPosition(p));
//       let iconCount = 0;
//       const nationCount = {};
//       const leagueCount = {};
//       const clubCount = {};

//       // számlálás
//       activePlayers.forEach((p) => {
//         if (!nationCount[p.nationality_name]) {
//           nationCount[p.nationality_name] = 1;
//         } else {
//           nationCount[p.nationality_name]++;
//         }
//         if (p.rarity === "icon") {
//           nationCount[p.nationality_name] += 4;
//         }
//         if (p.rarity === "hero") {
//           nationCount[p.nationality_name] += 2;
//         }

//         if (!leagueCount[p.league_name]) {
//           leagueCount[p.league_name] = 1;
//         } else {
//           leagueCount[p.league_name]++;
//         }
//         if (p.rarity === "icon") {
//           leagueCount[p.league_name] += 1;
//         }
//         if (p.rarity === "hero") {
//           leagueCount[p.league_name] += 2;
//         }
//         if (!clubCount[p.club_name]) {
//           clubCount[p.club_name] = 1;
//         } else {
//           clubCount[p.club_name]++;
//         }
//         if (p.rarity === "icon") {
//           clubCount[p.club_name] += 1;
//         }
//         if (p.rarity === "hero") {
//           clubCount[p.club_name] += 1;
//         }

//         if (p.rarity === "icon") {
//           iconCount += 1;
//         }
//       });

//       // chemistry kiszámítás
//       return players.map((player) => {
//         if (!player) return null;

//         if (!inPosition(player)) {
//           return {
//             player_id: player.player_id,
//             chemistry: 0,
//             inPosition: false,
//             iconCount: iconCount,
//           };
//         }

//         let chemistry = 0;
//         chemistry += chemFromCountryCount(
//           nationCount[player.nationality_name] || 0,
//         );
//         chemistry += chemFromLeagueCount(leagueCount[player.league_name] || 0);
//         chemistry += chemFromClubCount(clubCount[player.club_name] || 0);
//         chemistry += chemFromIconCount(iconCount);
//         if (chemistry > 3) {
//           chemistry = 3;
//         }

//         return {
//           player_id: player.player_id,
//           chemistry,
//           inPosition: true,
//         };
//       });
//     }

//     const team = draftselectedPlayers11;

//     const teamWithChemistry = calculateChemistry(team);

//     response.status(200).json({
//       teamChemistry: teamWithChemistry.reduce((sum, p) => sum + p.chemistry, 0),
//       players: teamWithChemistry,
//     });
//   } catch (error) {
//     console.log("GET /api/chemistry error:", error);
//     response.status(500).json({ message: "Internal server error" });
//   }
// });

// //! Rating kiszámolása
// router.get("/rating", async (request, response) => {
//   try {
//     const starting11players = await draftselectedPlayers11;
//     const subplayers = await draftselectedPlayersSubs;

//     if (starting11players.length === 0) {
//       return response.json({ rating: 0 });
//     }

//     const starting11ratings = starting11players.map((p) => Number(p.overall));
//     const subratings = subplayers.map((p) => Number(p.overall));

//     let starting11ratingsSum = 0;
//     for (let i = 0; i < starting11ratings.length; i++) {
//       starting11ratingsSum += starting11ratings[i];
//     }

//     let subratingsSum = 0;
//     for (let i = 0; i < subratings.length; i++) {
//       subratingsSum += subratings[i];
//     }
//     const subavg = Math.round(subratingsSum / 7);

//     const correctedSum = starting11ratingsSum + subavg;

//     const correctedSumAvg = correctedSum / 12;

//     const finalRating = Math.round(correctedSumAvg);

//     response.status(200).json({
//       rating: finalRating,
//     });
//   } catch (error) {
//     console.log("GET /api/rating error:", error);
//     response.status(500).json({ message: "Internal server error" });
//   }
// });

// //! Játékosok Swap-olása
// router.put("/swap", (request, response) => {
//   try {
//     const { aId, bId, aSlotPos, bSlotPos } = request.body;

//     const arrays = {
//       starting11: draftselectedPlayers11,
//       subs: draftselectedPlayersSubs,
//       response: draftselectedPlayersRes,
//     };

//     const findPlayer = (playerId) => {
//       for (const [name, arr] of Object.entries(arrays)) {
//         const idx = arr.findIndex(
//           (p) => String(p.player_id) === String(playerId),
//         );
//         if (idx !== -1) return { name, arr, idx };
//       }
//       return null;
//     };

//     const A = findPlayer(aId);
//     const B = findPlayer(bId);

//     const temp = A.arr[A.idx];
//     A.arr[A.idx] = B.arr[B.idx];
//     B.arr[B.idx] = temp;

//     if (A.arr[A.idx]) A.arr[A.idx].slotPos = aSlotPos;
//     if (B.arr[B.idx]) B.arr[B.idx].slotPos = bSlotPos;

//     return response.json({ message: "success" });
//   } catch (error) {
//     console.log("PUT /api/swap error:", error);
//     return response.status(500).json({ message: "Internal server error" });
//   }
// });

//!Update Coins
router.post("/updatecoins", async (request, response) => {
  try {
    const userId = request.session.userId;
    const coins = request.body.coins;

    await database.updateCoins(coins, userId);

    response.status(200).json({ message: "Coins updated" });
  } catch (error) {
    console.log("POST /api/updatecoins error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
