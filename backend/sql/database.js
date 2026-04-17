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

//!Egyéb lekérdezések

//? User coin update
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

//? Leaderboard
async function getLeaderboard(type) {
  const query = `
    SELECT 
      users.username,
      stats.${type} AS points
    FROM stats
    JOIN users ON users.id = stats.user_id
    ORDER BY stats.${type} DESC
  `;

  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  updateCoins,
  getLeaderboard,
};
