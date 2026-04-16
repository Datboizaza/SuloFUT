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

//*Endpoints:

//! Leaderboard type szerint
router.get("/:type", async (request, response) => {
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

module.exports = router;
