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

//? Rewardok id szerint
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

//? Draft rewardok value szerint
async function getDraftRewards(rewardValue) {
  const query = `SELECT 
  draftrewards.id AS draftRewardId,
  draftrewards.coins,
  draftrewards.rewardValue,
  packs.id AS packId,
  packs.packName,
  packs.packPrice,
  packs.packDesign
FROM (
  SELECT id
  FROM draftrewards
  WHERE rewardValue = ?
  ORDER BY RAND()
  LIMIT 1
) AS randomDraftReward
JOIN draftrewards
  ON draftrewards.id = randomDraftReward.id
LEFT JOIN draftreward_packs 
  ON draftrewards.id = draftreward_packs.draftreward_id
LEFT JOIN packs 
  ON packs.id = draftreward_packs.pack_id;`;
  try {
    const [rows] = await pool.execute(query, [rewardValue]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Draft rewardok id szerint
async function getDraftRewardById(id) {
  const query = `
  SELECT 
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
    WHERE draftrewards.id = ?
  `;
  try {
    const [rows] = await pool.execute(query, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  getRewardById,
  getDraftRewards,
  getDraftRewardById,
};
