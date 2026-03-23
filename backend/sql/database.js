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
      draftrewards.id AS draftRewardId,
      draftrewards.coins,
      draftrewards.rewardValue,
      packs.id AS packId,
      packs.packName,
      packs.packPrice,
      packs.packDesign
    FROM draftrewards
    LEFT JOIN draftreward_packs 
      ON draftrewards.id = draftreward_packs.draftreward_id
    LEFT JOIN packs 
      ON packs.id = draftreward_packs.pack_id
    WHERE draftrewards.rewardValue = ?`;
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
    objcategories.name AS category,
    
    objectives.id AS objective_id,
    objectives.name AS objective_name,

    groupRewards.id AS groupRewardId,
    groupRewards.coins AS group_coins,
    groupRewardPacks.id AS group_pack_id,
    groupRewardPacks.packName AS group_pack_name,
    groupRewardPacks.packPrice AS group_pack_price,
    groupRewardPacks.packDesign AS group_pack_design,

    subobjectives.id AS sub_id,
    subobjectives.task,

    COALESCE(subobjectives.requirement_int, 0) AS requirement,

    COALESCE(userProgress.progress_int, 0) AS progress,

    COALESCE(userProgress.claimed, FALSE) AS claimed,

    subRewards.id AS rewardId,
    subRewards.coins,
    subRewardPacks.id AS pack_id,
    subRewardPacks.packName AS pack_name,
    subRewardPacks.packPrice AS pack_price,
    subRewardPacks.packDesign AS pack_design

FROM objcategories

JOIN objectives 
  ON objectives.category_id = objcategories.id

JOIN subobjectives 
  ON subobjectives.objective_id = objectives.id

LEFT JOIN user_subobjective_progress AS userProgress
  ON userProgress.subobjective_id = subobjectives.id 
  AND userProgress.user_id = ?

LEFT JOIN rewards AS subRewards 
  ON subRewards.id = subobjectives.reward

LEFT JOIN packs AS subRewardPacks 
  ON subRewardPacks.id = subRewards.packIds

LEFT JOIN rewards AS groupRewards 
  ON groupRewards.id = objectives.group_reward

LEFT JOIN packs AS groupRewardPacks 
  ON groupRewardPacks.id = groupRewards.packIds

ORDER BY 
  objcategories.name, 
  objectives.id, 
  subobjectives.id;
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

async function getSubobjAndRew(subId) {
  const query = `
    SELECT 
        subobjectives.id,
        subobjectives.reward,
        rewards.coins,
        rewards.packIds
      FROM subobjectives
      LEFT JOIN rewards ON rewards.id = subobjectives.reward
      WHERE subobjectives.id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [subId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function isSubobjClaimed(userId, subId) {
  const query = `
    SELECT claimed, progress_int, subobjectives.requirement_int
      FROM user_subobjective_progress
      JOIN subobjectives ON subobjectives.id = user_subobjective_progress.subobjective_id
      WHERE user_subobjective_progress.user_id = ? AND user_subobjective_progress.subobjective_id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [userId, subId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateCoins(coins, userId) {
  const query = `
        UPDATE userclub 
        SET coinNumber = coinNumber + ?
        WHERE user_id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [coins, userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

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

async function setClaimed(userId, subId) {
  const query = `
      UPDATE user_subobjective_progress
      SET claimed = TRUE
      WHERE user_id = ? AND subobjective_id = ?
  `;

  try {
    const [rows] = await pool.execute(query, [userId, subId]);
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
  getUserPacksById,
  updateSubobjectiveProgress,
  getSubobjAndRew,
  isSubobjClaimed,
  updateCoins,
  addPack,
  setClaimed,
};
