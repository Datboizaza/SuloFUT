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
    response.status(500).json({
      message: "Ez a végpont nem működik.",
    });
  }
});

router.post("/users/login", async (request, response) => {
  try {
    const user = await database.login(request.body.username);

    if (!user)
      return response.status(400).json({ message: "Invalid username" });

    const valid = await bcrypt.compare(request.body.password, user.password);

    if (!valid) return response.status(400).json({ message: "Wrong password" });

    request.session.userId = user.id;

    response.status(200).json({ message: "Logged in" });
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
});

//!
router.get("/users/me", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const user = await database.getUserById(request.session.userId);
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
});

//? Json fájl beolvasása
const readJsonFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw); // JS objektum/tömb
  } catch (error) {
    throw new Error(`Olvasási hiba (json): ${error.message}`);
  }
};

//? Formációk /api/formations
router.get("/formations", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/formations.json"),
    );
    response.status(200).json({ formations: data });
  } catch (error) {
    console.log("GET /api/formations error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random formáció /api/randomformations
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
    console.log("GET /api/formations error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
