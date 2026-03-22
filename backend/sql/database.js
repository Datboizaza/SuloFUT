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
  const query = "SELECT coinNumber FROM userClub WHERE user_id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? User Packjei
async function getUserPacksById(id) {
  const query = `
    SELECT packs.*
    FROM packs
    JOIN userPacks ON packs.id = userPacks.pack_id
    WHERE userPacks.user_id = ?
  `;
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
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
    "SELECT rewards.id AS rewardId, rewards.coins, packs.* FROM rewards LEFT JOIN packs ON rewards.packIds = packs.id WHERE rewards.id = ?;";
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getDraftRewards(rewardValue) {
  const query = `SELECT 
      dr.id AS draftRewardId,
      dr.coins,
      dr.rewardValue,
      p.id AS packId,
      p.packName,
      p.packPrice,
      p.packDesign
    FROM draftrewards dr
    LEFT JOIN draftreward_packs drp 
      ON dr.id = drp.draftreward_id
    LEFT JOIN packs p 
      ON p.id = drp.pack_id
    WHERE dr.rewardValue = ?`;
  try {
    const [rows] = await pool.execute(query, [rewardValue]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Objective-ek
async function getObjectives(id) {
  const query = `
SELECT 
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

    COALESCE(s.requirement_int) AS requirement,

    COALESCE(uop.progress_int, 0) AS progress,

    r.id AS rewardId,
    r.coins,
    p.id AS pack_id,
    p.packName AS pack_name,
    p.packPrice AS pack_price,
    p.packDesign AS pack_design

FROM objcategories c

JOIN objectives o ON o.category_id = c.id
JOIN subobjectives s ON s.objective_id = o.id

LEFT JOIN user_objective_progress uop 
  ON uop.objective_id = s.id 
  AND uop.user_id = 1

LEFT JOIN rewards r ON r.id = s.reward
LEFT JOIN packs p ON r.packIds = p.id

LEFT JOIN rewards gr ON gr.id = o.group_reward
LEFT JOIN packs grp ON gr.packIds = grp.id

ORDER BY c.name, o.id, s.id;
`;

  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateSubobjectiveProgress(id, subId) {
  const query = `
    INSERT INTO user_subobjective_progress (user_id, subobjective_id, progress_int)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE 
      progress_int = progress_int + 1
  `;

  await pool.execute(query, [id, subId]);
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
  getUserPacksById,
  updateSubobjectiveProgress,
};
