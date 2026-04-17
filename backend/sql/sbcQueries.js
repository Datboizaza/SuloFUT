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

//? Összes SBC
async function getSBC() {
  const query = `
  SELECT
    sbc.id,
    sbc.category_id,
    sbc.sbcName,
    sbc.repeat,
    sbc.rewardPack,
    sbc.rarity,
    sbc.rating,
    sbc.chemistry,
    sbc.leagues,
    sbc.sameLeague,
    sbc.nations,
    sbc.sameNation,
    sbc.sameClub,
    sbc.chemPP,
    sbc.special,
    sbc.formation,
    sbc.design,
    sbccategories.name AS name
  FROM sbc
  JOIN sbccategories ON sbccategories.id = sbc.category_id;
      `;
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? SBC id alapján
async function getSBCbyId(id) {
  const query = `
  SELECT
    sbc.id,
    sbc.category_id,
    sbc.sbcName,
    sbc.repeat,
    sbc.rewardPack,
    sbc.rarity,
    sbc.rating,
    sbc.chemistry,
    sbc.leagues,
    sbc.sameLeague,
    sbc.nations,
    sbc.sameNation,
    sbc.sameClub,
    sbc.chemPP,
    sbc.special,
    sbc.formation,
    sbc.design,
    sbccategories.name AS name
  FROM sbc
  JOIN sbccategories ON sbccategories.id = sbc.category_id
  WHERE sbc.id = ?;
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
  getSBC,
  getSBCbyId,
};
