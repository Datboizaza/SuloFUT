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

//! Promo hozzáadása
router.post(
  "/admin/addpromo",
  upload.single("image"),
  async (request, response) => {
    try {
      if (!request.session.adminId) {
        return response.status(400).json({ message: "Not admin" });
      }

      const playerData = JSON.parse(request.body.playerData);
      const uploadDir = path.join(__dirname, "../uploads");

      if (request.file) {
        const fileName = Date.now() + ".png";
        const newPath = path.join(uploadDir, fileName);
        await fs.rename(request.file.path, newPath);
        playerData.card_design_url = `http://127.0.0.1:3000/uploads/${fileName}`;
      }

      const filePath = path.join(__dirname, "../api/files/players.json");
      const fileData = await fs.readFile(filePath, "utf-8");
      const json = JSON.parse(fileData);

      json.push(playerData);
      await fs.writeFile(filePath, JSON.stringify(json, null, 2));
      response.status(200).json({ message: "success" });
    } catch (error) {
      console.log("POST /admin/addpromo error:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
);

module.exports = router;
