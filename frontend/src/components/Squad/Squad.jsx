import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Squad.css";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import RatingChemDisplay from "../RatingChemDisplay/RatingChemDisplay.jsx";
import Gamelayout from "../Gamelayout/Gamelayout.jsx";
import Subbar from "../Subbar/Subbar.jsx";
import Grab from "../Grab/Grab.jsx";
import PlayersModal from "../PlayersModal/PlayersModal.jsx";
import { useDrag } from "../../utilities/useDrag.js";
import {
  chemImg,
  ratingStars,
  fetchChemistry,
  fetchRatingWOSub,
  displayedPosition,
  benchLayout,
  fetchRating,
} from "../../utilities/utilities.js";

function Squad() {
  const [formations, setFormations] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [gameLayout, setGameLayout] = useState(null);
  const [assignedPlayers, setAssignedPlayers] = useState({});
  const [clubPlayers, setClubPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [teamChemistry, setTeamChemistry] = useState(0);
  const [teamRating, setTeamRating] = useState(0);
  const [playerChemMap, setPlayerChemMap] = useState({});
  const [openSubs, setOpenSubs] = useState(false);
  const [squadName, setSquadName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [openFormationSelect, setOpenFormationSelect] = useState(false);

  //! Betöltés squad és formations
  useEffect(() => {
    const fetchData = async () => {
      const formationRes = await getMethodFetch(
        "http://127.0.0.1:3000/api/formations",
      );
      setFormations(formationRes.formations);

      const squadRes = await getMethodFetch(
        "http://127.0.0.1:3000/api/myclub/squad",
      );
      const squad = squadRes.squad;
      setSquadName(squad.squadName);
      const foundFormation = formationRes.formations.find(
        (f) => f.formation === squad.squadFormation,
      );
      if (foundFormation) {
        setSelectedFormation(foundFormation);
        setGameLayout(foundFormation.layout);
        if (squad.squadPlayers) {
          const parsed = JSON.parse(squad.squadPlayers);
          setAssignedPlayers(parsed);
        }
      }
    };

    fetchData();
  }, []);

  //! Játékosok betöltése az adatbázisból
  useEffect(() => {
    if (!gameLayout || Object.keys(assignedPlayers).length === 0) return;
    const loadPlayersToDraft = async (playersObj) => {
      const players = Object.entries(playersObj);
      for (const [key, player] of players) {
        const parsedKey = Number(key);
        const starting11 = !isNaN(parsedKey);
        const resIndex =
          key === "RES1" ||
          key === "RES2" ||
          key === "RES3" ||
          key === "RES4" ||
          key === "RES5";
        const slotPos = starting11
          ? gameLayout[parsedKey]?.pos
          : benchLayout.find((s) => s.id === key || s.id === parsedKey)?.pos;

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
    };

    const load = async () => {
      await fetch("http://127.0.0.1:3000/api/draft/draftselectedplayers", {
        method: "DELETE",
      });
      await loadPlayersToDraft(assignedPlayers);
      const { teamChemistry, playerChemMap } = await fetchChemistry();
      setTeamChemistry(teamChemistry);
      setPlayerChemMap(playerChemMap);
      const rating = await fetchRatingWOSub();
      setTeamRating(rating);
    };

    load();
  }, [gameLayout, assignedPlayers]);

  //! Squad name mentés
  const handleSaveName = async () => {
    setIsEditingName(false);

    await postMethodFetch("http://127.0.0.1:3000/api/myclub/squad/updatename", {
      squadName,
    });
  };

  //! Formáció váltás és mentés
  const handleFormationChange = async (formation) => {
    setSelectedFormation(formation);
    setGameLayout(formation.layout);

    await postMethodFetch(
      "http://127.0.0.1:3000/api/myclub/squad/updateformation",
      {
        formation: formation.formation,
      },
    );
  };

  //! Pozíció click
  const handlePosClick = async (index) => {
    setSelectedIndex(index);

    const result = await getMethodFetch("http://127.0.0.1:3000/api/myclub");
    const assignedIds = Object.values(assignedPlayers).map(
      (player) => player.player_id,
    );
    const filtered = result.filter(
      (player) => !assignedIds.includes(player.player_id),
    );

    setClubPlayers(filtered);
    setShowModal(true);
  };

  //! Player select
  const handlePlayerSelect = async (player) => {
    try {
      const existingPlayer = assignedPlayers[selectedIndex];

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
      const rating = await fetchRating();
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

  //! Swap
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

  //! Drag-elés
  const { isDragging, dragKey, dragPos, startDrag } = useDrag(
    assignedPlayers,
    handleSwapPlayers,
  );

  //! Squad mentés
  const handleSave = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/myclub/squad/save", {
        players: assignedPlayers,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Háttér */}
      <div className="sbcBackground"></div>

      <div className="squadContainer">
        <div className="squadHeader">
          {isEditingName ? (
            <input
              className="squadNameInput"
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              onBlur={handleSaveName}
              autoFocus
              maxLength={15}
            />
          ) : (
            <h2 onClick={() => setIsEditingName(true)}>
              {squadName || "My Squad"}
            </h2>
          )}
        </div>

        {/* Formation select */}
        <div
          className="formationSelect"
          onMouseEnter={() => setOpenFormationSelect(true)}
          onMouseLeave={() => setOpenFormationSelect(false)}
        >
          <div
            className="formationSelected"
            onClick={() => setOpenFormationSelect((prev) => !prev)}
          >
            {selectedFormation?.formation}
          </div>

          {openFormationSelect && (
            <div className="formationDropdown">
              {formations.map((formation) => (
                <div
                  key={formation.formation}
                  className="formationOption"
                  onClick={() => {
                    handleFormationChange(formation);
                    setOpenFormationSelect(false);
                  }}
                >
                  {formation.formation}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Layout */}
        {gameLayout && (
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
        )}

        {/* Subbar / pad */}
        {gameLayout && (
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
            allowReplace={true}
          />
        )}

        {/* Rating */}
        {gameLayout && (
          <RatingChemDisplay
            teamRating={teamRating}
            teamChemistry={teamChemistry}
            ratingStars={ratingStars}
            title={"my squad"}
          />
        )}

        {/* Save button */}
        {gameLayout &&
          createPortal(
            <button className="saveBtn" onClick={handleSave}>
              Save Squad
            </button>,
            document.body,
          )}
      </div>

      {/* Modal */}
      {showModal && (
        <PlayersModal
          handlePlayerSelect={handlePlayerSelect}
          clubPlayers={clubPlayers}
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

export default Squad;
