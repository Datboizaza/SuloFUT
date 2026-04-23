const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Csakapilis1",
  database: "sulofut",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//? User játékosai
async function currentClub(userId) {
  const query = `
  SELECT userPlayers FROM userclub WHERE user_id = ?;`;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? User játékosainak update-elése
async function updateClub(userPlayers, userId) {
  const query = `
  UPDATE userclub SET userPlayers = ? WHERE user_id = ?;`;
  try {
    const [rows] = await pool.execute(query, [
      JSON.stringify(userPlayers),
      userId,
    ]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? User squad
async function getSquad(userId) {
  const query = `
  SELECT squadName, squadFormation, squadPlayers
  FROM userclub
  WHERE user_id = ?`;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Update squad name
async function updateSquadName(squadName, userId) {
  const query = `
  UPDATE userclub SET squadName = ? WHERE user_id = ?`;
  try {
    const [rows] = await pool.execute(query, [squadName, userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Update formation
async function updateFormation(formation, userId) {
  const query = `
  UPDATE userclub SET squadFormation = ? WHERE user_id = ?`;
  try {
    const [rows] = await pool.execute(query, [formation, userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//? Update squad players
async function updateSquadPlayers(players, userId) {
  const query = `UPDATE userclub SET squadPlayers = ? WHERE user_id = ?`;
  try {
    const [rows] = await pool.execute(query, [JSON.stringify(players), userId]);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  currentClub,
  updateClub,
  getSquad,
  updateSquadName,
  updateFormation,
  updateSquadPlayers,
};
