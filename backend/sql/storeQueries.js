const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "sulofut",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//? Pack id szerint
async function getPackById(id) {
  const query = "SELECT * FROM packs WHERE id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Pack name szerint
async function getPackByName(name) {
  const query = "SELECT * FROM packs WHERE packName = ?";
  try {
    const [rows] = await pool.execute(query, [name]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Pack hozzáadása a user-hez
async function addPack(userId, packId) {
  const query = `
        INSERT INTO userpacks (user_id, pack_id)
        VALUES (?, ?)
  `;

  try {
    const [rows] = await pool.execute(query, [userId, packId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Packek
async function getPackOptions() {
  const query = "SELECT * FROM packs";
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Pack játékosszámának és játékos rarity-jeinl lekérése id szerint
async function getPackDetails(id) {
  const query = "SELECT playerCount, playerQuality FROM packs WHERE id = ?";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? Pack weight id szerint
async function getallWeightData(id) {
  const query =
    "SELECT packWeights.bronzeWeight, packWeights.silverWeight, packWeights.goldWeight, packWeights.flashbackWeight, packWeights.screamWeight, packWeights.totyWeight, packWeights.iconWeight, packWeights.heroWeight FROM packWeights JOIN packs ON packWeights.id = packs.packWeightID WHERE packs.id = ?";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? Store packjei
async function getStorePacks() {
  const query = `
    SELECT * FROM packs 
    WHERE packName IN (
      'Bronze Pack',
      'Silver Pack',
      'Gold Pack',
      'Jumbo Gold Pack',
      'Mixed Players Pack',
      'Mega Pack',
      'Icon Pack',
      'Hero Pack',
      'TOTY Grind Pack'
    )`;
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? User pack kinyitás esetén törlés
async function deleteMyPack(userId, packId) {
  const query = `
  DELETE FROM userpacks 
  WHERE user_id = ? AND pack_id = ? 
  LIMIT 1`;
  try {
    const [rows] = await pool.execute(query, [userId, packId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  getPackById,
  addPack,
  getPackOptions,
  getPackDetails,
  getallWeightData,
  getStorePacks,
  deleteMyPack,
  getPackByName,
};
