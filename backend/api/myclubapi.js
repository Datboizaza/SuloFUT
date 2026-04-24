const express = require("express");
const router = express.Router();
const myClubQueries = require("../sql/myClubQueries.js");
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

//*Endpoints:

//! Player-ek hozzáadása a klubhoz
router.post("/addPlayersToClub", async (request, response) => {
  try {
    const userId = request.session.userId;
    const newPlayers = request.body.players;

    const rows = await myClubQueries.currentClub(userId);

    let currentPlayers = [];

    if (rows[0].userPlayers) {
      currentPlayers = JSON.parse(rows[0].userPlayers);
    }

    const updatedPlayers = [...currentPlayers, ...newPlayers];

    await myClubQueries.updateClub(updatedPlayers, userId);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/addPlayersToClub error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Klub "frissítése"
router.post("/setClubPlayers", async (request, response) => {
  try {
    const userId = request.session.userId;
    const players = request.body.players;

    await myClubQueries.updateClub(players, userId);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/setClubPlayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Bejelentkezett user klubja
router.get("/", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }

    players.sort((a, b) => Number(b.overall) - Number(a.overall));

    response.status(200).json(players);
  } catch (error) {
    console.log("GET /api/myClub error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! User klubból és squadból törlés
router.post("/deleteClubPlayers", async (request, response) => {
  try {
    const userId = request.session.userId;
    const playersToRemove = request.body.players;

    await myClubQueries.removePlayersEverywhere(userId, playersToRemove);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/deleteClubPlayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Quick sell
router.post("/removeplayer", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { playerId } = request.body;

    await myClubQueries.removePlayersEverywhere(userId, [playerId]);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /removePlayer error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! User squad
router.get("/squad", async (request, response) => {
  try {
    const userId = request.session.userId;

    const squadRow = await myClubQueries.getSquad(userId);

    response.status(200).json({ squad: squadRow[0] });
  } catch (error) {
    console.log("GET /api/squad error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Update squad players
router.post("/squad/save", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { players } = request.body;

    await myClubQueries.updateSquadPlayers(players, userId);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/squad/save error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Update squad name
router.post("/squad/updatename", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { squadName } = request.body;

    await myClubQueries.updateSquadName(squadName, userId);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/squad/updatename error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Update formation
router.post("/squad/updateformation", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { formation } = request.body;

    await myClubQueries.updateFormation(formation, userId);

    response.status(200).json({ message: "success" });
  } catch (error) {
    console.log("POST /api/squad/updateformation error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Order by
router.post("/sortBy", async (request, response) => {
  try {
    const userId = request.session.userId;
    const condId = request.body.condId;
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const rateASC = [...players].sort(
      (a, b) => Number(a.overall) - Number(b.overall),
    );
    const rateDESC = [...players].sort(
      (a, b) => Number(b.overall) - Number(a.overall),
    );
    const valueASC = [...players].sort(
      (a, b) => Number(a.value) - Number(b.value),
    );
    const valueDESC = [...players].sort(
      (a, b) => Number(b.value) - Number(a.value),
    );
    const conds = {
      0: rateASC,
      1: rateDESC,
      2: valueASC,
      3: valueDESC,
      4: players,
    };

    const condition = conds[condId];
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Rating range szűrés
router.post("/ovrRange", async (request, response) => {
  try {
    const userId = request.session.userId;
    const condMin = request.body.condMin;
    const condMax = request.body.condMax;
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const ovr = Number(p.overall);
      const min = Number(condMin);
      const max = Number(condMax);

      return (!min || ovr >= min) && (!max || ovr <= max);
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Player név szűrés
router.post("/playerName", async (request, response) => {
  try {
    const userId = request.session.userId;
    const name = (request.body.name || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const playerName =
        String(p.long_name).toLowerCase().includes(name) ||
        String(p.short_name).toLowerCase().includes(name);

      return playerName;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Rarity szűrés
router.post("/playerRarity", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rarity = (request.body.rarity || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const Rarity = String(p.rarity).toLowerCase().includes(rarity);

      return Rarity;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Position szűrés
router.post("/playerPosition", async (request, response) => {
  try {
    const userId = request.session.userId;
    const Position = (request.body.position || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const position = String(p.player_positions).toLowerCase();

      const matchesPosition =
        position.includes(Position) ||
        (Position === "defender" &&
          ["cb", "lb", "rb"].some((x) => position.includes(x))) ||
        (Position === "midfielder" &&
          ["cdm", "cm", "cam", "lm", "rm"].some((x) => position.includes(x))) ||
        (Position === "attacker" &&
          ["st", "lw", "rw"].some((x) => position.includes(x)));

      return matchesPosition;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Nemzetiség szűrés
router.post("/playerNationality", async (request, response) => {
  try {
    const userId = request.session.userId;
    const nationality = (request.body.nationality || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const Nationality = String(p.nationality_name)
        .toLowerCase()
        .includes(nationality);

      return Nationality;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Liga szűrés
router.post("/playerLeague", async (request, response) => {
  try {
    const userId = request.session.userId;
    const league = (request.body.league || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const League = String(p.league_name).toLowerCase().includes(league);

      return League;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Csapat szűrés
router.post("/playerClub", async (request, response) => {
  try {
    const userId = request.session.userId;
    const club = (request.body.club || "").toLowerCase();
    let players = request.body.players;

    if (Array.isArray(players) && typeof players[0] !== "object") {
      const rows = await myClubQueries.currentClub(userId);
      const allPlayers = rows[0].userPlayers
        ? JSON.parse(rows[0].userPlayers)
        : [];
      players = allPlayers.filter((p) => players.includes(p.player_id));
    }
    if (!Array.isArray(players)) {
      const rows = await myClubQueries.currentClub(userId);

      players = rows[0].userPlayers ? JSON.parse(rows[0].userPlayers) : [];
    }

    const condition = players.filter((p) => {
      const Club = String(p.club_name).toLowerCase().includes(club);

      return Club;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
