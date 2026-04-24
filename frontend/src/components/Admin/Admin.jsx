import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("delete");
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [promoData, setPromoData] = useState({});
  const [cardImage, setCardImage] = useState(null);
  const [showPromoAddedModal, setShowPromoAddedModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPromoErrorModal, setShowPromoErrorModal] = useState(false);

  //! User-ek fetchelése
  const fetchUsers = async () => {
    try {
      const userRes = await getMethodFetch("http://127.0.0.1:3000/api/users");
      setUsers(userRes.results || []);
    } catch (error) {
      console.log(error);
    }
  };

  //! PLayer-ek fetchelése
  const fetchPlayers = async () => {
    try {
      const playersRes = await getMethodFetch(
        "http://127.0.0.1:3000/api/players",
      );
      setPlayers(playersRes.players || []);
    } catch (error) {
      console.log(error);
    }
  };

  //! Folyamatos frissítés
  useEffect(() => {
    const load = async () => {
      await fetchUsers();
      await fetchPlayers();
    };
    load();
  }, []);

  //! Delete user
  const handleDeleteUser = async () => {
    try {
      if (!userIdToDelete) return;
      await postMethodFetch("http://127.0.0.1:3000/api/users/admin/delete", {
        userId: Number(userIdToDelete),
      });
      setUserIdToDelete("");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  //! Player kiválasztása
  const handleSelectPlayer = (value) => {
    setSelectedPlayerId(value);
    const [id, rarity] = value.split("-");
    const player = players.find(
      (p) => String(p.player_id) === id && p.rarity === rarity,
    );
    if (player) {
      setPromoData(player);
    }
  };

  //! Promo játékos hozzáadása
  const handleAddPromo = async () => {
    try {
      const hasEmptyField = Object.values(promoData).some(
        (value) => value === "" || value === null || value === undefined,
      );
      if (!selectedPlayerId) {
        setShowPromoErrorModal(true);
        return;
      }
      if (hasEmptyField) {
        setShowPromoErrorModal(true);
        return;
      }
      if (!cardImage) {
        setShowPromoErrorModal(true);
        return;
      }

      if (selectedPlayerId && !hasEmptyField && cardImage) {
        const formData = new FormData();
        formData.append("playerData", JSON.stringify(promoData));
        if (cardImage) {
          formData.append("image", cardImage);
        }
        const response = await fetch(
          "http://127.0.0.1:3000/api/admin/addpromo",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          },
        );
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        setShowPromoAddedModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //!Kereső
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search) {
        setFilteredPlayers([]);
        return;
      }
      try {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/playerNameAdmin",
          {
            name: search,
          },
        );
        setFilteredPlayers(filterRes.byFeltetel || []);
      } catch (error) {
        console.log(error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, players]);

  //! Logout
  const handleLogout = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/users/admin/logout");

      window.location.href = "/adminlogin";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="adminContainer">
      <div className="tabs">
        <button
          className={`adminTab ${activeTab === "delete" ? "active" : ""}`}
          onClick={() => setActiveTab("delete")}
        >
          DELETE USER
        </button>

        <button
          className={`adminTab ${activeTab === "promo" ? "active" : ""}`}
          onClick={() => setActiveTab("promo")}
        >
          ADD PROMO
        </button>

        <button className="logoutBtn" onClick={handleLogout}>
          LOGOUT
        </button>
      </div>

      {activeTab === "delete" && (
        <div className="adminPanel">
          <h2>Delete User</h2>
          <select
            className="adminInput"
            value={userIdToDelete}
            onChange={(e) => setUserIdToDelete(e.target.value)}
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} (id: {user.id})
              </option>
            ))}
          </select>
          <button
            className="adminBtn"
            onClick={handleDeleteUser}
            disabled={!userIdToDelete}
          >
            Delete
          </button>
        </div>
      )}

      {activeTab === "promo" && (
        <div className="adminPanel">
          <h2>Add Promo Player</h2>

          <div className="adminField">
            <label className="adminLabel">Search player</label>
            <input
              type="text"
              className="adminInput"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="searchResults">
            {filteredPlayers.map((p) => (
              <div
                key={`${p.player_id}-${p.rarity}`}
                className="searchItem"
                onClick={() => handleSelectPlayer(`${p.player_id}-${p.rarity}`)}
              >
                {p.short_name} ({p.overall}) - {p.rarity}
              </div>
            ))}
          </div>
          {selectedPlayerId &&
            Object.keys(promoData).map((key) => (
              <div key={key} className="adminField">
                <label className="adminLabel">{key}</label>
                <input
                  className="adminInput"
                  value={promoData[key] || ""}
                  onChange={(e) =>
                    setPromoData({
                      ...promoData,
                      [key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

          <div className="adminField">
            <label className="adminLabel">Card Design Image</label>
            <input
              type="file"
              className="adminInput"
              onChange={(e) => setCardImage(e.target.files[0])}
            />
          </div>

          <button className="adminBtn" onClick={handleAddPromo}>
            Add Promo Player
          </button>
        </div>
      )}

      {/* Confirm modal */}
      {showPromoAddedModal &&
        createPortal(
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              <p>Promo card added successfully!</p>

              <div className="modalBtns">
                <button
                  onClick={() => setShowPromoAddedModal(false)}
                  className="modalCloseBtn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Error modal */}
      {showPromoErrorModal &&
        createPortal(
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              <p>Failed to add promo card!</p>

              <div className="modalBtns">
                <button
                  onClick={() => setShowPromoErrorModal(false)}
                  className="modalCloseBtn"
                >
                  Close
                </button>
              </div>
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

export default Admin;
