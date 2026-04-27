import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Club.css";
import Coins from "../../assets/coins.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import { calculateClubValue } from "../../utilities/utilities.js";
import PlayersModal from "../PlayersModal/PlayersModal.jsx";

function Club() {
  const [myClubPlayers, setMyClubPlayers] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  //!Club fetch
  useEffect(() => {
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

    myClubFetch();
  }, []);

  //! Confirm modal meghívása
  const handleQuickSellButton = (player) => {
    setSelectedPlayer(player);
    setConfirmModal(true);
  };

  //! Quick sell 1 játékos
  const handleQuickSell = async (player) => {
    try {
      const updated = myClubPlayers.filter(
        (p) => p.player_id !== player.player_id,
      );

      await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
        coins: player.value,
      });

      await postMethodFetch("http://127.0.0.1:3000/api/myclub/removeplayer", {
        playerId: player.player_id,
      });

      setMyClubPlayers(updated);

      window.dispatchEvent(new Event("coinsUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  //! Club value kiszámolása
  useEffect(() => {
    postMethodFetch("http://127.0.0.1:3000/api/users/me/clubvalue", {
      value: calculateClubValue(myClubPlayers),
    });
  }, [myClubPlayers]);

  return (
    <>
      <PlayersModal
        clubPlayers={myClubPlayers}
        selectedPosition={""}
        enableQuickSell={true}
        onQuickSell={handleQuickSellButton}
        handlePlayerSelect={null}
      />

      {/* Confirm modal */}
      {confirmModal &&
        createPortal(
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              <p>
                Are you sure you want to quick sell this player for{" "}
                {selectedPlayer.value.toLocaleString("hu-HU")} coins?
              </p>

              <div className="modalBtns">
                <button
                  onClick={() => setConfirmModal(false)}
                  className="noButton"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handleQuickSell(selectedPlayer);
                    setConfirmModal(false);
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
