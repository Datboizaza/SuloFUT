import { createPortal } from "react-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayersModal.css";

function PlayersModal({
  handlePlayerSelect,
  clubPlayers,
  selectedPosition,
  enableQuickSell,
  onQuickSell,
}) {
  const [playerName, setPlayerName] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [sortBy, setSortBy] = useState(4);
  const [rarity, setRarity] = useState("");
  const [position, setPosition] = useState("");
  const [nationality, setNationality] = useState("");
  const [league, setLeague] = useState("");
  const [club, setClub] = useState("");

  const [filteredPlayers, setFilteredPlayers] = useState(clubPlayers);

  //! Pozíció, amire klikkelt
  const effectivePosition = position || selectedPosition?.toLowerCase() || "";

  //! Options a klubból
  const { rarityOptions, nationalityOptions, leagueOptions } = useMemo(() => {
    const rarities = new Set();
    const nationalities = new Set();
    const leagues = new Set();

    clubPlayers.forEach((player) => {
      if (player.rarity) rarities.add(player.rarity);
      if (player.nationality_name) nationalities.add(player.nationality_name);
      if (player.league_name) leagues.add(player.league_name);
    });

    return {
      rarityOptions: [...rarities],
      nationalityOptions: [...nationalities],
      leagueOptions: [...leagues],
    };
  }, [clubPlayers]);

  //! Klub-ok abban a ligában
  const clubOptions = useMemo(() => {
    if (!league) return [];
    const clubs = new Set();
    clubPlayers.forEach((player) => {
      if (player.league_name === league && player.club_name) {
        clubs.add(player.club_name);
      }
    });

    return [...clubs];
  }, [league, clubPlayers]);

  //! Filter-ek használata
  const applyFilters = useCallback(async () => {
    try {
      let result = [...clubPlayers];

      if (playerName) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerName",
          {
            players: result.map((player) => player.player_id),
            name: playerName,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (minRating || maxRating) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/ovrRange",
          {
            players: result.map((player) => player.player_id),
            condMin: minRating,
            condMax: maxRating,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (rarity) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerRarity",
          {
            players: result.map((player) => player.player_id),
            rarity,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (effectivePosition) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerPosition",
          {
            players: result.map((player) => player.player_id),
            position: effectivePosition,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (nationality) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerNationality",
          {
            players: result.map((player) => player.player_id),
            nationality,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (league) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerLeague",
          {
            players: result.map((player) => player.player_id),
            league,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (club) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/playerClub",
          {
            players: result.map((player) => player.player_id),
            club,
          },
        );
        result = filterRes.byFeltetel;
      }

      if (sortBy !== 4) {
        const filterRes = await postMethodFetch(
          "http://127.0.0.1:3000/api/myclub/sortBy",
          {
            players: result.map((player) => player.player_id),
            condId: sortBy,
          },
        );
        result = filterRes.byFeltetel;
      }

      setFilteredPlayers(result);
    } catch (error) {
      console.error(error.message);
    }
  }, [
    playerName,
    minRating,
    maxRating,
    rarity,
    nationality,
    league,
    club,
    sortBy,
    clubPlayers,
    effectivePosition,
  ]);

  //! Késleltetés, hogy ne legyen túl sok api hívás
  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timeout);
  }, [applyFilters]);

  return createPortal(
    <div className="sbcPlayersModal">
      <div className="filterRowDiv">
        <div className="filterRow">
          <select
            className="filterSelect"
            value={sortBy}
            onChange={(e) => setSortBy(Number(e.target.value))}
          >
            <option value={4}>Order by</option>
            <option value={0}>Low to high</option>
            <option value={1}>High to low</option>
            <option value={2}>Lowest quick sell</option>
            <option value={3}>Highest quick sell</option>
          </select>

          <input
            type="text"
            placeholder="Name"
            className="filterInput"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Min. Rating"
            className="filterInput"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max. Rating"
            className="filterInput"
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
          />

          <select
            className="filterSelect"
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
          >
            <option value="">Rarity</option>
            {rarityOptions.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>

          <select
            className="filterSelect"
            value={effectivePosition}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Position</option>
            <option value="gk">GK</option>
            <option value="lb">LB</option>
            <option value="cb">CB</option>
            <option value="rb">RB</option>
            <option value="cdm">CDM</option>
            <option value="cm">CM</option>
            <option value="cam">CAM</option>
            <option value="lm">LM</option>
            <option value="rm">RM</option>
            <option value="lw">LW</option>
            <option value="st">ST</option>
            <option value="rw">RW</option>
            <option value="defender">Defender</option>
            <option value="midfielder">Midfielder</option>
            <option value="attacker">Attacker</option>
          </select>

          <select
            className="filterSelect"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          >
            <option value="">Nation</option>
            {nationalityOptions.map((nation) => (
              <option key={nation} value={nation}>
                {nation}
              </option>
            ))}
          </select>

          <select
            className="filterSelect"
            value={league}
            onChange={(e) => {
              const value = e.target.value;
              setLeague(value);
              if (!value) {
                setClub("");
              }
            }}
          >
            <option value="">League</option>
            {leagueOptions.map((league) => (
              <option key={league} value={league}>
                {league}
              </option>
            ))}
          </select>

          <select
            className="filterSelect"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            disabled={!league}
          >
            <option value="">Club</option>
            {clubOptions.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPlayers.map((player) => (
        <div key={player.player_id} className="cardRow">
          <div
            className="cardWrapper"
            onClick={() => handlePlayerSelect && handlePlayerSelect(player)}
          >
            <PlayerCard
              player={player}
              isModal={true}
              displayedPosition={(player) =>
                player.player_positions.split(", ")[0]
              }
              slotPos={null}
              playerChemMap={{}}
              chemImg={() => null}
            />
          </div>

          <p className="packPlayerName">
            {player.long_name}
            {enableQuickSell && (
              <button
                className="quickSellBtn"
                onClick={(e) => {
                  e.stopPropagation(); // 👈 fontos, ne selecteljen
                  onQuickSell(player);
                }}
              >
                Quick Sell
              </button>
            )}
          </p>
        </div>
      ))}
    </div>,
    document.body,
  );
}

const postMethodFetch = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST Hiba: ${response.status}`);
  }

  return response.json();
};

export default PlayersModal;
