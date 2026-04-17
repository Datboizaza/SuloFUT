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

//! Loginhoz és profil műveletekhez szükséges lekérdezések
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

//? Username változtatás
async function changeUsername(newUsername, userId) {
  const query = "UPDATE users SET username = ? WHERE id = ?";
  try {
    const [rows] = await pool.execute(query, [newUsername, userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? Password változtatás
async function changePassword(newPassword, userId) {
  const query = "UPDATE users SET password = ? WHERE id = ?";
  try {
    const [rows] = await pool.execute(query, [newPassword, userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//? Delete account
async function deleteUserStats(userId) {
  const query = `
  DELETE FROM stats WHERE user_id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function deleteUserClub(userId) {
  const query = `
  DELETE FROM userclub WHERE user_id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function deleteUserPacks(userId) {
  const query = `
  DELETE FROM userpacks WHERE user_id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function deleteUserObjClaims(userId) {
  const query = `
  DELETE FROM user_objective_claims WHERE user_id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function deleteUserSubobjProg(userId) {
  const query = `
  DELETE FROM user_subobjective_progress WHERE user_id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}
async function deleteUser(userId) {
  const query = `
  DELETE FROM users WHERE id = ?;
  `;
  try {
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

//! User dolgai
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

//!Export
module.exports = {
  selectall,
  insertinto,
  login,
  getUserById,
  changeUsername,
  changePassword,
  deleteUserStats,
  deleteUserClub,
  deleteUserPacks,
  deleteUserObjClaims,
  deleteUserSubobjProg,
  deleteUser,
  getUserCoinsById,
  getUserPacksById,
  updateBestDraftById,
};
