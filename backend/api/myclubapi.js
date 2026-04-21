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

//! User klubból törlés
router.post("/deleteClubPlayers", async (request, response) => {
  try {
    const userId = request.session.userId;
    const playersToRemove = request.body.players;

    const rows = await myClubQueries.currentClub(userId);
    let currentPlayers = [];
    if (rows[0].userPlayers) {
      currentPlayers = JSON.parse(rows[0].userPlayers);
    }
    const updatedPlayers = currentPlayers.filter(
      (player) => !playersToRemove.includes(String(player.player_id)),
    );

    await myClubQueries.updateClub(updatedPlayers, userId);

    response.status(200).json({ message: "players removed" });
  } catch (error) {
    console.log("POST /api/deleteClubPlayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
