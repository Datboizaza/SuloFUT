import { useState } from "react";
import "./Settings.css";
import { createPortal } from "react-dom";
import BackIcon from "../../assets/back-icon.png";

function Settings() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showExistsUsernameModal, setShowExistsUsernameModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false);

  //! Username change
  const handleUsernameChange = async () => {
    try {
      const users = await getMethodFetch("http://127.0.0.1:3000/api/users");
      const usersArr = [];
      users.results.forEach((element) => {
        usersArr.push(element.username);
      });

      if (username === "") {
        setShowErrorModal(true);
      } else {
        if (usersArr.includes(username)) {
          setShowExistsUsernameModal(true);
        } else {
          await postMethodFetch(
            "http://127.0.0.1:3000/api/users/changeusername",
            {
              username,
            },
          );

          setShowChangeModal(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //! Password change
  const handlePasswordChange = async () => {
    try {
      if (password === "") {
        setShowErrorModal(true);
      } else {
        const hasUppercase = /[A-ZÁÉÓÚŐŰÖÜÍ]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (password.length < 5 || !hasUppercase || !hasNumber) {
          setShowPasswordErrorModal(true);
        } else {
          await postMethodFetch(
            "http://127.0.0.1:3000/api/users/changepassword",
            {
              password,
            },
          );

          setShowChangeModal(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //! Logout
  const handleLogout = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/users/logout");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  //! Delete profile
  const handleDelete = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/users/delete");

      window.location.href = "/login";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="settingsContainer">
      <h2 className="settingsTitle">Settings</h2>
      <div className="settingsCard">
        <p>Change Username</p>
        <input
          type="text"
          placeholder="New username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="settingsInput"
        />

        <button className="settingsBtn" onClick={handleUsernameChange}>
          Change Username
        </button>
      </div>

      <div className="settingsCard">
        <p>Change Password</p>
        <input
          type="password"
          placeholder="New password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="settingsInput"
        />

        <button className="settingsBtn" onClick={handlePasswordChange}>
          Change Password
        </button>
      </div>

      <div className="settingsCard">
        <p>Logout</p>
        <button
          className="settingsBtn logout"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </div>

      <div className="settingsCard">
        <p>Delete Account</p>
        <button
          className="settingsBtn delete"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>

      {/* Logout */}
      {showLogoutModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p>Are you sure you want to log out?</p>

              <div className="modalBtns">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="noButton"
                >
                  No
                </button>
                <button className="yesButton" onClick={handleLogout}>
                  Yes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Delete acc */}
      {showDeleteModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p>Are you sure you want to delete your account?</p>

              <div className="modalBtns">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="noButton"
                >
                  No
                </button>
                <button className="yesButton" onClick={handleDelete}>
                  Yes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Change username */}
      {showChangeModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p className="successModalText">
                Username or password changed successfully
              </p>

              <button
                onClick={() => setShowChangeModal(false)}
                className="backIconBtn"
              >
                <img src={BackIcon} className="backIcon" />
                <p>Back</p>
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Létező username */}
      {showExistsUsernameModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p className="errorModalText">Username already exist</p>

              <button
                onClick={() => setShowExistsUsernameModal(false)}
                className="backIconBtn"
              >
                <img src={BackIcon} className="backIcon" />
                <p>Back</p>
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Üres username */}
      {showErrorModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p className="errorModalText">No username or password</p>

              <button
                onClick={() => setShowErrorModal(false)}
                className="backIconBtn"
              >
                <img src={BackIcon} className="backIcon" />
                <p>Back</p>
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Gyenge password */}
      {showPasswordErrorModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="modalModal">
              <p className="errorModalText">Password is too weak</p>

              <button
                onClick={() => setShowPasswordErrorModal(false)}
                className="backIconBtn"
              >
                <img src={BackIcon} className="backIcon" />
                <p>Back</p>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

const getMethodFetch = async (url) => {
  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`GET hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

const postMethodFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST Hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default Settings;
