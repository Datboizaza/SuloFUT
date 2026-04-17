const express = require("express");
const router = express.Router();
const sbcQueries = require("../sql/sbcQueries.js");
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

//! SBC-k
router.get("/allsbc", async (request, response) => {
  try {
    const rows = await sbcQueries.getSBC();

    const result = {
      challenges: [],
      upgrades: [],
      foundations: [],
    };

    rows.forEach((row) => {
      const sbcData = {};
      Object.keys(row).forEach((key) => {
        const value = row[key];
        if (value !== null && key !== "name") {
          sbcData[key] = value;
        }
      });

      const category = row.name.toLowerCase();
      if (result[category]) {
        result[category].push({
          sbcData,
        });
      }
    });

    response.status(200).json({ results: result });
  } catch (error) {
    console.log("GET /api/allsbc error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
