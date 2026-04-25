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

//? User játékosainak update-elése
async function updateClub(userPlayers, userId) {
  const query = `UPDATE userclub SET userPlayers = ? WHERE user_id = ?;`;
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

//? Club és squad törlése
async function removePlayersEverywhere(userId, playerIds) {
  try {
    const [rows] = await pool.execute(
      "SELECT userPlayers, squadPlayers FROM userclub WHERE user_id = ?",
      [userId],
    );
    if (!rows.length) return;
    let club = [];
    let squad = {};
    if (rows[0].userPlayers) {
      club = JSON.parse(rows[0].userPlayers);
    }
    if (rows[0].squadPlayers) {
      squad = JSON.parse(rows[0].squadPlayers);
    }
    const idsToRemove = playerIds.map(String);

    const updatedClub = club.filter(
      (p) => !idsToRemove.includes(String(p.player_id)),
    );

    const updatedSquad = Object.fromEntries(
      Object.entries(squad).filter(
        ([_, p]) => p && !idsToRemove.includes(String(p.player_id)),
      ),
    );

    await pool.execute(
      `
      UPDATE userclub 
      SET userPlayers = ?, squadPlayers = ?
      WHERE user_id = ?
      `,
      [JSON.stringify(updatedClub), JSON.stringify(updatedSquad), userId],
    );

    return { updatedClub, updatedSquad };
  } catch (error) {
    throw error;
  }
}

//!Export
module.exports = {
  currentClub,
  removePlayersEverywhere,
  getSquad,
  updateSquadPlayers,
  updateSquadName,
  updateFormation,
  updateClub,
};
