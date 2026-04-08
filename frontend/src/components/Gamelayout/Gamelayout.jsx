import { createPortal } from "react-dom";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";

function Gamelayout({
  gameLayout,
  assignedPlayers,
  isDragging,
  dragKey,
  handlePosClick,
  startDrag,
  chemImg,
  playerChemMap,
  displayedPosition,
  showPlayerSelectionModal,
  playerOptons,
  captainPick,
  handleCaptainSelect,
  handlePlayerSelect,
}) {
  return (
    <div className="gameFormationLayout">
      {gameLayout.map((p, i) => (
        <div
          key={i}
          className="pos"
          data-slotkey={i}
          style={{ left: p.x + "%", top: p.y + "%" }}
          id={p.pos}
          onClick={() => {
            if (assignedPlayers[i]) return;
            handlePosClick(i, p.pos);
          }}
        >
          {assignedPlayers[i] && (
            <div
              onMouseDown={(e) => startDrag(e, i)}
              onTouchStart={(e) => startDrag(e, i)}
              className={`cardSlot ${
                isDragging && dragKey === i ? "dragSource" : ""
              }`}
            >
              <PlayerCard
                player={assignedPlayers[i]}
                isDragging={isDragging}
                isSource={dragKey === i}
                chemImg={chemImg}
                playerChemMap={playerChemMap}
                displayedPosition={displayedPosition}
                slotPos={p.pos}
                isModal={false}
              />
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
    </div>
  );
}

export default Gamelayout;
