import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./SBC.css";
import SpecialPack from "../../assets/specialpack.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import RatingChemDisplay from "../RatingChemDisplay/RatingChemDisplay.jsx";
import Gamelayout from "../Gamelayout/Gamelayout.jsx";
import Grab from "../Grab/Grab.jsx";
import {
  chemImg,
  ratingStars,
  fetchChemistry,
  fetchRating,
  displayedPosition,
} from "../../utilities/utilities.js";

function SBC() {
  const [data, setData] = useState({
    challenges: [],
    upgrades: [],
    foundations: [],
  });

  const [activeTab, setActiveTab] = useState("challenges");

  const [sbcGameStarted, setSbcGameStarted] = useState(false);

  const [gameLayout, setGameLayout] = useState(null);
  const [assignedPlayers, setAssignedPlayers] = useState({});
  const [clubPlayers, setClubPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [teamChemistry, setTeamChemistry] = useState(0);
  const [teamRating, setTeamRating] = useState(0);
  const [playerChemMap, setPlayerChemMap] = useState({});

  //! Sbc adatok lekérése
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/sbc/allsbc",
        );
        setData(result.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //! Aktuális tab
  const current = data[activeTab] || [];

  //! Formáció megkeresése a végponton
  const getLayoutByFormation = async (formationName) => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/formations",
      );

      const found = result.formations.find(
        (f) => f.formation === formationName,
      );

      return found ? found.layout : null;
    } catch (error) {
      console.log(error);
    }
  };

  //! Start Challenge
  const handleStart = async (id) => {
    try {
      const result = await getMethodFetch(
        `http://127.0.0.1:3000/api/sbc/${id}`,
      );

      const formationName = result.sbc[0].formation;

      const layout = await getLayoutByFormation(formationName);

      setGameLayout(layout);
      setSbcGameStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Position click
  const handlePosClick = async (index /*pos*/) => {
    try {
      setSelectedIndex(index);

      const result = await getMethodFetch(`http://127.0.0.1:3000/api/myclub`);

      setClubPlayers(result);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Player hozzáadása a layout-hoz
  const handlePlayerSelect = async (player) => {
    try {
      setAssignedPlayers((prev) => ({
        ...prev,
        [selectedIndex]: player,
      }));

      const { teamChemistry, playerChemMap } = await fetchChemistry();
      setTeamChemistry(teamChemistry);
      setPlayerChemMap(playerChemMap);

      const rating = await fetchRating();
      setTeamRating(rating);

      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!sbcGameStarted && (
        <div className="sbcContainer">
          {/* Tabs */}
          <div className="tabs">
            {["challenges", "upgrades", "foundations"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="sbcGrid">
            {current.map((element) => {
              const sbc = element.sbcData;

              return (
                <div key={sbc.id} className="sbcCard">
                  <div className="sbcHeader">
                    <p className="sbcTitle">{sbc.sbcName}</p>
                  </div>

                  <div className="sbcInfo">
                    <div className="rewardDiv">
                      <p>
                        <strong>Reward:</strong>
                      </p>
                      <div className="packDiv">
                        <img
                          src={SpecialPack}
                          alt="Reward Pack Image"
                          className="rewardPack"
                        />
                        <p>x1 {sbc.rewardPack}</p>
                      </div>
                    </div>
                    <p>
                      <strong>Repeatable:</strong>{" "}
                      {sbc.repeat === null || sbc.repeat === undefined
                        ? "Infinite"
                        : sbc.repeat}
                    </p>
                  </div>

                  <button
                    className="startBtn"
                    onClick={() => handleStart(sbc.id)}
                  >
                    Start Challenge
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sbc elkezdése */}
      {sbcGameStarted && gameLayout && (
        <>
          <div className="sbcBackground"></div>
          <Gamelayout
            gameLayout={gameLayout}
            assignedPlayers={assignedPlayers}
            isDragging={false}
            dragKey={null}
            handlePosClick={handlePosClick}
            startDrag={() => {}}
            chemImg={chemImg}
            playerChemMap={playerChemMap}
            displayedPosition={displayedPosition}
          />
        </>
      )}

      {/* Player kiválasztó modal */}
      {showModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="playerSelectionModal">
              {clubPlayers.map((player, i) => (
                <div
                  key={i}
                  className="cardSlot"
                  onClick={() => handlePlayerSelect(player)}
                >
                  <PlayerCard player={player} isModal />
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {/* Rating & Chemistry Display */}
      {sbcGameStarted && gameLayout && (
        <RatingChemDisplay
          teamRating={teamRating}
          teamChemistry={teamChemistry}
          ratingStars={ratingStars}
        />
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

export default SBC;
