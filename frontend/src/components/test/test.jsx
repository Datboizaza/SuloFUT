import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./test.css";
import Coins from "../../assets/coins.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";

function Club() {
  const [myClubPlayers, setMyClubPlayers] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedPlayer] = useState(null);

  //!Club fetch
  const myClubFetch = async () => {
    try {
      const clubPlayers = await getMethodFetch(
        `http://127.0.0.1:3000/api/myclub`,
      );

      setMyClubPlayers(clubPlayers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await myClubFetch();
    };
    init();
  }, []);

  //! Quick sell 1 játékos
  const handleQuickSell = async (player) => {
    try {
      const updated = myClubPlayers.filter(
        (p) => p.player_id !== player.player_id,
      );

      await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
        coins: player.value,
      });

      await postMethodFetch("http://127.0.0.1:3000/api/myclub/setClubPlayers", {
        players: updated,
      });

      setMyClubPlayers(updated);

      window.dispatchEvent(new Event("coinsUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Confirm modal */}
      {modal &&
        createPortal(
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              <p>
                Are you sure you want to quick sell this player for{" "}
                {selectedPlayer.value.toLocaleString("hu-HU")} coins?
              </p>

              <div className="modalBtns">
                <button onClick={() => setModal(false)} className="noButton">
                  No
                </button>
                <button
                  onClick={() => {
                    handleQuickSell(selectedPlayer);
                    setModal(false);
                  }}
                  className="yesButton"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
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

export default Club;
