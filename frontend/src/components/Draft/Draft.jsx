import { useEffect, useState } from "react";
import { useCallback } from "react";
import { createPortal } from "react-dom";
import "./Draft.css";
import Gamelayout from "../Gamelayout/Gamelayout.jsx";
import Subbar from "../Subbar/Subbar.jsx";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import RatingChemDisplay from "../RatingChemDisplay/RatingChemDisplay.jsx";
import Reward from "../Reward/Reward.jsx";
import Grab from "../Grab/Grab.jsx";
import {
  benchLayout,
  chemImg,
  ratingStars,
  displayedPosition,
  fetchChemistry,
  fetchRating,
} from "../../utilities/utilities.js";
import { useDrag } from "../../utilities/useDrag.js";

function Draft() {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [gameLayout, setGameLayout] = useState(null);

  const [showPlayerSelectionModal, setShowPlayerSelectionModal] =
    useState(false);
  const [playerOptons, setPlayerOptions] = useState([]);
  const [assignedPlayers, setAssignedPlayers] = useState({});

  const [draftStarted, setDraftStarted] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [captainPick, setCaptainPick] = useState(true);

  const [openSubs, setOpenSubs] = useState(false);

  const [teamChemistry, setTeamChemistry] = useState(0);
  const [teamRating, setTeamRating] = useState(0);

  const [playerChemMap, setPlayerChemMap] = useState({});

  const [showDraftSummary, setShowDraftSummary] = useState(false);

  const [rewardData, setRewardData] = useState(null);
  const [showReward, setShowReward] = useState(false);

  //! Formációk betöltése és draft reset-elése
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/draft/randomformations",
        );

        const formationsData = result.randomformations;

        setFormations(formationsData);

        if (formationsData.length > 0) {
          setSelectedFormation(formationsData[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //! Formáció hover
  const handleFormationHover = (formation) => {
    setSelectedFormation(formation);
  };

  //! Játék elkezdése
  const startDraft = async (formation) => {
    try {
      await fetch("http://127.0.0.1:3000/api/draft/draftselectedplayers", {
        method: "DELETE",
      });

      setGameLayout(formation.layout);

      await postMethodFetch("http://127.0.0.1:3000/api/draft/formation", {
        slotPosList: formation.layout.map((p) => p.pos),
      });

      setSelectedFormation(formation);
      setDraftStarted(true);

      setTimeout(async () => {
        await chooseCaptain();
        setShowPlayerSelectionModal(true);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitányok betöltése
  const chooseCaptain = async () => {
    try {
      setCaptainPick(true);
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/draft/randomplayers",
      );
      setPlayerOptions(result.randomjatekosok);
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitány kiválasztása + kiválasztott játékos elküldése a backend-re
  const handleCaptainSelect = async (player) => {
    try {
      await postMethodFetch(
        "http://127.0.0.1:3000/api/draft/draftselectedplayers",
        {
          ...player,
          starting11: true,
          resIndex: false,
        },
      );

      setShowPlayerSelectionModal(false);
      assignCaptain();

      const { teamChemistry, playerChemMap } = await fetchChemistry();
      setTeamChemistry(teamChemistry);
      setPlayerChemMap(playerChemMap);

      const rating = await fetchRating();
      setTeamRating(rating);
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitány hozzárendelése a layout-hoz
  const assignCaptain = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/draft/draftselectedplayers",
      );

      const player = result.draftselectedplayers[0];
      const mainPosition = player.player_positions.split(", ")[0];

      const firstIndex = gameLayout.findIndex((p) => p.pos === mainPosition);

      if (firstIndex === -1) {
        let alternateIndex;
        for (let i = 0; i < player.player_positions.split(", ").length; i++) {
          alternateIndex = gameLayout.findIndex(
            (p) => p.pos === player.player_positions.split(", ")[i],
          );
        }
        if (alternateIndex === -1) {
          const resSlots = ["RES1", "RES2", "RES3", "RES4", "RES5"];
          let chosenRes = null;

          setAssignedPlayers((prev) => {
            const next = { ...prev };
            chosenRes = resSlots.find((id) => !next[id]);
            next[chosenRes] = player;
            return next;
          });

          await fetch(
            "http://127.0.0.1:3000/api/draft/draftselectedplayers11",
            {
              method: "DELETE",
            },
          );

          await fetch("http://127.0.0.1:3000/api/draft/draftselectedplayers", {
            method: "DELETE",
          });

          await postMethodFetch(
            "http://127.0.0.1:3000/api/draft/draftselectedplayers",
            {
              ...player,
              starting11: false,
              resIndex: true,
            },
          );
        } else {
          setAssignedPlayers((prev) => ({
            ...prev,
            [alternateIndex]: player,
          }));
          return;
        }
      }

      setAssignedPlayers((prev) => ({
        ...prev,
        [firstIndex]: player,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  //! Játékosok betöltése
  const handlePosClick = async (index, pos) => {
    try {
      setCaptainPick(false);
      setSelectedIndex(index);

      const result = await getMethodFetch(
        `http://127.0.0.1:3000/api/draft/random/${pos}`,
      );
      setPlayerOptions(result.randomPlayers);

      setShowPlayerSelectionModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  //! Játékosok kiválasztása + hozzárendelése a layout-hoz + kiválasztott játékos elküldése a backend-re
  const handlePlayerSelect = async (player) => {
    try {
      if (assignedPlayers[selectedIndex]) return;

      const starting11 = typeof selectedIndex === "number";
      const resIndex =
        selectedIndex === "RES1" ||
        selectedIndex === "RES2" ||
        selectedIndex === "RES3" ||
        selectedIndex === "RES4" ||
        selectedIndex === "RES5";
      const slotPos = starting11
        ? gameLayout[selectedIndex].pos
        : benchLayout.find((s) => s.id === selectedIndex)?.pos;

      await postMethodFetch(
        "http://127.0.0.1:3000/api/draft/draftselectedplayers",
        {
          ...player,
          starting11,
          resIndex,
          slotPos,
        },
      );

      const { teamChemistry, playerChemMap } = await fetchChemistry();
      setTeamChemistry(teamChemistry);
      setPlayerChemMap(playerChemMap);

      const rating = await fetchRating();
      setTeamRating(rating);

      setAssignedPlayers((prev) => ({
        ...prev,
        [selectedIndex]: player,
      }));

      setShowPlayerSelectionModal(false);
      setSelectedIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  //! RewardValue-k
  const getRewardValue = (score) => {
    if (score > 122) return "excellent";
    if (score > 117) return "great";
    if (score > 112) return "good";
    if (score > 105) return "mid";
    return "bad";
  };

  //! Játékosok swap-olása
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

        const rating = await fetchRating();
        setTeamRating(rating);
      } catch (error) {
        console.log(error);
      }
    },
    [assignedPlayers, gameLayout],
  );

  //! Drag meghívása
  const { isDragging, dragKey, dragPos, startDrag } = useDrag(
    assignedPlayers,
    handleSwapPlayers,
  );

  //! Draft vége
  const draftComplete =
    draftStarted &&
    gameLayout &&
    gameLayout.every((_, i) => Boolean(assignedPlayers[i])) &&
    benchLayout.every((slot) => Boolean(assignedPlayers[slot.id]));

  //! Draft befejezése
  const handleSubmitDraft = async () => {
    try {
      setShowDraftSummary(true);

      const actualDraft = teamChemistry + teamRating;

      const rewValue = getRewardValue(actualDraft);
      const rewardResult = await getMethodFetch(
        `http://127.0.0.1:3000/api/rewards/draftrewards/${rewValue}`,
      );
      setRewardData(rewardResult.results[0]);

      setTimeout(() => {
        setShowReward(true);
      }, 8000);

      await postMethodFetch("http://127.0.0.1:3000/api/users/me/bestdraft", {
        rating: actualDraft,
      });

      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 20,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 21,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 22,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 23,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 24,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  //! Grafikon létrehozása
  const graphProgress =
    Math.max(0, Math.min((teamChemistry + teamRating) / 133, 1)) * 360;

  //! Visszatérés a menübe
  const handleExitToMenu = async () => {
    try {
      if (rewardData) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/rewards/draftrewards/claim",
          {
            rewardId: rewardData.id,
          },
        );
      }

      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Formáció kiválasztása */}
      {!draftStarted && (
        <div id="formationSelectDiv">
          <div className="row">
            {/* Bal oldal */}
            <div className="col-4" id="chooseFormation">
              <h3 className="chooseFormationTitle">Choose a formation</h3>

              {formations.map((formation, index) => {
                const formationArray = Object.values(formation.formation);

                return (
                  <button
                    key={index}
                    className="formationSelectBtn"
                    onMouseOver={() => handleFormationHover(formation)}
                    onClick={() => startDraft(formation)}
                  >
                    <div className="miniFormationLayout">
                      {formation.layout.map((p, i) => (
                        <div
                          key={i}
                          className="pos"
                          data-slotkey={i}
                          style={{ left: p.x + "%", top: p.y + "%" }}
                          id={p.pos}
                        />
                      ))}
                    </div>
                    <h5 className="formationText">{formationArray}</h5>
                  </button>
                );
              })}
            </div>

            {/* Jobb oldal */}
            <div className="col-8" id="formationImage">
              {selectedFormation && (
                <>
                  <h2>
                    Formation: {Object.values(selectedFormation.formation)}
                  </h2>

                  <div className="formationLayout">
                    {selectedFormation.layout.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        data-slotkey={i}
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      ></div>
                    ))}
                    {selectedFormation.layout.map((p, i) => (
                      <p
                        key={i}
                        className="posText"
                        style={{ left: p.x + "%", top: `calc(${p.y}% + 6.5%)` }}
                      >
                        {p.pos}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Layout */}
      {draftStarted && gameLayout && (
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
        />
      )}

      {/* Player selection modal */}
      {showPlayerSelectionModal &&
        createPortal(
          <div className="modalOverlay">
            <div className="playerSelectionModal">
              {playerOptons.map((player, i) => (
                <div
                  className="cardSlot"
                  key={i}
                  onClick={() =>
                    captainPick
                      ? handleCaptainSelect(player)
                      : handlePlayerSelect(player)
                  }
                >
                  <PlayerCard
                    player={player}
                    chemImg={chemImg}
                    playerChemMap={playerChemMap}
                    displayedPosition={displayedPosition}
                    slotPos={null}
                    isModal={true}
                  />
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {/* Kispad */}
      {draftStarted && gameLayout && (
        <Subbar
          openSubs={openSubs}
          setOpenSubs={setOpenSubs}
          benchLayout={benchLayout}
          assignedPlayers={assignedPlayers}
          handlePosClick={handlePosClick}
          startDrag={startDrag}
          isDragging={isDragging}
          dragKey={dragKey}
          chemImg={chemImg}
          playerChemMap={playerChemMap}
          displayedPosition={displayedPosition}
        />
      )}

      {/* Rating & Chemistry Display */}
      {draftStarted && gameLayout && (
        <RatingChemDisplay
          teamRating={teamRating}
          teamChemistry={teamChemistry}
          ratingStars={ratingStars}
        />
      )}

      {/* Draft vége */}
      {draftComplete &&
        createPortal(
          <button className="submitDraftBtn" onClick={handleSubmitDraft}>
            Submit Draft
          </button>,
          document.body,
        )}

      {/* Draft Summary */}
      {showDraftSummary &&
        createPortal(
          <div className="draftSummaryOverlay">
            <div className="draftSummary">
              <div className="draftSummaryTitle">DRAFT summary</div>
              <div className="draftSummaryStats">
                {!showReward && (
                  <>
                    <div className="draftGraphDiv">
                      <div
                        className="draftGraph"
                        style={{
                          background: `conic-gradient(rgb(0, 255, 251) ${graphProgress}deg, rgba(0, 255, 251, 0.26) ${graphProgress}deg)`,
                        }}
                      >
                        <div className="ratingInner">
                          <div>squad</div>
                          <div>rating</div>
                          <strong>{teamChemistry + teamRating}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="vl"></div>
                    <div className="draftNumbers">
                      <div className="ratingStars">
                        {ratingStars(teamRating)}
                      </div>
                      <h5 className="ratingText">
                        Rating{" "}
                        <span id="ratingNum" className="ratingNum">
                          {teamRating}
                        </span>
                      </h5>
                      <h5 className="chemText">
                        Chemistry{" "}
                        <span id="chemNum" className="chemNum">
                          {teamChemistry}
                        </span>
                      </h5>
                    </div>
                  </>
                )}
                {showReward && rewardData && (
                  <>
                    <Reward reward={rewardData} />
                    <button className="exitButton" onClick={handleExitToMenu}>
                      Exit and Claim
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Grab */}
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

export default Draft;
