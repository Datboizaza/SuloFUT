const express = require("express");
const router = express.Router();
const database = require("../sql/database.js");
const rewardQueries = require("../sql/rewardQueries.js");
const storeQueries = require("../sql/storeQueries.js");
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

//! Reward id szerint
router.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const reward = await rewardQueries.getRewardById(id);
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

//! Draft reward value szerint
router.get("/draftrewards/:rewardValue", async (request, response) => {
  const rewardValue = request.params.rewardValue;
  try {
    const rows = await rewardQueries.getDraftRewards(rewardValue);

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

//! Reward claim-elése
router.post("/draftrewards/claim", async (request, response) => {
  const { rewardId } = request.body;
  const userId = request.session.userId;
  try {
    const rows = await rewardQueries.getDraftRewardById(rewardId);
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
      await storeQueries.addPack(userId, pack.id);
    }

    response.status(200).json({ message: "Draft reward claimed!" });
  } catch (error) {
    console.log("POST /api/draftrewards/claim error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
