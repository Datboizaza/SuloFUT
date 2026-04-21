import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./SBC.css";
import SpecialPack from "../../assets/specialpack.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import RatingChemDisplay from "../RatingChemDisplay/RatingChemDisplay.jsx";
import Gamelayout from "../Gamelayout/Gamelayout.jsx";
import Grab from "../Grab/Grab.jsx";
import SbcRequirementDisplay from "../sbcRequirementDisplay/sbcRequirementDisplay.jsx";
import { useDrag } from "../../utilities/useDrag.js";
import {
  chemImg,
  ratingStars,
  fetchChemistry,
  fetchRatingWOSub,
  displayedPosition,
  benchLayout,
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

  const [currentSBC, setCurrentSBC] = useState(null);

  const [showSbcReward, setShowSbcReward] = useState(false);

  const [userSbcProgress, setUserSbcProgress] = useState({});

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

    const fetchProgress = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/sbc/userprogress",
        );

        const map = {};
        result.results.forEach((row) => {
          map[Number(row.sbc_id)] = Number(row.completions);
        });

        setUserSbcProgress(map);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProgress();
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
      await fetch("http://127.0.0.1:3000/api/draft/draftselectedplayers", {
        method: "DELETE",
      });

      const result = await getMethodFetch(
        `http://127.0.0.1:3000/api/sbc/${id}`,
      );

      setCurrentSBC(result.sbc[0]);

      const formationName = result.sbc[0].formation;

      const layout = await getLayoutByFormation(formationName);

      setGameLayout(layout);
      setSbcGameStarted(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Position click
  const handlePosClick = async (index) => {
    try {
      setSelectedIndex(index);

      const result = await getMethodFetch(`http://127.0.0.1:3000/api/myclub`);

      const assignedIds = Object.values(assignedPlayers).map(
        (p) => p.player_id,
      );

      const filteredPlayers = result.filter(
        (player) => !assignedIds.includes(player.player_id),
      );

      setClubPlayers(filteredPlayers);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Player hozzáadása a layout-hoz
  const handlePlayerSelect = async (player) => {
    try {
      const existingPlayer = assignedPlayers[selectedIndex];

      const starting11 = typeof selectedIndex === "number";
      const resIndex = null;
      const slotPos = starting11
        ? gameLayout[selectedIndex].pos
        : benchLayout.find((s) => s.id === selectedIndex)?.pos;

      if (existingPlayer) {
        await putMethodFetch("http://127.0.0.1:3000/api/draft/replace", {
          oldPlayerId: existingPlayer.player_id,
          newPlayer: {
            ...player,
            starting11,
            resIndex,
            slotPos,
          },
        });
      } else {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/draft/draftselectedplayers",
          {
            ...player,
            starting11,
            resIndex,
            slotPos,
          },
        );
      }

      const { teamChemistry, playerChemMap } = await fetchChemistry();
      setTeamChemistry(teamChemistry);
      setPlayerChemMap(playerChemMap);

      const rating = await fetchRatingWOSub();
      setTeamRating(rating);

      setAssignedPlayers((prev) => ({
        ...prev,
        [selectedIndex]: player,
      }));

      setShowModal(false);
      setSelectedIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  //! Játékosok swapolása
  const handleSwapPlayers = useCallback(
    async (from, to) => {
      try {
        const a = assignedPlayers[from];
        const b = assignedPlayers[to];

        setAssignedPlayers((prev) => {
          const next = { ...prev };
          next[from] = b;
          next[to] = a;
          return next;
        });

        const getSlotPosByKey = (key) => {
          if (typeof key === "number") return gameLayout[key]?.pos;
          return benchLayout.find((s) => s.id === key)?.pos;
        };

        await putMethodFetch("http://127.0.0.1:3000/api/draft/swap", {
          aId: a.player_id,
          bId: b.player_id,
          aSlotPos: getSlotPosByKey(from),
          bSlotPos: getSlotPosByKey(to),
        });

        const { teamChemistry, playerChemMap } = await fetchChemistry();
        setTeamChemistry(teamChemistry);
        setPlayerChemMap(playerChemMap);

        const rating = await fetchRatingWOSub();
        setTeamRating(rating);
      } catch (error) {
        console.log(error);
      }
    },
    [assignedPlayers, gameLayout],
  );

  //! Usedrag használata
  const { isDragging, dragKey, dragPos, startDrag } = useDrag(
    assignedPlayers,
    handleSwapPlayers,
  );

  //! SBC requirement-ek
  const getRequirements = (sbc) => {
    return Object.entries(sbc).filter(([key, value]) => {
      if (!value) return false;

      if (
        typeof value === "string" &&
        (value.startsWith("min") || value.startsWith("max"))
      ) {
        return true;
      }

      if (key === "rarity") return true;

      return false;
    });
  };

  //! Min/max requirement
  const parseRequirement = (value) => {
    if (!value || typeof value !== "string") {
      return { type: null, value: 0 };
    }

    const [type, num] = value.split(" ");
    return {
      type,
      value: Number(num),
    };
  };

  //! Aktuális sbc állás
  const getSquadStats = (players) => {
    const playerList = Object.values(players);

    return {
      rating: teamRating,
      chemistry: teamChemistry,
      leagues: new Set(playerList.map((p) => p.league_id)).size,
      nations: new Set(playerList.map((p) => p.nationality_id)).size,
      sameLeague: getMaxSame(playerList, "league_id"),
      sameNation: getMaxSame(playerList, "nationality_id"),
      sameClub: getMaxSame(playerList, "club_team_id"),
      special: playerList.filter((p) => p.is_special).length,
      chemPP: playerList.filter((p) => playerChemMap[p.player_id] >= 1).length,
      rarity:
        playerList.length > 0
          ? playerList.every((p) => p.rarity === playerList[0].rarity)
            ? playerList[0].rarity
            : "mixed"
          : null,
    };
  };

  //!Megszámolja a megadott dolog előfordulását
  const getMaxSame = (list, key) => {
    const count = {};
    list.forEach((p) => {
      count[p[key]] = (count[p[key]] || 0) + 1;
    });
    return Math.max(...Object.values(count), 0);
  };

  //! Requirement-ek ellenőrzése
  const checkRequirement = (requirementKey, requirementValue, stats) => {
    if (!requirementValue) return true;

    if (
      !requirementValue.startsWith("min") &&
      !requirementValue.startsWith("max")
    ) {
      const current = stats[requirementKey];

      if (requirementKey === "rarity") {
        return stats.rarity === requirementValue;
      }

      return current === requirementValue;
    }

    const { type, value } = parseRequirement(requirementValue);
    const current = stats[requirementKey] || 0;

    if (type === "min") return current >= value;
    if (type === "max") return current <= value;

    return false;
  };

  //! Aktuális csapat statjai és aktuális sbc requirementjei és játékosainak megszámolása
  const stats = getSquadStats(assignedPlayers);
  const requirements = currentSBC ? getRequirements(currentSBC) : [];
  const playerCount = Object.keys(assignedPlayers).length;

  //! Minden requirement teljesitve van e
  const allCompleted =
    playerCount === 11 &&
    requirements.every(([key, value]) => checkRequirement(key, value, stats));

  //! SBC befejezése
  const handleSubmitSbc = async () => {
    try {
      const playersRemove = Object.values(assignedPlayers).map(
        (player) => player.player_id,
      );

      await postMethodFetch(
        "http://127.0.0.1:3000/api/myclub/deleteClubPlayers",
        {
          players: playersRemove,
        },
      );

      setShowSbcReward(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Reward claim-elése
  const handleClaimReward = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/rewards/sbc/claim", {
        sbcId: currentSBC.id,
      });

      setUserSbcProgress((prev) => ({
        ...prev,
        [currentSBC.id]: (prev[currentSBC.id] || 0) + 1,
      }));

      window.location.href = "/sbc";
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

              const completions = userSbcProgress[Number(sbc.id)] || 0;
              const repeat =
                sbc.repeat === null ||
                sbc.repeat === undefined ||
                sbc.repeat === 0
                  ? Infinity
                  : sbc.repeat;
              const remaining =
                repeat === Infinity
                  ? Infinity
                  : Math.max(repeat - completions, 0);
              const isDisabled = completions >= repeat;

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
                      {repeat === Infinity ? "Infinite" : `${remaining}`}
                    </p>
                  </div>

                  <button
                    className="startBtn"
                    onClick={() => handleStart(sbc.id)}
                    disabled={isDisabled}
                  >
                    {isDisabled ? "SBC already completed" : "Start Challenge"}
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
            isDragging={isDragging}
            dragKey={dragKey}
            handlePosClick={handlePosClick}
            startDrag={startDrag}
            chemImg={chemImg}
            playerChemMap={playerChemMap}
            displayedPosition={displayedPosition}
            allowReplace={true}
          />
        </>
      )}

      {/* Player kiválasztó modal */}
      {showModal &&
        createPortal(
          <div className="sbcPlayersModal">
            {clubPlayers.map((player) => (
              <div key={player.player_id} className="cardRow">
                <div
                  className="cardWrapper"
                  onClick={() => handlePlayerSelect(player)}
                >
                  <PlayerCard
                    player={player}
                    isModal={true}
                    displayedPosition={(p) => p.player_positions.split(", ")[0]}
                    slotPos={null}
                    playerChemMap={{}}
                    chemImg={() => null}
                  />
                </div>

                <p className="packPlayerName">{player.long_name}</p>
              </div>
            ))}
          </div>,
          document.body,
        )}

      {/* Rating & Chemistry Display */}
      {sbcGameStarted && gameLayout && (
        <RatingChemDisplay
          teamRating={teamRating}
          teamChemistry={teamChemistry}
          ratingStars={ratingStars}
          title={"sbc squad"}
        />
      )}

      {/* Requirement Display */}
      {currentSBC && (
        <SbcRequirementDisplay
          sbc={currentSBC}
          assignedPlayers={assignedPlayers}
          stats={stats}
          getRequirements={getRequirements}
          parseRequirement={parseRequirement}
          checkRequirement={checkRequirement}
        />
      )}

      {/* Drag */}
      {isDragging && dragKey !== null && assignedPlayers[dragKey] && (
        <Grab
          dragPos={dragPos}
          assignedPlayers={assignedPlayers}
          dragKey={dragKey}
          isDragging={isDragging}
          chemImg={chemImg}
          playerChemMap={playerChemMap}
          displayedPosition={displayedPosition}
          gameLayout={gameLayout}
        />
      )}

      {/* Complete gomb */}
      {sbcGameStarted && allCompleted && (
        <button className="completeBtn" onClick={handleSubmitSbc}>
          Complete SBC
        </button>
      )}

      {/* SBC reward modal */}
      {showSbcReward &&
        createPortal(
          <div className="sbcRewardOverlay">
            <div className="sbcReward">
              <h2 className="sbcRewardTitle">SBC completed</h2>

              <div className="sbcRewardBox">
                <img src={SpecialPack} alt="Reward" className="sbcRewardImg" />
                <p className="sbcRewardText">{currentSBC.rewardPack}</p>
              </div>

              <button className="exitButton" onClick={handleClaimReward}>
                Exit and Claim
              </button>
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

const putMethodFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`PUT Hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default SBC;
