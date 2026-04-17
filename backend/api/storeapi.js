const express = require("express");
const router = express.Router();
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

//! Pack player generálás
router.get("/generatePack/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const packWeights = await storeQueries.getallWeightData(id);
    const packData = await storeQueries.getPackDetails(id);
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

//!Store pack-ek
router.get("/storepacks", async (request, response) => {
  try {
    const packs = await storeQueries.getStorePacks();
    response.status(200).json(packs);
  } catch (error) {
    console.log("GET /storepacks error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Kinyitott my pack törlése
router.post("/deletemypack", async (request, response) => {
  try {
    const userId = request.session.userId;
    const packId = request.body.packId;

    await storeQueries.deleteMyPack(userId, packId);

    response.status(200).json({ message: "Pack deleted from user" });
  } catch (error) {
    console.log("POST /api/deletemypack error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
