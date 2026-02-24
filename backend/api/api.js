const express = require("express");
const router = express.Router();
const database = require("../sql/database.js");
const fs = require("fs/promises");

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
    console.log("GET /api/randomformations error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? Players /api/players
router.get("/players", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/shortData.json"),
    );
    response.status(200).json({ players: data });
  } catch (error) {
    console.log("GET /api/players error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random player (Captains) /api/randomplayers
router.get("/randomplayers", async (request, response) => {
  try {
    const data = await readJsonFile(
      path.join(__dirname, "./files/shortData.json"),
    );

    function randomPick(arr, count) {
      const randomjatekosok = [];
      const tombIndexek = [];

      while (
        randomjatekosok.length < count &&
        randomjatekosok.length < arr.length
      ) {
        const index = Math.floor(Math.random() * arr.length);

        if (!tombIndexek.includes(index) && arr[index].overall >= 85) {
          tombIndexek.push(index);
          randomjatekosok.push(arr[index]);
        }
      }

      return randomjatekosok;
    }

    response.status(200).json({ randomjatekosok: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomplayers error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? Választott játékosok
const draftselectedPlayers = [];
router.get("/draftselectedplayers", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedplayers: draftselectedPlayers,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayers error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.post("/draftselectedplayers", async (request, response) => {
  try {
    const selectedplayer = request.body;
    draftselectedPlayers.push(selectedplayer);
    response.status(200).json({
      draftselectedplayers: draftselectedPlayers,
    });
  } catch (error) {
    console.log("POST /api/draftselectedplayers error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//!Pozíciónkénti random játékos generálás Rating Range-ekkel
router.get("/random/:pos", async (request, response) => {
  try {
    const pos = request.params.pos;
    const data = await readJsonFile(
      path.join(__dirname, "./files/shortData.json"),
    );

    function randomPick(arr, count) {
      const randomPlayers = [];
      const tombIndexek = [];
      const selectedIds = draftselectedPlayers.map((p) => p.player_id);

      const randomRatingRange = Math.floor(Math.random() * 10);

      if (randomRatingRange === 0) {
        while (
          randomPlayers.length < count &&
          randomPlayers.length < arr.length
        ) {
          const index = Math.floor(Math.random() * arr.length);

          if (
            !tombIndexek.includes(index) &&
            arr[index].overall >= 75 &&
            arr[index].overall <= 80 &&
            arr[index].player_positions.split(", ").includes(pos) &&
            !selectedIds.includes(arr[index].player_id)
          ) {
            tombIndexek.push(index);
            randomPlayers.push(arr[index]);
          }
        }
      }

      if (randomRatingRange === 1 || randomRatingRange === 2) {
        while (
          randomPlayers.length < count &&
          randomPlayers.length < arr.length
        ) {
          const index = Math.floor(Math.random() * arr.length);

          if (
            !tombIndexek.includes(index) &&
            arr[index].overall >= 81 &&
            arr[index].overall <= 85 &&
            arr[index].player_positions.split(", ").includes(pos) &&
            !selectedIds.includes(arr[index].player_id)
          ) {
            tombIndexek.push(index);
            randomPlayers.push(arr[index]);
          }
        }
      }

      if (
        randomRatingRange === 3 ||
        randomRatingRange === 4 ||
        randomRatingRange === 5 ||
        randomRatingRange === 6 ||
        //!Majd ha lesz több 90+ player vissza lehet állítani
        randomRatingRange === 7 ||
        randomRatingRange === 8 ||
        randomRatingRange === 9
      ) {
        while (
          randomPlayers.length < count &&
          randomPlayers.length < arr.length
        ) {
          const index = Math.floor(Math.random() * arr.length);

          if (
            !tombIndexek.includes(index) &&
            arr[index].overall >= 86 &&
            arr[index].overall <= 89 &&
            arr[index].player_positions.split(", ").includes(pos) &&
            !selectedIds.includes(arr[index].player_id)
          ) {
            tombIndexek.push(index);
            randomPlayers.push(arr[index]);
          }
        }
      }

      // if (
      //   randomRatingRange === 7 ||
      //   randomRatingRange === 8 ||
      //   randomRatingRange === 9
      // ) {
      //   while (
      //     randomPlayers.length < count &&
      //     randomPlayers.length < arr.length
      //   ) {
      //     const index = Math.floor(Math.random() * arr.length);

      //     if (
      //       !tombIndexek.includes(index) &&
      //       arr[index].overall >= 90 &&
      //       arr[index].player_positions.split(", ").includes(pos) &&
      //       !selectedIds.includes(arr[index].player_id)
      //     ) {
      //       tombIndexek.push(index);
      //       randomPlayers.push(arr[index]);
      //     }
      //   }
      // }

      return randomPlayers;
    }

    response.status(200).json({ randomPlayers: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/random/:pos error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
