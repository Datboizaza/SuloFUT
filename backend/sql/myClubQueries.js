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

//!Export
module.exports = {
  currentClub,
  updateClub,
};
