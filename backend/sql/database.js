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

//!SQL Queries
//? Összes user
async function selectall() {
  const query = "SELECT * FROM users;";
  const [rows] = await pool.execute(query);
  return rows;
}

//? Regisztráció
async function insertinto(username, password) {
  const query = "INSERT INTO users(username, password) VALUES(?, ?);";
  try {
    const [rows] = await pool.execute(query, [username, password]);
    return rows.insertId;
  } catch (error) {
    throw error;
  }
}

//? Login
async function login(username) {
  const query = "SELECT * FROM users WHERE username = ?";
  try {
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? User by id
async function getUserById(id) {
  const query = "SELECT id, username FROM users WHERE id = ?";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? User Coin száma
async function getUserCoinsById(id) {
  const query = "SELECT coinNumber FROM coins WHERE user_id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? User legjobb draft update
async function updateBestDraftById(actualDraft, id) {
  const query =
    "UPDATE stats SET best_draft = IF(best_draft < ?, ?, best_draft) WHERE user_id = ?;";
  try {
    const [rows] = await pool.execute(query, [actualDraft, actualDraft, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Pack adatai
async function getPackById(id) {
  const query = "SELECT * FROM packs WHERE id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Rewardok
async function getRewardById(id) {
  const query =
    "SELECT rewards.id AS rewardId, rewards.coins, packs.* FROM rewards LEFT JOIN packs ON rewards.packIds IS NOT NULL AND FIND_IN_SET(packs.id, rewards.packIds) > 0 WHERE rewards.id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getDraftRewards() {
  const query =
    "SELECT draftrewards.id AS draftRewardId, draftrewards.coins, draftrewards.rewardValue, packs.* FROM draftrewards LEFT JOIN packs ON draftrewards.packIds IS NOT NULL AND FIND_IN_SET(packs.id, draftrewards.packIds) > 0";
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getObjectives() {
  const query = `SELECT 
    c.name AS category,
    
    o.id AS objective_id,
    o.name AS objective_name,

    gr.id AS groupRewardId,
    gr.coins AS group_coins,
    grp.id AS group_pack_id,
    grp.packName AS group_pack_name,
    grp.packPrice AS group_pack_price,
    grp.packDesign AS group_pack_design,

    s.id AS sub_id,
    s.task,

    COALESCE(s.requirement_int, s.requirement_bool) AS requirement,

    r.id AS rewardId,
    r.coins,
    p.id AS pack_id,
    p.packName AS pack_name,
    p.packPrice AS pack_price,
    p.packDesign AS pack_design,

    COALESCE(s.progress_int, s.progress_bool) AS progress

FROM objcategories c

JOIN objectives o ON o.category_id = c.id
JOIN subobjectives s ON s.objective_id = o.id

-- sub reward
LEFT JOIN rewards r ON r.id = s.reward
LEFT JOIN packs p 
    ON r.packIds IS NOT NULL 
    AND FIND_IN_SET(p.id, r.packIds) > 0

-- group reward
LEFT JOIN rewards gr ON gr.id = o.group_reward
LEFT JOIN packs grp 
    ON gr.packIds IS NOT NULL 
    AND FIND_IN_SET(grp.id, gr.packIds) > 0

ORDER BY c.name, o.id, s.id;`;
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  selectall,
  insertinto,
  login,
  getUserById,
  getUserCoinsById,
  updateBestDraftById,
  getPackById,
  getRewardById,
  getDraftRewards,
  getObjectives,
};
