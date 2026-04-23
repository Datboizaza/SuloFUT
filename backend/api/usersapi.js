const express = require("express");
const router = express.Router();
const usersQueries = require("../sql/usersQueries.js");
const objectivesQueries = require("../sql/objectivesQueries.js");
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

//! User-ek
router.get("/", async (request, response) => {
  try {
    const users = await usersQueries.selectall();
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

//! Regisztráció
router.post("/", async (request, response) => {
  try {
    const hashed = await bcrypt.hash(request.body.password, 10);
    const insertinto = await usersQueries.insertinto(
      request.body.username,
      hashed,
    );
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

//! Login
router.post("/login", async (request, response) => {
  try {
    const user = await usersQueries.login(request.body.username);

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

//! Bejelentkezett user adatai
router.get("/me", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const user = await usersQueries.getUserById(request.session.userId);
    response.status(200).json(user);
  } catch (error) {
    console.log("GET /users/me error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Bejelentkezett user coinja
router.get("/me/coins", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const coins = await usersQueries.getUserCoinsById(request.session.userId);
    response.status(200).json(coins);
  } catch (error) {
    console.log("GET /users/me/coins error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Bejelentkezett user packjei
router.get("/me/packs", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const packs = await usersQueries.getUserPacksById(request.session.userId);
    response.status(200).json(packs);
  } catch (error) {
    console.log("GET /users/me/packs error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Bejelentkezett user legjobb draftja
router.post("/me/bestdraft", async (request, response) => {
  try {
    const rating = request.body.rating;
    const result = await usersQueries.updateBestDraftById(
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

//! Bejelentkezett user objective progress-e
router.post("/me/objectiveprogress", async (request, response) => {
  try {
    const subId = request.body.subId;
    const userId = request.session.userId;

    if (!userId) {
      return response.status(401).json({ message: "Not logged in" });
    }

    await objectivesQueries.updateSubobjectiveProgress(userId, subId);

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

//! Username megváltoztatása
router.post("/changeusername", async (request, response) => {
  try {
    const userId = request.session.userId;
    const newUsername = request.body.username;

    await usersQueries.changeUsername(newUsername, userId);

    response.status(200).json({ message: "Username changed successfully" });
  } catch (error) {
    console.log("POST /users/changeusername error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Jelszó megváltoztatása
router.post("/changepassword", async (request, response) => {
  try {
    const userId = request.session.userId;
    const hashed = await bcrypt.hash(request.body.password, 10);

    await usersQueries.changePassword(hashed, userId);

    response.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("POST /users/changepassword error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

//! Kijelentkezés
router.post("/logout", async (request, response) => {
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

//! Bejelentkezett user törlése
router.post("/delete", async (request, response) => {
  try {
    const userId = request.session.userId;

    await usersQueries.deleteUser(userId);
    await usersQueries.deleteUserPacks(userId);
    await usersQueries.deleteUserObjClaims(userId);
    await usersQueries.deleteUserSubobjProg(userId);
    await usersQueries.deleteUserClub(userId);
    await usersQueries.deleteUserStats(userId);
    await usersQueries.deleteUserSbc(userId);

    request.session.destroy(() => {
      response.clearCookie("connect.sid");
      response.status(200).json({ message: "User deleted" });
    });
  } catch (error) {
    console.log("POST /users/delete error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
