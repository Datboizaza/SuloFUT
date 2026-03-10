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
    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({
        message: "This username is taken",
      });
    }
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

    if (!valid) return response.status(403).json({ message: "Wrong password" });

    request.session.userId = user.id;

    response.status(200).json({ message: "Logged in" });
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
});

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

//! User statok
router.get("/users/me/coins", async (request, response) => {
  try {
    if (!request.session.userId)
      return response.status(400).json({ message: "Hiba történt." });
    const coins = await database.getUserCoinsById(request.session.userId);
    response.status(200).json(coins);
  } catch (error) {
    response.status(500).json({ message: "Internal server error" });
  }
});

router.post("/users/me/bestdraft", async (request, response) => {
  try {
    const rating = request.body.rating;
    const result = await database.updateBestDraftById(
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

//! Json fájl beolvasása
const readJsonFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw); // JS objektum/tömb
  } catch (error) {
    throw new Error(`Olvasási hiba (json): ${error.message}`);
  }
};

//! Formációk /api/formations
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

//! 5 random formáció /api/randomformations
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

let currentStarting11SlotPos = [];
const subsSlotPos = ["GK", "DEF", "DEF", "MID", "MID", "ATT", "ATT"];
const resSlotPos = ["ANY", "ANY", "ANY", "ANY", "ANY"];
//! kiválasztott formáció pozíciói
router.post("/draft/formation", async (request, response) => {
  try {
    const { slotPosList } = request.body;
    currentStarting11SlotPos = slotPosList;
    return response.status(200).json({ message: true });
  } catch (error) {
    return response.status(500).json({ error: "Internal server error" });
  }
});

//! Players /api/players
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

//! 5 random player (Captains) /api/randomplayers
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

//! Választott játékosok
let draftselectedPlayers = [];
let draftselectedPlayers11 = [];
let draftselectedPlayersSubs = [];
let draftselectedPlayersRes = [];
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

router.get("/draftselectedplayers11", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedplayers11: draftselectedPlayers11,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayers11 error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/draftselectedplayersSubs", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedPlayersSubs: draftselectedPlayersSubs,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayersSubs error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/draftselectedplayersRes", async (request, response) => {
  try {
    response.status(200).json({
      draftselectedPlayersRes: draftselectedPlayersRes,
    });
  } catch (error) {
    console.log("GET /api/draftselectedplayersRes error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.post("/draftselectedplayers", async (request, response) => {
  try {
    const selectedplayer = request.body;

    draftselectedPlayers.push(selectedplayer);

    if (selectedplayer.starting11 === true) {
      draftselectedPlayers11.push(selectedplayer);
    } else if (
      selectedplayer.starting11 === false &&
      selectedplayer.resIndex === false
    ) {
      draftselectedPlayersSubs.push(selectedplayer);
    } else {
      draftselectedPlayersRes.push(selectedplayer);
    }

    response.status(200).json({
      draftselectedplayers: draftselectedPlayers,
      draftselectedPlayers11: draftselectedPlayers11,
      draftselectedPlayersSubs: draftselectedPlayersSubs,
      draftselectedPlayersRes: draftselectedPlayersRes,
    });
  } catch (error) {
    console.log("POST /api/draftselectedplayers error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/draftselectedplayers", (request, response) => {
  try {
    draftselectedPlayers = [];
    draftselectedPlayers11 = [];
    draftselectedPlayersSubs = [];
    draftselectedPlayersRes = [];
    currentStarting11SlotPos = [];

    response.status(200).json({ message: "Successful draft reset" });
  } catch (error) {
    console.log("DELETE /api/draftselectedplayers error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/draftselectedplayers11", (request, response) => {
  try {
    draftselectedPlayers11 = [];
    draftselectedPlayersSubs = [];

    response.status(200).json({ message: "Successful" });
  } catch (error) {
    console.log("DELETE /api/draftselectedplayers11 error:", error);
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

    let randomPick;

    if (pos === "DEF") {
      randomPick = function (arr, count) {
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
              (arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("RB")) &&
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
              (arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("RB")) &&
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
              (arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("RB")) &&
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
        //       (arr[index].player_positions.split(", ").includes("LB") ||
        // arr[index].player_positions.split(", ").includes("CB") ||
        // arr[index].player_positions.split(", ").includes("RB")) &&
        //       !selectedIds.includes(arr[index].player_id)
        //     ) {
        //       tombIndexek.push(index);
        //       randomPlayers.push(arr[index]);
        //     }
        //   }
        // }

        return randomPlayers;
      };
    } else if (pos === "MID") {
      randomPick = function (arr, count) {
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
              (arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CAM")) &&
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
              (arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CAM")) &&
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
              (arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CAM")) &&
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
        //       (arr[index].player_positions.split(", ").includes("LM") ||
        // arr[index].player_positions.split(", ").includes("RM") ||
        // arr[index].player_positions.split(", ").includes("CM") || arr[index].player_positions.split(", ").includes("CDM") || arr[index].player_positions.split(", ").includes("CAM") ||) &&
        //       !selectedIds.includes(arr[index].player_id)
        //     ) {
        //       tombIndexek.push(index);
        //       randomPlayers.push(arr[index]);
        //     }
        //   }
        // }

        return randomPlayers;
      };
    } else if (pos === "ATT") {
      randomPick = function (arr, count) {
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST")) &&
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST")) &&
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST")) &&
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
        //       (arr[index].player_positions.split(", ").includes("LW") ||
        // arr[index].player_positions.split(", ").includes("RW") ||
        // arr[index].player_positions.split(", ").includes("ST")) &&
        //       !selectedIds.includes(arr[index].player_id)
        //     ) {
        //       tombIndexek.push(index);
        //       randomPlayers.push(arr[index]);
        //     }
        //   }
        // }

        return randomPlayers;
      };
    } else if (pos === "ANY") {
      randomPick = function (arr, count) {
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST") ||
                arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CAM") ||
                arr[index].player_positions.split(", ").includes("RB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("GK")) &&
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST") ||
                arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CAM") ||
                arr[index].player_positions.split(", ").includes("RB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("GK")) &&
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
              (arr[index].player_positions.split(", ").includes("LW") ||
                arr[index].player_positions.split(", ").includes("RW") ||
                arr[index].player_positions.split(", ").includes("ST") ||
                arr[index].player_positions.split(", ").includes("LM") ||
                arr[index].player_positions.split(", ").includes("RM") ||
                arr[index].player_positions.split(", ").includes("CDM") ||
                arr[index].player_positions.split(", ").includes("CM") ||
                arr[index].player_positions.split(", ").includes("CAM") ||
                arr[index].player_positions.split(", ").includes("RB") ||
                arr[index].player_positions.split(", ").includes("CB") ||
                arr[index].player_positions.split(", ").includes("LB") ||
                arr[index].player_positions.split(", ").includes("GK")) &&
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
        ////!ÍRD ÁT MAJD
        //       (arr[index].player_positions.split(", ").includes("LW") ||
        // arr[index].player_positions.split(", ").includes("RW") ||
        // arr[index].player_positions.split(", ").includes("ST")) &&
        //       !selectedIds.includes(arr[index].player_id)
        //     ) {
        //       tombIndexek.push(index);
        //       randomPlayers.push(arr[index]);
        //     }
        //   }
        // }

        return randomPlayers;
      };
    } else {
      randomPick = function (arr, count) {
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
      };
    }

    return response.status(200).json({ randomPlayers: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/random/:pos error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//! Chemistry kiszámolása
router.get("/chemistry", async (request, response) => {
  try {
    function chemFromClubCount(count) {
      if (count >= 7) return 3;
      if (count >= 4) return 2;
      if (count >= 2) return 1;
      return 0;
    }

    function chemFromCountryCount(count) {
      if (count >= 8) return 3;
      if (count >= 5) return 2;
      if (count >= 2) return 1;
      return 0;
    }
    function chemFromLeagueCount(count) {
      if (count >= 8) return 3;
      if (count >= 5) return 2;
      if (count >= 3) return 1;
      return 0;
    }

    function inPosition(player) {
      const slotPos = player.slotPos;
      const positions = player.player_positions.split(", ");
      if (!slotPos || slotPos === "ANY") return true;

      if (slotPos === "DEF")
        return positions.some((p) => ["LB", "CB", "RB"].includes(p));
      if (slotPos === "MID")
        return positions.some((p) =>
          ["CDM", "CM", "CAM", "LM", "RM"].includes(p),
        );
      if (slotPos === "ATT")
        return positions.some((p) => ["ST", "LW", "RW"].includes(p));

      return positions.includes(slotPos);
    }

    function calculateChemistry(players) {
      const activePlayers = players.filter((p) => p && inPosition(p));

      const nationCount = {};
      const leagueCount = {};
      const clubCount = {};

      // számlálás
      activePlayers.forEach((p) => {
        if (!nationCount[p.nationality_name]) {
          nationCount[p.nationality_name] = 1;
        } else {
          nationCount[p.nationality_name]++;
        }
        if (!leagueCount[p.league_name]) {
          leagueCount[p.league_name] = 1;
        } else {
          leagueCount[p.league_name]++;
        }
        if (!clubCount[p.club_name]) {
          clubCount[p.club_name] = 1;
        } else {
          clubCount[p.club_name]++;
        }
      });

      // chemistry kiszámítás
      return players.map((player) => {
        if (!player) return null;

        if (!inPosition(player)) {
          return {
            player_id: player.player_id,
            chemistry: 0,
            inPosition: false,
          };
        }

        let chemistry = 0;
        chemistry += chemFromCountryCount(
          nationCount[player.nationality_name] || 0,
        );
        chemistry += chemFromLeagueCount(leagueCount[player.league_name] || 0);
        chemistry += chemFromClubCount(clubCount[player.club_name] || 0);

        if (chemistry > 3) {
          chemistry = 3;
        }

        return {
          player_id: player.player_id,
          chemistry,
          inPosition: true,
        };
      });
    }

    const team = draftselectedPlayers11;

    const teamWithChemistry = calculateChemistry(team);

    response.status(200).json({
      teamChemistry: teamWithChemistry.reduce((sum, p) => sum + p.chemistry, 0),
      players: teamWithChemistry,
    });
  } catch (error) {
    console.log("GET /api/chemistry error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//! Rating kiszámolása
router.get("/rating", async (request, response) => {
  try {
    const starting11players = await draftselectedPlayers11;
    const subplayers = await draftselectedPlayersSubs;

    if (starting11players.length === 0) {
      return response.json({ rating: 0 });
    }

    const starting11ratings = starting11players.map((p) => Number(p.overall));
    const subratings = subplayers.map((p) => Number(p.overall));

    let starting11ratingsSum = 0;
    for (let i = 0; i < starting11ratings.length; i++) {
      starting11ratingsSum += starting11ratings[i];
    }

    let subratingsSum = 0;
    for (let i = 0; i < subratings.length; i++) {
      subratingsSum += subratings[i];
    }
    const subavg = Math.round(subratingsSum / 7);

    const correctedSum = starting11ratingsSum + subavg;

    const correctedSumAvg = correctedSum / 12;

    const finalRating = Math.round(correctedSumAvg);

    response.status(200).json({
      rating: finalRating,
    });
  } catch (error) {
    console.log("GET /api/rating error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//! Játékosok Swap-olása
router.put("/swap", (request, response) => {
  try {
    const { aId, bId, aSlotPos, bSlotPos } = request.body;

    const arrays = {
      starting11: draftselectedPlayers11,
      subs: draftselectedPlayersSubs,
      res: draftselectedPlayersRes,
    };

    const findPlayer = (playerId) => {
      for (const [name, arr] of Object.entries(arrays)) {
        const idx = arr.findIndex(
          (p) => String(p.player_id) === String(playerId),
        );
        if (idx !== -1) return { name, arr, idx };
      }
      return null;
    };

    const A = findPlayer(aId);
    const B = findPlayer(bId);

    const temp = A.arr[A.idx];
    A.arr[A.idx] = B.arr[B.idx];
    B.arr[B.idx] = temp;

    if (A.arr[A.idx]) A.arr[A.idx].slotPos = aSlotPos;
    if (B.arr[B.idx]) B.arr[B.idx].slotPos = bSlotPos;

    return response.json({ ok: true });
  } catch (error) {
    console.log("PUT /api/swap error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
