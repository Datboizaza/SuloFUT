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

//? Objective-ek
async function getObjectives(userId) {
  const query = `
SELECT 
  objcategories.name AS category,
  objectives.id AS objective_id,
  objectives.name AS objective_name,
  COALESCE(userObjClaims.claimed, 0) AS objective_claimed,
  groupRewards.coins AS group_coins,
  groupRewardPacks.id AS group_pack_id,
  groupRewardPacks.packName AS group_pack_name,
  groupRewardPacks.packDesign AS group_pack_design,
  subobjectives.id AS sub_id,
  subobjectives.task,
  subobjectives.requirement_int,
  COALESCE(userProgress.progress_int, 0) AS progress_int,
  COALESCE(userProgress.claimed, 0) AS sub_claimed,
  subRewards.coins AS sub_coins,
  subRewardPacks.id AS sub_pack_id,
  subRewardPacks.packName AS sub_pack_name,
  subRewardPacks.packDesign AS sub_pack_design
FROM objectives
JOIN objcategories 
  ON objcategories.id = objectives.category_id
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
LEFT JOIN user_objective_claims AS userObjClaims
  ON userObjClaims.objective_id = objectives.id
  AND userObjClaims.user_id = ?
ORDER BY 
  objcategories.id,
  objectives.id,
  subobjectives.id;
`;
  try {
    const [rows] = await pool.execute(query, [userId, userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Subobjective progress eltárolása
async function updateSubobjectiveProgress(id, subId) {
  const query = `
    INSERT INTO user_subobjective_progress (user_id, subobjective_id, progress_int)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE 
      progress_int = progress_int + 1
  `;
  try {
    await pool.execute(query, [id, subId]);
  } catch (error) {
    throw error;
  }
}

//? Subobjective reward
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

//? Suboobjective claimed ellenőrzés
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

//? Subobjective reward claim-elve
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

//? Subobjective-ek objective-enként
async function getSubobjectivesByObjective(userId, objectiveId) {
  const query = `
    SELECT 
      subobjectives.id,
      subobjectives.requirement_int,
      COALESCE(user_subobjective_progress.progress_int, 0) AS progress_int,
      COALESCE(user_subobjective_progress.claimed, 0) AS claimed
    FROM subobjectives
    LEFT JOIN user_subobjective_progress 
      ON user_subobjective_progress.subobjective_id = subobjectives.id
      AND user_subobjective_progress.user_id = ?
    WHERE subobjectives.objective_id = ?
  `;
  try {
    const [rows] = await pool.execute(query, [userId, objectiveId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Group reward elclaimelésének ellenőrzése
async function isGroupClaimed(userId, objectiveId) {
  const query = `
    SELECT claimed
    FROM user_objective_claims
    WHERE user_id = ? AND objective_id = ?
  `;
  try {
    const [rows] = await pool.execute(query, [userId, objectiveId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? Group reward
async function getGroupReward(objectiveId) {
  const query = `
    SELECT 
      rewards.coins,
      rewards.packIds
    FROM objectives
    LEFT JOIN rewards ON rewards.id = objectives.group_reward
    WHERE objectives.id = ?
  `;
  try {
    const [rows] = await pool.execute(query, [objectiveId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Group reward elclaimelése
async function setGroupClaimed(userId, objectiveId) {
  const query = `
    INSERT INTO user_objective_claims (user_id, objective_id, claimed)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE claimed = 1
  `;
  try {
    const [rows] = await pool.execute(query, [userId, objectiveId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  getObjectives,
  updateSubobjectiveProgress,
  getSubobjAndRew,
  isSubobjClaimed,
  setClaimed,
  getSubobjectivesByObjective,
  isGroupClaimed,
  getGroupReward,
  setGroupClaimed,
};
