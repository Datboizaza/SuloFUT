import { useEffect, useState } from "react";
import "./Draft.css";
import RareGold from "./assets/goldRare.png";

function Draft() {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [gameLayout, setGameLayout] = useState(null);

  const [showPlayerSelectionModal, setShowPlayerSelectionModal] =
    useState(false);
  const [captainOptions, setCaptainOptions] = useState([]);
  const [assignedPlayers, setAssignedPlayers] = useState({});

  const [draftStarted, setDraftStarted] = useState(false);

  //! Formációk betöltése
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

  //! Formáció kiválasztása
  const handleFormationHover = (formation) => {
    setSelectedFormation(formation);
  };

  //! Játék elkezdése
  const startDraft = async (formation) => {
    setGameLayout(formation.layout);
    setSelectedFormation(formation);
    setDraftStarted(true);

    setTimeout(async () => {
      await chooseCaptain();
      setShowPlayerSelectionModal(true);
    }, 500);
  };

  //! Csapatkapitányok betöltése
  const chooseCaptain = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/randomplayers",
      );
      setCaptainOptions(result.randomjatekosok);
    } catch (error) {
      console.log(error);
    }
  };

  //! Csapatkapitány kiválasztása
  const handleCaptainSelect = async (player) => {
    try {
      await postMethodFetch(
        "http://127.0.0.1:3000/api/draftselectedplayers",
        player,
      );

      setShowPlayerSelectionModal(false);

      assignCaptain();
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
          console.log("Kispad");
          return;
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

  return (
    <>
      {/* Formáció kiválasztása */}
      {!draftStarted && (
        <div id="formationSelectDiv">
          <div className="row">
            {/* Bal oldal */}
            <div className="col-4" id="chooseFormation">
              <h3>Choose a formation</h3>

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
                      ></div>
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
            >
              {assignedPlayers[i] &&
                (assignedPlayers[i].player_positions.split(", ")[0] === "GK" ? (
                  <div className="assignedPlayer">
                    <p className="assignedPlayerOverall">
                      {assignedPlayers[i].overall}
                    </p>
                    <p className="assignedPlayerPosition">
                      {assignedPlayers[i].player_positions.split(", ")[0]}
                    </p>
                    <img
                      className="assignedPlayerImage"
                      src={assignedPlayers[i].player_face_url}
                      referrerPolicy="no-referrer"
                    ></img>
                    <p className="assignedPlayerShortName">
                      {assignedPlayers[i].short_name}
                    </p>
                    <div className="assignedPlayerDiving">
                      <p className="assignedPlayerDivingNumber">
                        {assignedPlayers[i].goalkeeping_diving}
                      </p>
                      <p className="assignedPlayerDivingText">DIV</p>
                    </div>
                    <div className="assignedPlayerHandling">
                      <p className="assignedPlayerHandlingNumber">
                        {assignedPlayers[i].goalkeeping_handling}
                      </p>
                      <p className="assignedPlayerHandlingText">HAN</p>
                    </div>
                    <div className="assignedPlayerKicking">
                      <p className="assignedPlayerKickingNumber">
                        {assignedPlayers[i].goalkeeping_kicking}
                      </p>
                      <p className="assignedPlayerKickingText">KIC</p>
                    </div>
                    <div className="assignedPlayerReflexes">
                      <p className="assignedPlayerReflexesNumber">
                        {assignedPlayers[i].goalkeeping_reflexes}
                      </p>
                      <p className="assignedPlayerReflexesText">REF</p>
                    </div>
                    <div className="assignedPlayerSpeed">
                      <p className="assignedPlayerSpeedNumber">
                        {assignedPlayers[i].goalkeeping_speed}
                      </p>
                      <p className="assignedPlayerSpeedText">SPD</p>
                    </div>
                    <div className="assignedPlayerPositioning">
                      <p className="assignedPlayerPositioningNumber">
                        {assignedPlayers[i].goalkeeping_positioning}
                      </p>
                      <p className="assignedPlayerPositioningText">POS</p>
                    </div>
                    <p className="assignedPlayerNationality">
                      {assignedPlayers[i].nationality_name}
                    </p>
                    <p className="assignedPlayerLeague">
                      {assignedPlayers[i].league_name}
                    </p>
                    <p className="assignedPlayerClub">
                      {assignedPlayers[i].club_name}
                    </p>
                  </div>
                ) : (
                  <div className="assignedPlayer">
                    <p className="assignedPlayerOverall">
                      {assignedPlayers[i].overall}
                    </p>
                    <p className="assignedPlayerPosition">
                      {assignedPlayers[i].player_positions.split(", ")[0]}
                    </p>
                    <img
                      className="assignedPlayerImage"
                      src={assignedPlayers[i].player_face_url}
                      referrerPolicy="no-referrer"
                    ></img>
                    <p className="assignedPlayerShortName">
                      {assignedPlayers[i].short_name}
                    </p>
                    <div className="assignedPlayerPace">
                      <p className="assignedPlayerPaceNumber">
                        {assignedPlayers[i].pace}
                      </p>
                      <p className="assignedPlayerPaceText">PAC</p>
                    </div>
                    <div className="assignedPlayerShooting">
                      <p className="assignedPlayerShootingNumber">
                        {assignedPlayers[i].shooting}
                      </p>
                      <p className="assignedPlayerShootingText">SHO</p>
                    </div>
                    <div className="assignedPlayerDribbling">
                      <p className="assignedPlayerDribblingNumber">
                        {assignedPlayers[i].dribbling}
                      </p>
                      <p className="assignedPlayerDribblingText">DRI</p>
                    </div>
                    <div className="assignedPlayerPassing">
                      <p className="assignedPlayerPassingNumber">
                        {assignedPlayers[i].passing}
                      </p>
                      <p className="assignedPlayerPassingText">PAS</p>
                    </div>
                    <div className="assignedPlayerDefending">
                      <p className="assignedPlayerDefendingNumber">
                        {assignedPlayers[i].defending}
                      </p>
                      <p className="assignedPlayerDefendingText">DEF</p>
                    </div>
                    <div className="assignedPlayerPhysic">
                      <p className="assignedPlayerPhysicNumber">
                        {assignedPlayers[i].physic}
                      </p>
                      <p className="assignedPlayerPhysicText">PHY</p>
                    </div>
                    <p className="assignedPlayerNationality">
                      {assignedPlayers[i].nationality_name}
                    </p>
                    <p className="assignedPlayerLeague">
                      {assignedPlayers[i].league_name}
                    </p>
                    <p className="assignedPlayerClub">
                      {assignedPlayers[i].club_name}
                    </p>
                  </div>
                ))}
            </div>
          ))}

          {gameLayout.map((p, i) => (
            <p
              key={i}
              className="posText"
              style={{ left: p.x + "%", top: `calc(${p.y}% + 9%)` }}
            >
              {p.pos}
            </p>
          ))}

          {showPlayerSelectionModal && (
            <div className="playerSelectionModal">
              {captainOptions.map((player, i) => {
                const mainPosition = player.player_positions.split(", ")[0];

                return (
                  <div
                    key={i}
                    className="playerSlot"
                    onClick={() => handleCaptainSelect(player)}
                  >
                    <div className="cardLayout">
                      <img src={RareGold} className="goldCard"></img>

                      <p className="cardOverall">{player.overall}</p>
                      <p className="cardPosition">{mainPosition}</p>
                      <img
                        className="cardImg"
                        src={player.player_face_url}
                        referrerPolicy="no-referrer"
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

                      <p className="cardNationality">
                        {player.nationality_name}
                      </p>
                      <p className="cardLeague">{player.league_name}</p>
                      <p className="cardClub">{player.club_name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}

const getMethodFetch = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("GET hiba");
  }
  return await response.json();
};

const postMethodFetch = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("POST hiba");
  }
  return await response.json();
};

export default Draft;
