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

//!Endpoints:
//?GET /api/test
router.get("/test", (request, response) => {
  response.status(200).json({
    message: "Ez a végpont működik.",
  });
});

//?GET /api/testsql
router.get("/testsql", async (request, response) => {
  try {
    const selectall = await database.selectall();
    response.status(200).json({
      message: "Ez a végpont működik.",
      results: selectall,
    });
  } catch (error) {
    response.status(500).json({
      message: "Ez a végpont nem működik.",
    });
  }
});

//! User-ek eltárolása/login
router.get("/users", async (request, response) => {
  try {
    const users = await database.selectall();
    response.status(200).json({
      message: "Ez a végpont működik.",
      results: users,
    });
  } catch (error) {
    console.log("GET /users error:", error);
    response.status(500).json({
      message: "Ez a végpont nem működik.",
    });
  }
});

router.post("/users", async (request, response) => {
  try {
    const hashed = await bcrypt.hash(request.body.password, 10);
    const insertinto = await database.insertinto(request.body.username, hashed);
    response.status(200).json({
      message: "User created",
      insertId: insertinto,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({
        message: "This username is taken",
      });
    }
    response.status(500).json({
      message: "Ez a végpont nem működik.",
    });
    console.log("POST /users error:", error);
  }
});

router.post("/users/login", async (request, response) => {
  try {
    const user = await database.login(request.body.username);

    if (!user)
      return response.status(400).json({ message: "Invalid username" });

    const valid = await bcrypt.compare(request.body.password, user.password);

    if (!valid) return response.status(403).json({ message: "Wrong password" });

    request.session.userId = user.id;

    response.status(200).json({ message: "Logged in" });
  } catch (error) {
    console.log("POST /users/login error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/me", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const user = await database.getUserById(request.session.userId);
    response.status(200).json(user);
  } catch (error) {
    console.log("GET /users/me error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/changeusername", async (request, response) => {
  try {
    const userId = request.session.userId;
    const newUsername = request.body.username;

    await database.changeUsername(newUsername, userId);

    response.status(200).json({ message: "Username changed successfully" });
  } catch (error) {
    console.log("POST /users/changeusername error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/changepassword", async (request, response) => {
  try {
    const userId = request.session.userId;
    const hashed = await bcrypt.hash(request.body.password, 10);

    await database.changePassword(hashed, userId);

    response.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("POST /users/changepassword error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/logout", async (request, response) => {
  try {
    request.session.destroy(() => {
      response.clearCookie("connect.sid");

      response.status(200).json({ message: "Logged out" });
    });
  } catch (error) {
    console.log("POST /users/logout error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/delete", async (request, response) => {
  try {
    const userId = request.session.userId;

    await database.deleteUser(userId);
    await database.deleteUserPacks(userId);
    await database.deleteUserObjClaims(userId);
    await database.deleteUserSubobjProg(userId);
    await database.deleteUserClub(userId);
    await database.deleteUserStats(userId);

    request.session.destroy(() => {
      response.clearCookie("connect.sid");
      response.status(200).json({ message: "User deleted" });
    });
  } catch (error) {
    console.log("POST /users/delete error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! User cuccai
router.get("/users/me/coins", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const coins = await database.getUserCoinsById(request.session.userId);
    response.status(200).json(coins);
  } catch (error) {
    console.log("GET /users/me/coins error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/users/me/packs", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const packs = await database.getUserPacksById(request.session.userId);
    response.status(200).json(packs);
  } catch (error) {
    console.log("GET /users/me/packs error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! User statok
router.post("/users/me/bestdraft", async (request, response) => {
  try {
    const rating = request.body.rating;
    const result = await database.updateBestDraftById(
      rating,
      request.session.userId,
    );

    return response.status(200).json({
      bestDraft: rating,
    });
  } catch (error) {
    console.log("POST /users/me/bestdraft error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Json fájl beolvasása
const readJsonFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw); // JS objektum/tömb
  } catch (error) {
    throw new Error(`Olvasási hiba (json): ${error.message}`);
  }
};

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

//! 5 random formáció /api/randomformations
router.get("/randomformations", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/formations.json"),
    );

    function randomPick(arr, count) {
      const randomformaciok = [];
      const tombIndexek = [];

      while (
        randomformaciok.length < count &&
        randomformaciok.length < arr.length
      ) {
        const index = Math.floor(Math.random() * arr.length);

        if (!tombIndexek.includes(index)) {
          tombIndexek.push(index);
          randomformaciok.push(arr[index]);
        }
      }

      return randomformaciok;
    }

    response.status(200).json({ randomformations: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomformations error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

let currentStarting11SlotPos = [];
const subsSlotPos = ["GK", "DEF", "DEF", "MID", "MID", "ATT", "ATT"];
const resSlotPos = ["ANY", "ANY", "ANY", "ANY", "ANY"];
//! kiválasztott formáció pozíciói
router.post("/draft/formation", async (request, response) => {
  try {
    const { slotPosList } = request.body;
    currentStarting11SlotPos = slotPosList;
    return response.status(200).json({ message: true });
  } catch (error) {
    console.log("POST /api/draft/formation error:", error);
    return response.status(500).json({ message: "Internal server error" });
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

//! 5 random player (Captains) /api/randomplayers
router.get("/randomplayers", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/players.json"),
    );

    function randomPick(arr, count) {
      const randomjatekosok = [];
      const tombIndexek = [];

      while (
        randomjatekosok.length < count &&
        randomjatekosok.length < arr.length
      ) {
        const index = Math.floor(Math.random() * arr.length);

        if (!tombIndexek.includes(index) && arr[index].overall >= 88) {
          tombIndexek.push(index);
          randomjatekosok.push(arr[index]);
        }
      }

      return randomjatekosok;
    }

    response.status(200).json({ randomjatekosok: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Választott játékosok
let draftselectedPlayers = [];
let draftselectedPlayers11 = [];
let draftselectedPlayersSubs = [];
let draftselectedPlayersRes = [];
router.get("/draftselectedplayers", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedplayers: draftselectedPlayers,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/draftselectedplayers11", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedplayers11: draftselectedPlayers11,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayers11 error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/draftselectedplayersSubs", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedPlayersSubs: draftselectedPlayersSubs,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayersSubs error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/draftselectedplayersRes", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedPlayersRes: draftselectedPlayersRes,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayersRes error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/draftselectedplayers", async (request, response) => {
  try {
    const selectedplayer = request.body;

    draftselectedPlayers.push(selectedplayer);

    if (selectedplayer.starting11 === true) {
      draftselectedPlayers11.push(selectedplayer);
    } else if (
      selectedplayer.starting11 === false &&
      selectedplayer.resIndex === false
    ) {
      draftselectedPlayersSubs.push(selectedplayer);
    } else {
      draftselectedPlayersRes.push(selectedplayer);
    }

    response.status(200).json({
      draftselectedplayers: draftselectedPlayers,
      draftselectedPlayers11: draftselectedPlayers11,
      draftselectedPlayersSubs: draftselectedPlayersSubs,
      draftselectedPlayersRes: draftselectedPlayersRes,
    });
  } catch (error) {
    console.log("POST /api/draftselectedplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/draftselectedplayers", (request, response) => {
  try {
    draftselectedPlayers = [];
    draftselectedPlayers11 = [];
    draftselectedPlayersSubs = [];
    draftselectedPlayersRes = [];
    currentStarting11SlotPos = [];

    response.status(200).json({ message: "Successful draft reset" });
  } catch (error) {
    console.log("DELETE /api/draftselectedplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/draftselectedplayers11", (request, response) => {
  try {
    draftselectedPlayers11 = [];
    draftselectedPlayersSubs = [];

    response.status(200).json({ message: "Successful" });
  } catch (error) {
    console.log("DELETE /api/draftselectedplayers11 error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//!Pozíciónkénti random játékos generálás Rating Range-ekkel
router.get("/random/:pos", async (request, response) => {
  try {
    const pos = request.params.pos;
    const data = await readJsonFile(
      path.join(__dirname, "./files/players.json"),
    );

    const selectedIds = draftselectedPlayers.map((p) => p.player_id);

    const posGroups = {
      DEF: ["LB", "CB", "RB"],
      MID: ["LM", "RM", "CM", "CDM", "CAM"],
      ATT: ["LW", "RW", "ST"],
      ANY: [
        "LW",
        "RW",
        "ST",
        "LM",
        "RM",
        "CDM",
        "CM",
        "CAM",
        "RB",
        "CB",
        "LB",
        "GK",
      ],
    };

    const getPositions = (pos) => {
      return posGroups[pos] || [pos];
    };

    const getRatingRange = () => {
      const randomRatingRange = Math.floor(Math.random() * 10);

      if (randomRatingRange === 0) {
        return { min: 75, max: 80 };
      }

      if (randomRatingRange === 1 || randomRatingRange === 2) {
        return { min: 81, max: 84 };
      }

      if (
        randomRatingRange === 3 ||
        randomRatingRange === 4 ||
        randomRatingRange === 5 ||
        randomRatingRange === 6
      ) {
        return { min: 85, max: 87 };
      }

      return { min: 88, max: 99 };
    };

    const randomPick = (arr, count) => {
      const randomPlayers = [];
      const tombIndexek = [];
      const usedPlayerIds = [];
      const allowedPos = getPositions(pos);
      const { min, max } = getRatingRange();

      while (randomPlayers.length < count && tombIndexek.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);
        const player = arr[index];
        const playerPositions = player.player_positions.split(", ");

        const validPosition = allowedPos.some((position) =>
          playerPositions.includes(position),
        );

        if (
          !tombIndexek.includes(index) &&
          player.overall >= min &&
          player.overall <= max &&
          validPosition &&
          !usedPlayerIds.includes(player.player_id) &&
          !selectedIds.includes(player.player_id)
        ) {
          tombIndexek.push(index);
          usedPlayerIds.push(player.player_id);
          randomPlayers.push(player);
        } else if (!tombIndexek.includes(index)) {
          tombIndexek.push(index);
        }
      }

      return randomPlayers;
    };

    return response.status(200).json({ randomPlayers: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/random/:pos error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

//! Chemistry kiszámolása
router.get("/chemistry", async (request, response) => {
  try {
    function chemFromCountryCount(count) {
      if (count >= 8) return 3;
      if (count >= 5) return 2;
      if (count >= 2) return 1;
      return 0;
    }
    function chemFromLeagueCount(count) {
      if (count >= 8) return 3;
      if (count >= 5) return 2;
      if (count >= 3) return 1;
      return 0;
    }
    function chemFromClubCount(count) {
      if (count >= 7) return 3;
      if (count >= 4) return 2;
      if (count >= 2) return 1;
      return 0;
    }
    function chemFromIconCount(count) {
      if (count >= 6) return 3;
      if (count >= 4) return 2;
      if (count >= 2) return 1;
      return 0;
    }

    function inPosition(player) {
      const slotPos = player.slotPos;
      const positions = player.player_positions.split(", ");
      if (!slotPos || slotPos === "ANY") return true;

      if (slotPos === "DEF")
        return positions.some((p) => ["LB", "CB", "RB"].includes(p));
      if (slotPos === "MID")
        return positions.some((p) =>
          ["CDM", "CM", "CAM", "LM", "RM"].includes(p),
        );
      if (slotPos === "ATT")
        return positions.some((p) => ["ST", "LW", "RW"].includes(p));

      return positions.includes(slotPos);
    }

    function calculateChemistry(players) {
      const activePlayers = players.filter((p) => p && inPosition(p));
      let iconCount = 0;
      const nationCount = {};
      const leagueCount = {};
      const clubCount = {};

      // számlálás
      activePlayers.forEach((p) => {
        if (!nationCount[p.nationality_name]) {
          nationCount[p.nationality_name] = 1;
        } else {
          nationCount[p.nationality_name]++;
        }
        if (p.rarity === "icon") {
          nationCount[p.nationality_name] += 4;
        }
        if (p.rarity === "hero") {
          nationCount[p.nationality_name] += 2;
        }

        if (!leagueCount[p.league_name]) {
          leagueCount[p.league_name] = 1;
        } else {
          leagueCount[p.league_name]++;
        }
        if (p.rarity === "icon") {
          leagueCount[p.league_name] += 1;
        }
        if (p.rarity === "hero") {
          leagueCount[p.league_name] += 2;
        }
        if (!clubCount[p.club_name]) {
          clubCount[p.club_name] = 1;
        } else {
          clubCount[p.club_name]++;
        }
        if (p.rarity === "icon") {
          clubCount[p.club_name] += 1;
        }
        if (p.rarity === "hero") {
          clubCount[p.club_name] += 1;
        }

        if (p.rarity === "icon") {
          iconCount += 1;
        }
      });

      // chemistry kiszámítás
      return players.map((player) => {
        if (!player) return null;

        if (!inPosition(player)) {
          return {
            player_id: player.player_id,
            chemistry: 0,
            inPosition: false,
            iconCount: iconCount,
          };
        }

        let chemistry = 0;
        chemistry += chemFromCountryCount(
          nationCount[player.nationality_name] || 0,
        );
        chemistry += chemFromLeagueCount(leagueCount[player.league_name] || 0);
        chemistry += chemFromClubCount(clubCount[player.club_name] || 0);
        chemistry += chemFromIconCount(iconCount);
        if (chemistry > 3) {
          chemistry = 3;
        }

        return {
          player_id: player.player_id,
          chemistry,
          inPosition: true,
        };
      });
    }

    const team = draftselectedPlayers11;

    const teamWithChemistry = calculateChemistry(team);

    response.status(200).json({
      teamChemistry: teamWithChemistry.reduce((sum, p) => sum + p.chemistry, 0),
      players: teamWithChemistry,
    });
  } catch (error) {
    console.log("GET /api/chemistry error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Rating kiszámolása
router.get("/rating", async (request, response) => {
  try {
    const starting11players = await draftselectedPlayers11;
    const subplayers = await draftselectedPlayersSubs;

    if (starting11players.length === 0) {
      return response.json({ rating: 0 });
    }

    const starting11ratings = starting11players.map((p) => Number(p.overall));
    const subratings = subplayers.map((p) => Number(p.overall));

    let starting11ratingsSum = 0;
    for (let i = 0; i < starting11ratings.length; i++) {
      starting11ratingsSum += starting11ratings[i];
    }

    let subratingsSum = 0;
    for (let i = 0; i < subratings.length; i++) {
      subratingsSum += subratings[i];
    }
    const subavg = Math.round(subratingsSum / 7);

    const correctedSum = starting11ratingsSum + subavg;

    const correctedSumAvg = correctedSum / 12;

    const finalRating = Math.round(correctedSumAvg);

    response.status(200).json({
      rating: finalRating,
    });
  } catch (error) {
    console.log("GET /api/rating error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Játékosok Swap-olása
router.put("/swap", (request, response) => {
  try {
    const { aId, bId, aSlotPos, bSlotPos } = request.body;

    const arrays = {
      starting11: draftselectedPlayers11,
      subs: draftselectedPlayersSubs,
      response: draftselectedPlayersRes,
    };

    const findPlayer = (playerId) => {
      for (const [name, arr] of Object.entries(arrays)) {
        const idx = arr.findIndex(
          (p) => String(p.player_id) === String(playerId),
        );
        if (idx !== -1) return { name, arr, idx };
      }
      return null;
    };

    const A = findPlayer(aId);
    const B = findPlayer(bId);

    const temp = A.arr[A.idx];
    A.arr[A.idx] = B.arr[B.idx];
    B.arr[B.idx] = temp;

    if (A.arr[A.idx]) A.arr[A.idx].slotPos = aSlotPos;
    if (B.arr[B.idx]) B.arr[B.idx].slotPos = bSlotPos;

    return response.json({ ok: true });
  } catch (error) {
    console.log("PUT /api/swap error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
});

//!Packek/rewardok
router.get("/rewards/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const reward = await database.getRewardById(id);
    response.status(200).json({
      message: "Ez a végpont működik.",
      results: reward,
    });
  } catch (error) {
    console.log("GET /api/rewards/:id error:", error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/draftrewards/:rewardValue", async (request, response) => {
  const rewardValue = request.params.rewardValue;
  try {
    const rows = await database.getDraftRewards(rewardValue);

    const rewardsMap = {};

    for (const row of rows) {
      if (!rewardsMap[row.draftRewardId]) {
        rewardsMap[row.draftRewardId] = {
          id: row.draftRewardId,
          coins: row.coins,
          rewardValue: row.rewardValue,
          packs: [],
        };
      }

      if (row.packId) {
        rewardsMap[row.draftRewardId].packs.push({
          id: row.packId,
          name: row.packName,
          price: row.packPrice,
          design: row.packDesign,
        });
      }
    }

    const draftrewards = Object.values(rewardsMap);

    response.status(200).json({
      message: "Ez a végpont működik.",
      results: draftrewards,
    });
  } catch (error) {
    console.log("GET /api/draftrewards error:", error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/draftrewards/claim", async (request, response) => {
  const { rewardId } = request.body;
  const userId = request.session.userId;
  try {
    const rows = await database.getDraftRewardById(rewardId);
    const reward = {
      id: rows[0].draftRewardId,
      coins: rows[0].coins,
      rewardValue: rows[0].rewardValue,
      packs: [],
    };
    for (const row of rows) {
      if (row.packId) {
        reward.packs.push({
          id: row.packId,
          name: row.packName,
          price: row.packPrice,
          design: row.packDesign,
        });
      }
    }

    if (reward.coins) {
      await database.updateCoins(reward.coins, userId);
    }

    for (const pack of reward.packs) {
      await database.addPack(userId, pack.id);
    }

    response.status(200).json({ message: "Draft reward claimed!" });
  } catch (error) {
    console.log("POST /api/draftrewards/claim error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//!Objective-ek
router.get("/objectives", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rows = await database.getObjectives(userId);

    const result = {
      foundations: [],
      milestones: [],
      campaign: [],
    };

    const objectivesMap = {};

    rows.forEach((row) => {
      const category = row.category.toLowerCase();

      if (!objectivesMap[row.objective_id]) {
        objectivesMap[row.objective_id] = {
          id: row.objective_id,
          name: row.objective_name,

          claimed: !!row.objective_claimed,

          groupreward:
            row.group_coins || row.group_pack_id
              ? {
                  coins: row.group_coins,
                  packs: [],
                }
              : null,

          subobjectives: [],
        };

        if (result[category]) {
          result[category].push(objectivesMap[row.objective_id]);
        }
      }

      const objective = objectivesMap[row.objective_id];

      if (row.group_pack_id && objective.groupreward) {
        const exists = objective.groupreward.packs.some(
          (p) => p.id === row.group_pack_id,
        );

        if (!exists) {
          objective.groupreward.packs.push({
            id: row.group_pack_id,
            name: row.group_pack_name,
            price: row.group_pack_price,
            design: row.group_pack_design,
          });
        }
      }

      let subobj = objective.subobjectives.find((s) => s.id === row.sub_id);

      if (!subobj) {
        subobj = {
          id: row.sub_id,
          task: row.task,
          requirement: row.requirement_int,
          progress: row.progress_int,

          claimed: !!row.sub_claimed,

          reward:
            row.sub_coins || row.sub_pack_id
              ? {
                  coins: row.sub_coins,
                  packs: [],
                }
              : null,
        };

        objective.subobjectives.push(subobj);
      }

      if (row.sub_pack_id && subobj.reward) {
        const exists = subobj.reward.packs.some(
          (p) => p.id === row.sub_pack_id,
        );

        if (!exists) {
          subobj.reward.packs.push({
            id: row.sub_pack_id,
            name: row.sub_pack_name,
            price: row.sub_pack_price,
            design: row.sub_pack_design,
          });
        }
      }
    });

    response.status(200).json({
      message: "Ez a végpont működik",
      results: result,
    });
  } catch (error) {
    console.log("GET /api/objectives error:", error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/users/me/objectiveprogress", async (request, response) => {
  try {
    const subId = request.body.subId;
    const userId = request.session.userId;

    if (!userId) {
      return response.status(401).json({ message: "Not logged in" });
    }

    await database.updateSubobjectiveProgress(userId, subId);

    return response.status(200).json({
      message: "Progress updated",
    });
  } catch (error) {
    console.log("GET /api/objectiveprogress error:", error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/objectives/claimsubobj", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { subId } = request.body;

    const subRows = await database.getSubobjAndRew(subId);
    const sub = subRows[0];

    const progressRows = await database.isSubobjClaimed(userId, subId);
    const progress = progressRows[0];

    if (!progress || progress.progress_int < progress.requirement_int) {
      return response.status(400).json({ message: "Not completed yet" });
    }

    if (progress.claimed) {
      return response.status(400).json({ message: "Already claimed" });
    }

    if (sub.coins) {
      await database.updateCoins(sub.coins, userId);
    }

    if (sub.packIds) {
      await database.addPack(userId, sub.packIds);
    }

    await database.setClaimed(userId, subId);

    response.status(200).json({ message: "Reward claimed" });
  } catch (error) {
    console.log("POST /api//objectives/claimsubobj error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/objectives/claimobjgroup", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { objectiveId } = request.body;

    const sub = await database.getSubobjectivesByObjective(userId, objectiveId);

    const completed = sub.every(
      (e) => e.progress_int >= e.requirement_int && e.claimed,
    );

    if (!completed) {
      return response.status(400).json({ message: "Not completed yet" });
    }

    const groupclaimed = await database.isGroupClaimed(userId, objectiveId);
    if (groupclaimed?.claimed) {
      return response
        .status(400)
        .json({ message: "Group reward already claimed" });
    }

    const groupRewardRows = await database.getGroupReward(objectiveId);
    const reward = groupRewardRows[0];

    if (reward.coins) {
      await database.updateCoins(reward.coins, userId);
    }

    if (reward.packIds) {
      await database.addPack(userId, reward.packIds);
    }

    await database.setGroupClaimed(userId, objectiveId);

    response.status(200).json({ message: "Group reward claimed" });
  } catch (error) {
    console.log("POST /api/objectives/claimobjgroup error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Leaderboard
router.get("/leaderboard/:type", async (request, response) => {
  try {
    const type = request.params.type;
    const types = {
      best_draft: "best_draft",
      top_squad: "top_squad",
      club_value: "club_value",
      cards_opened: "cards_opened",
    };
    const rows = await database.getLeaderboard(type);

    response.status(200).json({
      results: rows,
    });
  } catch (error) {
    console.log("GET /api/leaderboard/:type error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Packs
router.get("/generatePack/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const packWeights = await database.getallWeightData(id);
    const packData = await database.getPackDetails(id);
    const playerCount = packData.playerCount;
    const data = await readJsonFile(
      path.join(__dirname, "./files/players.json"),
    );
    const conds = {
      7: 80,
      8: 82,
      9: 85,
      11: 90,
      15: 87,
      17: 88,
    };

    function randompack(arr, count, condition) {
      const randomjatekosok = [];
      const tombIndexek = [];
      const playerQuality = packData.playerQuality
        .split("/")
        .map((q) => q.trim());

      while (
        randomjatekosok.length < count &&
        tombIndexek.length < arr.length
      ) {
        const rarityCount = {};
        for (let i = 0; i < arr.length; i++) {
          if (
            !tombIndexek.includes(i) &&
            playerQuality.includes(arr[i].rarity)
          ) {
            const rarity = arr[i].rarity;
            rarityCount[rarity] = (rarityCount[rarity] || 0) + 1;
          }
        }

        const rarityWeights = [];
        let totalWeight = 0;

        for (const rarity of Object.keys(rarityCount)) {
          let weight = 0;

          if (rarity.includes("bronze")) weight = packWeights.bronzeWeight || 1;
          else if (rarity.includes("silver"))
            weight = packWeights.silverWeight || 1;
          else if (rarity.includes("gold"))
            weight = packWeights.goldWeight || 1;
          else if (rarity.includes("flashback"))
            weight = packWeights.flashbackWeight || 1;
          else if (rarity.includes("scream"))
            weight = packWeights.screamWeight || 1;
          else if (rarity.includes("toty"))
            weight = packWeights.totyWeight || 1;
          else if (rarity.includes("icon"))
            weight = packWeights.iconWeight || 1;
          else if (rarity.includes("hero"))
            weight = packWeights.heroWeight || 1;

          totalWeight += weight;
          rarityWeights.push({ rarity, weight });
        }

        let random = Math.random() * totalWeight;
        let selectedRarity = null;

        for (let i = 0; i < rarityWeights.length && !selectedRarity; i++) {
          random -= rarityWeights[i].weight;
          if (random <= 0) {
            selectedRarity = rarityWeights[i].rarity;
          }
        }

        if (selectedRarity) {
          const validPlayers = [];
          for (let i = 0; i < arr.length; i++) {
            if (
              !tombIndexek.includes(i) &&
              arr[i].rarity === selectedRarity &&
              arr[i].overall >= condition
            ) {
              validPlayers.push({ index: i, player: arr[i] });
            }
          }

          if (validPlayers.length > 0) {
            const randomIndex = Math.floor(Math.random() * validPlayers.length);
            const selected = validPlayers[randomIndex];
            tombIndexek.push(selected.index);
            randomjatekosok.push(selected.player);
          }
        }
      }
      randomjatekosok.sort((a, b) => b.overall - a.overall);

      return randomjatekosok;
    }
    const condition = conds[id] || 0;

    response
      .status(200)
      .json({ randomjatekosok: randompack(data, playerCount, condition) });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//!Store
router.get("/storepacks", async (request, response) => {
  try {
    const packs = await database.getStorePacks();
    response.status(200).json(packs);
  } catch (error) {
    console.log("GET /storepacks error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/deletemypack", async (request, response) => {
  try {
    const userId = request.session.userId;
    const packId = request.body.packId;

    await database.deleteMyPack(userId, packId);

    response.status(200).json({ message: "Pack deleted from user" });
  } catch (error) {
    console.log("POST /api/deletemypack error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

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

//! User club
router.post("/addPlayersToClub", async (request, response) => {
  try {
    const userId = request.session.userId;
    const newPlayers = request.body.players;

    const rows = await database.currentClub(userId);

    let currentPlayers = [];

    if (rows[0].userPlayers) {
      currentPlayers = JSON.parse(rows[0].userPlayers);
    }

    const updatedPlayers = [...currentPlayers, ...newPlayers];

    await database.updateClub(updatedPlayers, userId);

    response.status(200).json({ success: true });
  } catch (error) {
    console.log("POST /api/addplayerstoclub error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/myClub", async (request, response) => {
  try {
    const userId = request.session.userId;

    const rows = await database.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }

    response.status(200).json(players);
  } catch (error) {
    console.log("GET /api/myClub error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! SBC
router.get("/allsbc", async (request, response) => {
  try {
    const rows = await database.getSBC();

    const result = {
      challenges: [],
      upgrades: [],
      foundations: [],
    };

    rows.forEach((row) => {
      result[row.category_name].push({
        id: row.id,
        name: row.name,
        reward: {
          coins: row.reward || null,
          packs: [],
        },
      });
    });

    response.status(200).json({ results: result });
  } catch (error) {
    console.log("GET /api/allsbc error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
