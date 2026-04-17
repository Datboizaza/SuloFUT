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

router.get("/sortBy/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const condId = request.params.condId;
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const rateASC = players.sort(
      (a, b) => Number(a.overall) - Number(b.overall),
    );
    const rateDESC = players.sort(
      (a, b) => Number(b.overall) - Number(a.overall),
    );
    const valueASC = players.sort((a, b) => Number(a.value) - Number(b.value));
    const valueDESC = players.sort((a, b) => Number(b.value) - Number(a.value));

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

router.get("/ovrRange/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const condMin = request.params.condMin;
    const condMax = request.params.condMax;
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const ovr = Number(p.overall);
      return ovr >= condMin && ovr <= condMax;
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerName/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const name = request.params.name.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const playerName =
        String(p.long_name).toLowerCase().includes(name) ||
        String(p.short_name).toLowerCase().includes(name);

      if (playerName === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerRarity/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rarity = request.params.rarity.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const rarity = String(p.rarity).toLowerCase().includes(rarity);

      if (rarity === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerRarity/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const rarity = request.params.rarity.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const rarity = String(p.rarity).toLowerCase().includes(rarity);

      if (rarity === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerPosition/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const Position = request.params.position.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }

    const condition = players.filter((p) => {
      const position =
        String(p.player_positions).toLowerCase().includes(Position) ||
        (Position === "defender" &&
          String(p.player_positions)
            .toLowerCase()
            .includes("cb" || "lb" || "rb")) ||
        (Position === "midfielder" &&
          String(p.player_positions)
            .toLowerCase()
            .includes("cdm" || "cm" || "cam" || "lm" || "rm")) ||
        (Position === "attacker" &&
          String(p.player_positions)
            .toLowerCase()
            .includes("st" || "lw" || "rw"));

      if (position === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerNationality/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const nationality = request.params.nationality.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const nationality = String(p.nationality_name)
        .toLowerCase()
        .includes(nationality);

      if (nationality === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerLeague/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const league = request.params.league.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const league = String(p.league_name).toLowerCase().includes(league);

      if (league === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/playerClub/:userId", async (request, response) => {
  try {
    const userId = request.session.userId;
    const club = request.params.club.toLowerCase();
    const rows = await myClubQueries.currentClub(userId);

    if (!rows || rows.length === 0) {
      return response.json([]);
    }

    let players = [];

    if (rows[0].userPlayers) {
      players = JSON.parse(rows[0].userPlayers);
    }
    const condition = players.filter((p) => {
      const club = String(p.club_name).toLowerCase().includes(club);

      if (club === true) {
        return p;
      }
    });
    response.status(200).json({ byFeltetel: condition });
  } catch (error) {
    console.log("GET /api/packplayers error:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
