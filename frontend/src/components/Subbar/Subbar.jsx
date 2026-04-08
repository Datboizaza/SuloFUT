import { createPortal } from "react-dom";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";

function Subbar({
  openSubs,
  setOpenSubs,
  benchLayout,
  assignedPlayers,
  handlePosClick,
  startDrag,
  isDragging,
  dragKey,
  chemImg,
  playerChemMap,
  displayedPosition,
}) {
  return createPortal(
    <div
      className={`subBar ${openSubs ? "open" : ""}`}
      id="subBar"
      onMouseEnter={() => setOpenSubs(true)}
      onMouseLeave={() => setOpenSubs(false)}
    >
      <button
        className="subBarTab"
        onClick={() => setOpenSubs((prev) => !prev)}
        aria-expanded={openSubs}
      >
        sub / res
      </button>

      <div className="subBarContent">
        <h4 className="subresText">SUB</h4>

        {benchLayout.slice(0, 7).map((slot) => (
          <div
            key={slot.id}
            className="pos"
            data-slotkey={slot.id}
            id={slot.pos}
            onClick={() => {
              if (assignedPlayers[slot.id]) return;
              handlePosClick(slot.id, slot.pos);
            }}
          >
            {assignedPlayers[slot.id] && (
              <div
                onMouseDown={(e) => startDrag(e, slot.id)}
                onTouchStart={(e) => startDrag(e, slot.id)}
                className={`cardSlot ${
                  isDragging && dragKey === slot.id ? "dragSource" : ""
                }`}
              >
                <PlayerCard
                  player={assignedPlayers[slot.id]}
                  isDragging={isDragging}
                  isSource={dragKey === slot.id}
                  chemImg={chemImg}
                  playerChemMap={playerChemMap}
                  displayedPosition={displayedPosition}
                  slotPos={slot.pos}
                  isModal={true}
                />
              </div>
            )}
          </div>
        ))}

        <h4 className="subresText">RES</h4>

        {benchLayout.slice(7).map((slot) => (
          <div
            key={slot.id}
            className="pos"
            data-slotkey={slot.id}
            id={slot.pos}
            onClick={() => {
              if (assignedPlayers[slot.id]) return;
              handlePosClick(slot.id, slot.pos);
            }}
          >
            {assignedPlayers[slot.id] && (
              <div
                onMouseDown={(e) => startDrag(e, slot.id)}
                onTouchStart={(e) => startDrag(e, slot.id)}
                className={`cardSlot ${
                  isDragging && dragKey === slot.id ? "dragSource" : ""
                }`}
              >
                <PlayerCard
                  player={assignedPlayers[slot.id]}
                  isDragging={isDragging}
                  isSource={dragKey === slot.id}
                  chemImg={chemImg}
                  playerChemMap={playerChemMap}
                  displayedPosition={displayedPosition}
                  slotPos={slot.pos}
                  isModal={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>,
    document.querySelector(".draftBody"),
  );
}

export default Subbar;
