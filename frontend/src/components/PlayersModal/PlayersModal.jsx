import { createPortal } from "react-dom";
import { useState } from "react";
import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayersModal.css";

function PlayersModal({ handlePlayerSelect, clubPlayers }) {
  const [playerName, setPlayerName] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");

  return createPortal(
    <div className="sbcPlayersModal">
      <div className="filterRow">
        <select name="Order" className="filterSelect">
          <option value="4">Order by</option>
          <option value="0">Low to high</option>
          <option value="1">High to low</option>
          <option value="2">Lowest quick sell</option>
          <option value="3">Highest quick sell</option>
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
          min={1}
          max={99}
          placeholder="Min."
          className="filterInput"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <input
          type="number"
          min={1}
          max={99}
          placeholder="Max."
          className="filterInput"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
        />
        <select name="Rarity" className="filterSelect"></select>
        <select name="Position" className="filterSelect"></select>
        <select name="Nation" className="filterSelect"></select>
        <select name="League" className="filterSelect"></select>
        <select name="Club" className="filterSelect"></select>
      </div>
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
  );
}

export default PlayersModal;
