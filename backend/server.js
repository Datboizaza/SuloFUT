//!Module-ok importálása
const express = require("express"); //?npm install express
const session = require("express-session"); //?npm install express-session
const path = require("path");
const cors = require("cors");

//!Beállítások
const app = express();
const router = express.Router();

const ip = "127.0.0.1";
const port = 3000;
app.use(
  cors({
    origin: "http://127.0.0.1:3001",
    credentials: true,
  }),
);

app.use(express.json()); //?Middleware JSON
app.set("trust proxy", 1); //?Middleware Proxy

//!Session beállítása:
app.use(
  session({
    secret: "titkos_kulcs", //?Ezt generálni kell a későbbiekben
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

//!Routing
//?Főoldal:
router.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../frontend/szerver.html"));
});

//!API endpoints
app.use("/", router);
const endpoints = require("./api/api.js");
app.use("/api", endpoints);
const userEndpoints = require("./api/usersapi.js");
app.use("/api/users", userEndpoints);
const draftEndpoints = require("./api/draftapi.js");
app.use("/api/draft", draftEndpoints);
const rewardEndpoints = require("./api/rewardsapi.js");
app.use("/api/rewards", rewardEndpoints);
const objectiveEndpoints = require("./api/objectivesapi.js");
app.use("/api/objectives", objectiveEndpoints);
const leaderboardEndpoints = require("./api/leaderboardapi.js");
app.use("/api/leaderboard", leaderboardEndpoints);
const storeEndpoints = require("./api/storeapi.js");
app.use("/api/store", storeEndpoints);
const sbcEndpoints = require("./api/sbcapi.js");
app.use("/api/sbc", sbcEndpoints);
const myClubEndpoints = require("./api/myclubapi.js");
app.use("/api/myclub", myClubEndpoints);

//!Szerver futtatása
app.use(express.static(path.join(__dirname, "../frontend"))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
  console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
