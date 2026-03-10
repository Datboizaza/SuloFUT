import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Draft.css";
import RareGold from "./assets/goldRare.png";
import AltPlayerImg from "./assets/altPlayerImg.png";
import ZeroChem from "./assets/zeroChem.png";
import OneChem from "./assets/oneChem.png";
import TwoChem from "./assets/twoChem.png";
import ThreeChem from "./assets/threeChem.png";
import InterMilan from "./assets/intermilan.png";
import ACMilan from "./assets/acmilan.png";
import Atalanta from "./assets/atalanta.png";
import Lazio from "./assets/lazio.png";

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

  const [dragFrom, setDragFrom] = useState(null);

  const [draftComplete, setDraftComplete] = useState(false);
  const [showDraftSummary, setShowDraftSummary] = useState(false);

  //! Formációk betöltése és draft reset-elése
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/randomformations",
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
      await fetch("http://127.0.0.1:3000/api/draftselectedplayers", {
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
        "http://127.0.0.1:3000/api/randomplayers",
      );
      setPlayerOptions(result.randomjatekosok);
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitány kiválasztása + kiválasztott játékos elküldése a backend-re
  const handleCaptainSelect = async (player) => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/draftselectedplayers", {
        ...player,
        starting11: true,
        resIndex: false,
      });

      setShowPlayerSelectionModal(false);
      assignCaptain();

      await fetchChemistry();
      await fetchRating();
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitány hozzárendelése a layout-hoz
  const assignCaptain = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/draftselectedplayers",
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

          await fetch("http://127.0.0.1:3000/api/draftselectedplayers11", {
            method: "DELETE",
          });
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
        `http://127.0.0.1:3000/api/random/${pos}`,
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

      await postMethodFetch("http://127.0.0.1:3000/api/draftselectedplayers", {
        ...player,
        starting11,
        resIndex,
        slotPos,
      });

      await fetchChemistry();
      await fetchRating();

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

  //! Kispad layout
  const benchLayout = [
    { id: "SUBGK", pos: "GK" },
    { id: "SUBDEF1", pos: "DEF" },
    { id: "SUBDEF2", pos: "DEF" },
    { id: "SUBMID1", pos: "MID" },
    { id: "SUBMID2", pos: "MID" },
    { id: "SUBATT1", pos: "ATT" },
    { id: "SUBATT2", pos: "ATT" },

    { id: "RES1", pos: "ANY" },
    { id: "RES2", pos: "ANY" },
    { id: "RES3", pos: "ANY" },
    { id: "RES4", pos: "ANY" },
    { id: "RES5", pos: "ANY" },
  ];

  //! Chemistry fetch-elése
  const fetchChemistry = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/chemistry",
      );
      setTeamChemistry(result.teamChemistry);

      const map = {};
      for (let i = 0; i < result.players.length; i++) {
        const p = result.players[i];
        map[p.player_id] = p.chemistry;
      }
      setPlayerChemMap(map);
    } catch (error) {
      console.log(error);
    }
  };

  //! Rating fetch-elése
  const fetchRating = async () => {
    try {
      const result = await getMethodFetch("http://127.0.0.1:3000/api/rating");
      setTeamRating(result.rating);
    } catch (error) {
      console.log(error);
    }
  };

  //! Chemistry Star-ok visszaadása
  const chemImg = (chem) => {
    if (chem === 3) return ThreeChem;
    if (chem === 2) return TwoChem;
    if (chem === 1) return OneChem;
    return ZeroChem;
  };

  //! Rating csillagok
  const ratingStars = (rating) => {
    if (rating >= 83) return "★★★★★";
    if (rating >= 75) return "★★★★☆";
    if (rating >= 69) return "★★★☆☆";
    if (rating >= 65) return "★★☆☆☆";
    if (rating >= 2) return "★☆☆☆☆";
    return "☆☆☆☆☆";
  };

  //! Pozíció átírása az aktuális pozícióra amin szerepel (ha van)
  const getDisplayedPosition = (player, slotPos) => {
    if (!player) return "";
    const positions = player.player_positions.split(",").map((p) => p.trim());
    const primary = positions[0] || "";
    if (!slotPos || slotPos === "ANY") return primary;
    if (positions.includes(slotPos)) return slotPos;
    return primary;
  };

  //! Játékosok swap-olása
  const handleSwapPlayers = async (fromKey, toKey) => {
    try {
      setAssignedPlayers((prev) => {
        const next = { ...prev };
        const a = next[fromKey];
        const b = next[toKey];

        next[fromKey] = b;
        next[toKey] = a;
        return next;
      });

      const getSlotPosByKey = (key) => {
        if (typeof key === "number") return gameLayout[key]?.pos;
        return benchLayout.find((s) => s.id === key)?.pos;
      };

      await putMethodFetch("http://127.0.0.1:3000/api/swap", {
        aId: assignedPlayers[fromKey].player_id,
        bId: assignedPlayers[toKey].player_id,
        aSlotPos: getSlotPosByKey(fromKey),
        bSlotPos: getSlotPosByKey(toKey),
      });

      await fetchChemistry();
      await fetchRating();
    } catch (error) {
      console.log(error);
    }
  };

  //! Draft vége
  useEffect(() => {
    if (!draftStarted || !gameLayout) {
      setDraftComplete(false);
      return;
    }

    const starting11Full = gameLayout.every((_, i) =>
      Boolean(assignedPlayers[i]),
    );
    const benchFull = benchLayout.every((slot) =>
      Boolean(assignedPlayers[slot.id]),
    );

    setDraftComplete(starting11Full && benchFull);
  }, [draftStarted, gameLayout, assignedPlayers]);

  //! Draft befejezése
  const handleSubmitDraft = async () => {
    try {
      setShowDraftSummary(true);

      const actualDraft = teamChemistry + teamRating;
      await postMethodFetch("http://127.0.0.1:3000/api/users/me/bestdraft", {
        rating: actualDraft,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //! Grafikon létrehozása
  const graphProgress =
    Math.max(0, Math.min((teamChemistry + teamRating) / 133, 1)) * 360;

  //! Visszatérés a menübe
  const handleExitToMenu = () => {
    try {
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
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      ></div>
                    ))}
                    {selectedFormation.layout.map((p, i) => (
                      <p
                        key={i}
                        className="posText"
                        style={{ left: p.x + "%", top: `calc(${p.y}% + 7.5%)` }}
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
        <div className="gameFormationLayout">
          {gameLayout.map((p, i) => (
            <div
              key={i}
              className="pos"
              style={{ left: p.x + "%", top: p.y + "%" }}
              id={p.pos}
              onClick={() => {
                if (assignedPlayers[i]) return;
                handlePosClick(i, p.pos);
              }}
              onDragOver={(e) => {
                if (!assignedPlayers[i]) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (!assignedPlayers[i]) return;
                const raw = e.dataTransfer.getData("text/plain");
                const fromKey =
                  dragFrom ??
                  (raw && !Number.isNaN(Number(raw)) ? Number(raw) : raw);

                if (fromKey === null || fromKey === undefined) return;
                if (fromKey === i) return;
                if (!assignedPlayers[fromKey]) return;

                handleSwapPlayers(fromKey, i);
              }}
            >
              {assignedPlayers[i] && (
                <div
                  className="cardSlot"
                  key={i}
                  draggable
                  onDragStart={(e) => {
                    setDragFrom(i);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(i));
                  }}
                  onDragEnd={() => setDragFrom(null)}
                >
                  <img
                    src={RareGold}
                    className="goldCard"
                    alt="Gold Card"
                  ></img>

                  <img
                    src={chemImg(playerChemMap[assignedPlayers[i].player_id])}
                    alt="Chemistry Stars"
                    className="chemStars"
                  />

                  <p className="cardOverall">{assignedPlayers[i].overall}</p>
                  <p className="cardPosition">
                    {getDisplayedPosition(
                      assignedPlayers[i],
                      gameLayout[i].pos,
                    )}
                  </p>
                  <img
                    className="cardImg"
                    alt="Player Image"
                    src={assignedPlayers[i].player_face_url}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = AltPlayerImg;
                    }}
                  ></img>
                  <img
                    className="cardNationality"
                    alt="Player Nationality"
                    src={assignedPlayers[i].nation_url}
                    referrerPolicy="no-referrer"
                  ></img>
                  <img
                    className="cardLeague"
                    alt="Player League"
                    src={assignedPlayers[i].league_url}
                    referrerPolicy="no-referrer"
                  ></img>
                  <img
                    className="cardClub"
                    alt="Player Club"
                    src={assignedPlayers[i].club_team_url}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      if (assignedPlayers[i].club_name === "Inter") {
                        e.currentTarget.src = InterMilan;
                      }
                      if (assignedPlayers[i].club_name === "AC Milan") {
                        e.currentTarget.src = ACMilan;
                      }
                      if (assignedPlayers[i].club_name === "Lazio") {
                        e.currentTarget.src = Lazio;
                      }
                      if (assignedPlayers[i].club_name === "Atalanta") {
                        e.currentTarget.src = Atalanta;
                      }
                    }}
                  ></img>
                  <p className="cardName">{assignedPlayers[i].short_name}</p>

                  {assignedPlayers[i].player_positions === "GK" ? (
                    <>
                      <div className="cardPlayerDiving">
                        <p className="cardPlayerDivingNumber">
                          {assignedPlayers[i].goalkeeping_diving}
                        </p>
                        <p className="cardPlayerDivingText">DIV</p>
                      </div>
                      <div className="cardPlayerHandling">
                        <p className="cardPlayerHandlingNumber">
                          {assignedPlayers[i].goalkeeping_handling}
                        </p>
                        <p className="cardPlayerHandlingText">HAN</p>
                      </div>
                      <div className="cardPlayerKicking">
                        <p className="cardPlayerKickingNumber">
                          {assignedPlayers[i].goalkeeping_kicking}
                        </p>
                        <p className="cardPlayerKickingText">KIC</p>
                      </div>
                      <div className="cardPlayerReflexes">
                        <p className="cardPlayerReflexesNumber">
                          {assignedPlayers[i].goalkeeping_reflexes}
                        </p>
                        <p className="cardPlayerReflexesText">REF</p>
                      </div>
                      <div className="cardPlayerSpeed">
                        <p className="cardPlayerSpeedNumber">
                          {assignedPlayers[i].goalkeeping_speed}
                        </p>
                        <p className="cardPlayerSpeedText">SPD</p>
                      </div>
                      <div className="cardPlayerPositioning">
                        <p className="cardPlayerPositioningNumber">
                          {assignedPlayers[i].goalkeeping_positioning}
                        </p>
                        <p className="cardPlayerPositioningText">POS</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="cardPlayerPace">
                        <p className="cardPlayerPaceNumber">
                          {assignedPlayers[i].pace}
                        </p>
                        <p className="cardPlayerPaceText">PAC</p>
                      </div>
                      <div className="cardPlayerShooting">
                        <p className="cardPlayerShootingNumber">
                          {assignedPlayers[i].shooting}
                        </p>
                        <p className="cardPlayerShootingText">SHO</p>
                      </div>
                      <div className="cardPlayerDribbling">
                        <p className="cardPlayerDribblingNumber">
                          {assignedPlayers[i].dribbling}
                        </p>
                        <p className="cardPlayerDribblingText">DRI</p>
                      </div>
                      <div className="cardPlayerPassing">
                        <p className="cardPlayerPassingNumber">
                          {assignedPlayers[i].passing}
                        </p>
                        <p className="cardPlayerPassingText">PAS</p>
                      </div>
                      <div className="cardPlayerDefending">
                        <p className="cardPlayerDefendingNumber">
                          {assignedPlayers[i].defending}
                        </p>
                        <p className="cardPlayerDefendingText">DEF</p>
                      </div>
                      <div className="cardPlayerPhysic">
                        <p className="cardPlayerPhysicNumber">
                          {assignedPlayers[i].physic}
                        </p>
                        <p className="cardPlayerPhysicText">PHY</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {gameLayout.map((p, i) => (
            <p
              key={i}
              className="posText"
              style={{ left: p.x + "%", top: `calc(${p.y}% + 6%)` }}
            >
              {p.pos}
            </p>
          ))}
          {showPlayerSelectionModal &&
            createPortal(
              <div className="modalOverlay">
                <div className="playerSelectionModal">
                  {playerOptons.map((player, i) => {
                    const mainPosition = player.player_positions.split(", ")[0];

                    return (
                      <div
                        className="cardSlot"
                        key={i}
                        onClick={() =>
                          captainPick
                            ? handleCaptainSelect(player)
                            : handlePlayerSelect(player)
                        }
                      >
                        <img
                          src={RareGold}
                          className="goldCard"
                          alt="Gold Card"
                        ></img>

                        <p className="cardOverall">{player.overall}</p>
                        <p className="cardPosition">{mainPosition}</p>
                        <img
                          className="cardImg"
                          alt="Player Image"
                          src={player.player_face_url}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = AltPlayerImg;
                          }}
                        ></img>
                        <img
                          className="cardNationality"
                          alt="Player Nationality"
                          src={player.nation_url}
                          referrerPolicy="no-referrer"
                        ></img>
                        <img
                          className="cardLeague"
                          alt="Player League"
                          src={player.league_url}
                          referrerPolicy="no-referrer"
                        ></img>
                        <img
                          className="cardClub"
                          alt="Player Club"
                          src={player.club_team_url}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            if (player.club_name === "Inter") {
                              e.currentTarget.src = InterMilan;
                            }
                            if (player.club_name === "AC Milan") {
                              e.currentTarget.src = ACMilan;
                            }
                            if (player.club_name === "Lazio") {
                              e.currentTarget.src = Lazio;
                            }
                            if (player.club_name === "Atalanta") {
                              e.currentTarget.src = Atalanta;
                            }
                          }}
                        ></img>
                        <p className="cardName">{player.short_name}</p>

                        {mainPosition === "GK" ? (
                          <>
                            <div className="cardPlayerDiving">
                              <p className="cardPlayerDivingNumber">
                                {player.goalkeeping_diving}
                              </p>
                              <p className="cardPlayerDivingText">DIV</p>
                            </div>
                            <div className="cardPlayerHandling">
                              <p className="cardPlayerHandlingNumber">
                                {player.goalkeeping_handling}
                              </p>
                              <p className="cardPlayerHandlingText">HAN</p>
                            </div>
                            <div className="cardPlayerKicking">
                              <p className="cardPlayerKickingNumber">
                                {player.goalkeeping_kicking}
                              </p>
                              <p className="cardPlayerKickingText">KIC</p>
                            </div>
                            <div className="cardPlayerReflexes">
                              <p className="cardPlayerReflexesNumber">
                                {player.goalkeeping_reflexes}
                              </p>
                              <p className="cardPlayerReflexesText">REF</p>
                            </div>
                            <div className="cardPlayerSpeed">
                              <p className="cardPlayerSpeedNumber">
                                {player.goalkeeping_speed}
                              </p>
                              <p className="cardPlayerSpeedText">SPD</p>
                            </div>
                            <div className="cardPlayerPositioning">
                              <p className="cardPlayerPositioningNumber">
                                {player.goalkeeping_positioning}
                              </p>
                              <p className="cardPlayerPositioningText">POS</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="cardPlayerPace">
                              <p className="cardPlayerPaceNumber">
                                {player.pace}
                              </p>
                              <p className="cardPlayerPaceText">PAC</p>
                            </div>
                            <div className="cardPlayerShooting">
                              <p className="cardPlayerShootingNumber">
                                {player.shooting}
                              </p>
                              <p className="cardPlayerShootingText">SHO</p>
                            </div>
                            <div className="cardPlayerDribbling">
                              <p className="cardPlayerDribblingNumber">
                                {player.dribbling}
                              </p>
                              <p className="cardPlayerDribblingText">DRI</p>
                            </div>
                            <div className="cardPlayerPassing">
                              <p className="cardPlayerPassingNumber">
                                {player.passing}
                              </p>
                              <p className="cardPlayerPassingText">PAS</p>
                            </div>
                            <div className="cardPlayerDefending">
                              <p className="cardPlayerDefendingNumber">
                                {player.defending}
                              </p>
                              <p className="cardPlayerDefendingText">DEF</p>
                            </div>
                            <div className="cardPlayerPhysic">
                              <p className="cardPlayerPhysicNumber">
                                {player.physic}
                              </p>
                              <p className="cardPlayerPhysicText">PHY</p>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>,
              document.body,
            )}
        </div>
      )}

      {/* Kispad */}
      {draftStarted &&
        gameLayout &&
        createPortal(
          <div
            className={`subBar ${openSubs ? "open" : ""}`}
            id="subBar"
            onMouseEnter={() => setOpenSubs(true)}
            onMouseLeave={() => setOpenSubs(false)}
          >
            <button
              className="subBarTab"
              onClick={() => setOpenSubs((prev) => !prev)}
              aria-expanded={open}
            >
              SUB / RES
            </button>

            <div className="subBarContent">
              <h4 className="subresText">SUB</h4>
              {benchLayout.slice(0, 7).map((slot) => (
                <div
                  key={slot.id}
                  className="pos"
                  id={slot.pos}
                  onClick={() => {
                    if (assignedPlayers[slot.id]) return;
                    handlePosClick(slot.id, slot.pos);
                  }}
                  onDragOver={(e) => {
                    if (!assignedPlayers[slot.id]) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!assignedPlayers[slot.id]) return;
                    const raw = e.dataTransfer.getData("text/plain");
                    const fromKey =
                      dragFrom ??
                      (raw && !Number.isNaN(Number(raw)) ? Number(raw) : raw);

                    if (fromKey === null || fromKey === undefined) return;
                    if (fromKey === slot.id) return;
                    if (!assignedPlayers[fromKey]) return;

                    handleSwapPlayers(fromKey, slot.id);
                  }}
                >
                  {assignedPlayers[slot.id] && (
                    <div
                      className="cardSlot"
                      draggable
                      onDragStart={(e) => {
                        setDragFrom(slot.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(slot.id));
                      }}
                      onDragEnd={() => setDragFrom(null)}
                    >
                      <img
                        src={RareGold}
                        className="goldCard"
                        alt="Gold Card"
                      ></img>

                      <p className="cardOverall">
                        {assignedPlayers[slot.id].overall}
                      </p>
                      <p className="cardPosition">
                        {
                          assignedPlayers[slot.id].player_positions.split(
                            ", ",
                          )[0]
                        }
                      </p>
                      <img
                        className="cardImg"
                        alt="Player Image"
                        src={assignedPlayers[slot.id].player_face_url}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = AltPlayerImg;
                        }}
                      ></img>
                      <img
                        className="cardNationality"
                        alt="Player Nationality"
                        src={assignedPlayers[slot.id].nation_url}
                        referrerPolicy="no-referrer"
                      ></img>
                      <img
                        className="cardLeague"
                        alt="Player League"
                        src={assignedPlayers[slot.id].league_url}
                        referrerPolicy="no-referrer"
                      ></img>
                      <img
                        className="cardClub"
                        alt="Player Club"
                        src={assignedPlayers[slot.id].club_team_url}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (assignedPlayers[slot.id].club_name === "Inter") {
                            e.currentTarget.src = InterMilan;
                          }
                          if (
                            assignedPlayers[slot.id].club_name === "AC Milan"
                          ) {
                            e.currentTarget.src = ACMilan;
                          }
                          if (assignedPlayers[slot.id].club_name === "Lazio") {
                            e.currentTarget.src = Lazio;
                          }
                          if (
                            assignedPlayers[slot.id].club_name === "Atalanta"
                          ) {
                            e.currentTarget.src = Atalanta;
                          }
                        }}
                      ></img>
                      <p className="cardName">
                        {assignedPlayers[slot.id].short_name}
                      </p>

                      {assignedPlayers[slot.id].player_positions === "GK" ? (
                        <>
                          <div className="cardPlayerDiving">
                            <p className="cardPlayerDivingNumber">
                              {assignedPlayers[slot.id].goalkeeping_diving}
                            </p>
                            <p className="cardPlayerDivingText">DIV</p>
                          </div>
                          <div className="cardPlayerHandling">
                            <p className="cardPlayerHandlingNumber">
                              {assignedPlayers[slot.id].goalkeeping_handling}
                            </p>
                            <p className="cardPlayerHandlingText">HAN</p>
                          </div>
                          <div className="cardPlayerKicking">
                            <p className="cardPlayerKickingNumber">
                              {assignedPlayers[slot.id].goalkeeping_kicking}
                            </p>
                            <p className="cardPlayerKickingText">KIC</p>
                          </div>
                          <div className="cardPlayerReflexes">
                            <p className="cardPlayerReflexesNumber">
                              {assignedPlayers[slot.id].goalkeeping_reflexes}
                            </p>
                            <p className="cardPlayerReflexesText">REF</p>
                          </div>
                          <div className="cardPlayerSpeed">
                            <p className="cardPlayerSpeedNumber">
                              {assignedPlayers[slot.id].goalkeeping_speed}
                            </p>
                            <p className="cardPlayerSpeedText">SPD</p>
                          </div>
                          <div className="cardPlayerPositioning">
                            <p className="cardPlayerPositioningNumber">
                              {assignedPlayers[slot.id].goalkeeping_positioning}
                            </p>
                            <p className="cardPlayerPositioningText">POS</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="cardPlayerPace">
                            <p className="cardPlayerPaceNumber">
                              {assignedPlayers[slot.id].pace}
                            </p>
                            <p className="cardPlayerPaceText">PAC</p>
                          </div>
                          <div className="cardPlayerShooting">
                            <p className="cardPlayerShootingNumber">
                              {assignedPlayers[slot.id].shooting}
                            </p>
                            <p className="cardPlayerShootingText">SHO</p>
                          </div>
                          <div className="cardPlayerDribbling">
                            <p className="cardPlayerDribblingNumber">
                              {assignedPlayers[slot.id].dribbling}
                            </p>
                            <p className="cardPlayerDribblingText">DRI</p>
                          </div>
                          <div className="cardPlayerPassing">
                            <p className="cardPlayerPassingNumber">
                              {assignedPlayers[slot.id].passing}
                            </p>
                            <p className="cardPlayerPassingText">PAS</p>
                          </div>
                          <div className="cardPlayerDefending">
                            <p className="cardPlayerDefendingNumber">
                              {assignedPlayers[slot.id].defending}
                            </p>
                            <p className="cardPlayerDefendingText">DEF</p>
                          </div>
                          <div className="cardPlayerPhysic">
                            <p className="cardPlayerPhysicNumber">
                              {assignedPlayers[slot.id].physic}
                            </p>
                            <p className="cardPlayerPhysicText">PHY</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <h4 className="subresText">RES</h4>
              {benchLayout.slice(7).map((slot) => (
                <div
                  key={slot.id}
                  className="pos"
                  id={slot.pos}
                  onClick={() => {
                    if (assignedPlayers[slot.id]) return;
                    handlePosClick(slot.id, slot.pos);
                  }}
                  onDragOver={(e) => {
                    if (!assignedPlayers[slot.id]) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!assignedPlayers[slot.id]) return;
                    const raw = e.dataTransfer.getData("text/plain");
                    const fromKey =
                      dragFrom ??
                      (raw && !Number.isNaN(Number(raw)) ? Number(raw) : raw);

                    if (fromKey === null || fromKey === undefined) return;
                    if (fromKey === slot.id) return;
                    if (!assignedPlayers[fromKey]) return;

                    handleSwapPlayers(fromKey, slot.id);
                  }}
                >
                  {assignedPlayers[slot.id] && (
                    <div
                      className="cardSlot"
                      draggable
                      onDragStart={(e) => {
                        setDragFrom(slot.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(slot.id));
                      }}
                      onDragEnd={() => setDragFrom(null)}
                    >
                      <img
                        src={RareGold}
                        className="goldCard"
                        alt="Gold Card"
                      ></img>

                      <p className="cardOverall">
                        {assignedPlayers[slot.id].overall}
                      </p>
                      <p className="cardPosition">
                        {
                          assignedPlayers[slot.id].player_positions.split(
                            ", ",
                          )[0]
                        }
                      </p>
                      <img
                        className="cardImg"
                        alt="Player Image"
                        src={assignedPlayers[slot.id].player_face_url}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = AltPlayerImg;
                        }}
                      ></img>
                      <img
                        className="cardNationality"
                        alt="Player Nationality"
                        src={assignedPlayers[slot.id].nation_url}
                        referrerPolicy="no-referrer"
                      ></img>
                      <img
                        className="cardLeague"
                        alt="Player League"
                        src={assignedPlayers[slot.id].league_url}
                        referrerPolicy="no-referrer"
                      ></img>
                      <img
                        className="cardClub"
                        alt="Player Club"
                        src={assignedPlayers[slot.id].club_team_url}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (assignedPlayers[slot.id].club_name === "Inter") {
                            e.currentTarget.src = InterMilan;
                          }
                          if (
                            assignedPlayers[slot.id].club_name === "AC Milan"
                          ) {
                            e.currentTarget.src = ACMilan;
                          }
                          if (assignedPlayers[slot.id].club_name === "Lazio") {
                            e.currentTarget.src = Lazio;
                          }
                          if (
                            assignedPlayers[slot.id].club_name === "Atalanta"
                          ) {
                            e.currentTarget.src = Atalanta;
                          }
                        }}
                      ></img>
                      <p className="cardName">
                        {assignedPlayers[slot.id].short_name}
                      </p>

                      {assignedPlayers[slot.id].player_positions === "GK" ? (
                        <>
                          <div className="cardPlayerDiving">
                            <p className="cardPlayerDivingNumber">
                              {assignedPlayers[slot.id].goalkeeping_diving}
                            </p>
                            <p className="cardPlayerDivingText">DIV</p>
                          </div>
                          <div className="cardPlayerHandling">
                            <p className="cardPlayerHandlingNumber">
                              {assignedPlayers[slot.id].goalkeeping_handling}
                            </p>
                            <p className="cardPlayerHandlingText">HAN</p>
                          </div>
                          <div className="cardPlayerKicking">
                            <p className="cardPlayerKickingNumber">
                              {assignedPlayers[slot.id].goalkeeping_kicking}
                            </p>
                            <p className="cardPlayerKickingText">KIC</p>
                          </div>
                          <div className="cardPlayerReflexes">
                            <p className="cardPlayerReflexesNumber">
                              {assignedPlayers[slot.id].goalkeeping_reflexes}
                            </p>
                            <p className="cardPlayerReflexesText">REF</p>
                          </div>
                          <div className="cardPlayerSpeed">
                            <p className="cardPlayerSpeedNumber">
                              {assignedPlayers[slot.id].goalkeeping_speed}
                            </p>
                            <p className="cardPlayerSpeedText">SPD</p>
                          </div>
                          <div className="cardPlayerPositioning">
                            <p className="cardPlayerPositioningNumber">
                              {assignedPlayers[slot.id].goalkeeping_positioning}
                            </p>
                            <p className="cardPlayerPositioningText">POS</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="cardPlayerPace">
                            <p className="cardPlayerPaceNumber">
                              {assignedPlayers[slot.id].pace}
                            </p>
                            <p className="cardPlayerPaceText">PAC</p>
                          </div>
                          <div className="cardPlayerShooting">
                            <p className="cardPlayerShootingNumber">
                              {assignedPlayers[slot.id].shooting}
                            </p>
                            <p className="cardPlayerShootingText">SHO</p>
                          </div>
                          <div className="cardPlayerDribbling">
                            <p className="cardPlayerDribblingNumber">
                              {assignedPlayers[slot.id].dribbling}
                            </p>
                            <p className="cardPlayerDribblingText">DRI</p>
                          </div>
                          <div className="cardPlayerPassing">
                            <p className="cardPlayerPassingNumber">
                              {assignedPlayers[slot.id].passing}
                            </p>
                            <p className="cardPlayerPassingText">PAS</p>
                          </div>
                          <div className="cardPlayerDefending">
                            <p className="cardPlayerDefendingNumber">
                              {assignedPlayers[slot.id].defending}
                            </p>
                            <p className="cardPlayerDefendingText">DEF</p>
                          </div>
                          <div className="cardPlayerPhysic">
                            <p className="cardPlayerPhysicNumber">
                              {assignedPlayers[slot.id].physic}
                            </p>
                            <p className="cardPlayerPhysicText">PHY</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.getElementById("root2"),
        )}

      {/* Rating & Chemistry Display */}
      {draftStarted &&
        gameLayout &&
        createPortal(
          <div className="chemRatingDisplay">
            <h4 className="draftSquadText">Draft Squad</h4>
            <div className="ratingStars">{ratingStars(teamRating)}</div>
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
          </div>,
          document.body,
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
              <div className="draftSummaryTitle">Draft Summary</div>
              <div className="draftSummaryStats">
                <div className="draftGraphDiv">
                  <div
                    className="draftGraph"
                    style={{
                      background: `conic-gradient(rgb(0, 255, 251) ${graphProgress}deg, rgba(0, 255, 251, 0.26) ${graphProgress}deg)`,
                    }}
                  >
                    <div className="ratingInner">
                      <div>Squad</div>
                      <div>Rating</div>
                      <strong>{teamChemistry + teamRating}</strong>
                    </div>
                  </div>
                </div>
                <div className="vl"></div>
                <div className="draftNumbers">
                  <div className="ratingStars">{ratingStars(teamRating)}</div>
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
                  <button className="exitButton" onClick={handleExitToMenu}>
                    Exit
                  </button>
                </div>
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
    const response = await fetch(url);
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
