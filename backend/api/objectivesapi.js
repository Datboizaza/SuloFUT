const express = require("express");
const router = express.Router();
const database = require("../sql/database.js");
const objectivesQueries = require("../sql/objectivesQueries.js");
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

//!Objective-ek
router.get("/", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rows = await objectivesQueries.getObjectives(userId);

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

//!Subobjective-ek claim-elése
router.post("/claimsubobj", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { subId } = request.body;

    const subRows = await objectivesQueries.getSubobjAndRew(subId);
    const sub = subRows[0];

    const progressRows = await objectivesQueries.isSubobjClaimed(userId, subId);
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
      await storeQueries.addPack(userId, sub.packIds);
    }

    await objectivesQueries.setClaimed(userId, subId);

    response.status(200).json({ message: "Reward claimed" });
  } catch (error) {
    console.log("POST /api//objectives/claimsubobj error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//!Objective group-ok claim-elése
router.post("/claimobjgroup", async (request, response) => {
  try {
    const userId = request.session.userId;
    const { objectiveId } = request.body;

    const sub = await objectivesQueries.getSubobjectivesByObjective(
      userId,
      objectiveId,
    );

    const completed = sub.every(
      (e) => e.progress_int >= e.requirement_int && e.claimed,
    );

    if (!completed) {
      return response.status(400).json({ message: "Not completed yet" });
    }

    const groupclaimed = await objectivesQueries.isGroupClaimed(
      userId,
      objectiveId,
    );
    if (groupclaimed?.claimed) {
      return response
        .status(400)
        .json({ message: "Group reward already claimed" });
    }

    const groupRewardRows = await objectivesQueries.getGroupReward(objectiveId);
    const reward = groupRewardRows[0];

    if (reward.coins) {
      await database.updateCoins(reward.coins, userId);
    }

    if (reward.packIds) {
      await storeQueries.addPack(userId, reward.packIds);
    }

    await objectivesQueries.setGroupClaimed(userId, objectiveId);

    response.status(200).json({ message: "Group reward claimed" });
  } catch (error) {
    console.log("POST /api/objectives/claimobjgroup error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
