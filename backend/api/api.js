const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

//!PRÓBA 
const readJsonFile = async (filePath) => { try { const raw = await fs.readFile(filePath, "utf-8"); return JSON.parse(raw); // JS objektum/tömb } catch (error) { throw new Error(`Olvasási hiba (json): ${error.message}`); } }; router.get("/players", async (request, response) => { try { const data = await readJsonFile("../backend/api/files/data.json"); response.status(200).json({ data: data }); } catch (error) { console.log("GET /api/players error:", error); response.status(500).json({ error: "Internal server error" }); } });

module.exports = router;
