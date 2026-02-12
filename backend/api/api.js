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
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));
    response.status(200).json({ players: data });
  } catch (error) {
    console.log("GET /api/players error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random player /api/randomplayers
router.get("/randomplayers", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

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

//!Pozíciónklnti random játékos generálás
//? 5 random GK /api/randomgk
router.get("/randomgk", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomgk = [];
      const tombIndexek = [];

      while (randomgk.length < count && randomgk.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("GK")
        ) {
          tombIndexek.push(index);
          randomgk.push(arr[index]);
        }
      }

      return randomgk;
    }

    response.status(200).json({ randomgk: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomgk error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random LB /api/randomlb
router.get("/randomlb", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomlb = [];
      const tombIndexek = [];

      while (randomlb.length < count && randomlb.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("LB")
        ) {
          tombIndexek.push(index);
          randomlb.push(arr[index]);
        }
      }

      return randomlb;
    }

    response.status(200).json({ randomlb: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomlb error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random CB /api/randomcb
router.get("/randomcb", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomcb = [];
      const tombIndexek = [];

      while (randomcb.length < count && randomcb.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("CB")
        ) {
          tombIndexek.push(index);
          randomcb.push(arr[index]);
        }
      }

      return randomcb;
    }

    response.status(200).json({ randomcb: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomcb error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random RB /api/randomrb
router.get("/randomrb", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomrb = [];
      const tombIndexek = [];

      while (randomrb.length < count && randomrb.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("RB")
        ) {
          tombIndexek.push(index);
          randomrb.push(arr[index]);
        }
      }

      return randomrb;
    }

    response.status(200).json({ randomrb: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomrb error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random CDM /api/randomcdm
router.get("/randomcdm", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomcdm = [];
      const tombIndexek = [];

      while (randomcdm.length < count && randomcdm.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("CDM")
        ) {
          tombIndexek.push(index);
          randomcdm.push(arr[index]);
        }
      }

      return randomcdm;
    }

    response.status(200).json({ randomcdm: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomcdm error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random CM /api/randomcm
router.get("/randomcm", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomcm = [];
      const tombIndexek = [];

      while (randomcm.length < count && randomcm.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("CM")
        ) {
          tombIndexek.push(index);
          randomcm.push(arr[index]);
        }
      }

      return randomcm;
    }

    response.status(200).json({ randomcm: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomcm error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random CAM /api/randomcam
router.get("/randomcam", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomcam = [];
      const tombIndexek = [];

      while (randomcam.length < count && randomcam.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("CAM")
        ) {
          tombIndexek.push(index);
          randomcam.push(arr[index]);
        }
      }

      return randomcam;
    }

    response.status(200).json({ randomcam: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomcam error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random LM /api/randomlm
router.get("/randomlm", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomlm = [];
      const tombIndexek = [];

      while (randomlm.length < count && randomlm.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("LM")
        ) {
          tombIndexek.push(index);
          randomlm.push(arr[index]);
        }
      }

      return randomlm;
    }

    response.status(200).json({ randomlm: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomlm error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random RM /api/randomrm
router.get("/randomrm", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomrm = [];
      const tombIndexek = [];

      while (randomrm.length < count && randomrm.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("RM")
        ) {
          tombIndexek.push(index);
          randomrm.push(arr[index]);
        }
      }

      return randomrm;
    }

    response.status(200).json({ randomrm: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomrm error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random LW /api/randomlw
router.get("/randomlw", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomlw = [];
      const tombIndexek = [];

      while (randomlw.length < count && randomlw.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("LW")
        ) {
          tombIndexek.push(index);
          randomlw.push(arr[index]);
        }
      }

      return randomlw;
    }

    response.status(200).json({ randomlw: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomlw error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random RW /api/randomrw
router.get("/randomrw", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomrw = [];
      const tombIndexek = [];

      while (randomrw.length < count && randomrw.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("RW")
        ) {
          tombIndexek.push(index);
          randomrw.push(arr[index]);
        }
      }

      return randomrw;
    }

    response.status(200).json({ randomrw: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomrw error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

//? 5 random ST /api/randomst
router.get("/randomst", async (request, response) => {
  try {
    const data = await readJsonFile(path.join(__dirname, "./files/data.json"));

    function randomPick(arr, count) {
      const randomst = [];
      const tombIndexek = [];

      while (randomst.length < count && randomst.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);

        if (
          !tombIndexek.includes(index) &&
          arr[index].overall >= 75 &&
          arr[index].player_positions.split(", ").includes("ST")
        ) {
          tombIndexek.push(index);
          randomst.push(arr[index]);
        }
      }

      return randomst;
    }

    response.status(200).json({ randomst: randomPick(data, 5) });
  } catch (error) {
    console.log("GET /api/randomst error:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
