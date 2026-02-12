import { useEffect, useState } from "react";
import "./Draft.css";

function Draft() {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [gameLayout, setGameLayout] = useState(null);

  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [captainOptions, setCaptainOptions] = useState([]);
  const [assignedPlayers, setAssignedPlayers] = useState({});

  const [draftStarted, setDraftStarted] = useState(false);

  // FORMATIONS BETÖLTÉSE
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

  // FORMATION SELECT
  const handleFormationHover = (formation) => {
    setSelectedFormation(formation);
  };

  const startDraft = async (formation) => {
    setGameLayout(formation.layout);
    setSelectedFormation(formation);
    setDraftStarted(true);

    setTimeout(async () => {
      await chooseCaptain();
      setShowCaptainModal(true);
    }, 500);
  };

  // CAPTAIN OPTIONS BETÖLTÉSE
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

  // CAPTAIN KIVÁLASZTÁS
  const handleCaptainSelect = async (player) => {
    try {
      await postMethodFetch(
        "http://127.0.0.1:3000/api/draftselectedplayers",
        player,
      );

      setShowCaptainModal(false);

      assignCaptain();
    } catch (error) {
      console.log(error);
    }
  };

  // CAPTAIN HOZZÁRENDELÉS
  const assignCaptain = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/draftselectedplayers",
      );

      const player = result.draftselectedplayers[0];
      const mainPosition = player.player_positions.split(", ")[0];

      const firstIndex = gameLayout.findIndex((p) => p.pos === mainPosition);
      console.log();
      if (firstIndex === -1) {
        let alternateIndex;
        for (let i = 0; i < player.player_positions.split(", ").length; i++) {
          alternateIndex = gameLayout.findIndex(
            (p) => p.pos === player.player_positions.split(", ")[i],
          );
        }
        if (alternateIndex === -1) {
          console.log(
            "Nincs olyan pozíció, amelyben ez a játékos játszani tud.",
          );
          return;
        } else {
          console.log("Van olyan alternatív pozíciója, amiben tud játszani.");
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
      {/* ----------------- FORMATION SELECT ----------------- */}
      {!draftStarted && (
        <div id="formationSelectDiv">
          <div className="row">
            {/* BAL OLDAL */}
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

            {/* JOBB OLDAL */}
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
                      >
                        {assignedPlayers[p.pos] && (
                          <div className="assignedPlayer">
                            {assignedPlayers[p.pos].short_name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- GAME LAYOUT ----------------- */}
      {draftStarted && gameLayout && (
        <div className="gameFormationLayout">
          {gameLayout.map((p, i) => (
            <div
              key={i}
              className="pos"
              style={{ left: p.x + "%", top: p.y + "%" }}
            >
              {assignedPlayers[i] && (
                <div className="assignedPlayer">
                  {assignedPlayers[i].short_name}
                </div>
              )}
            </div>
          ))}

          {gameLayout.map((p, i) => (
            <p
              key={i}
              className="posText"
              style={{ left: p.x + "%", top: `calc(${p.y}% + 7%)` }}
            >
              {p.pos}
            </p>
          ))}

          {showCaptainModal && (
            <div className="playerSelectionModal">
              {captainOptions.map((player, i) => {
                const mainPosition = player.player_positions.split(", ")[0];

                return (
                  <div
                    key={i}
                    className="playerSlot"
                    onClick={() => handleCaptainSelect(player)}
                  >
                    <p>{player.overall}</p>
                    <p>{mainPosition}</p>
                    <p>{player.nationality_name}</p>
                    <p>{player.club_name}</p>
                    <p>{player.short_name}</p>

                    {mainPosition === "GK" ? (
                      <>
                        <p>{player.goalkeeping_diving} DIV</p>
                        <p>{player.goalkeeping_handling} HAN</p>
                        <p>{player.goalkeeping_kicking} KIC</p>
                        <p>{player.goalkeeping_reflexes} REF</p>
                        <p>{player.goalkeeping_speed} SPD</p>
                        <p>{player.goalkeeping_positioning} POS</p>
                      </>
                    ) : (
                      <>
                        <p>{player.pace} PAC</p>
                        <p>{player.shooting} SHO</p>
                        <p>{player.dribbling} DRI</p>
                        <p>{player.passing} PAS</p>
                        <p>{player.defending} DEF</p>
                        <p>{player.physic} PHY</p>
                      </>
                    )}
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
