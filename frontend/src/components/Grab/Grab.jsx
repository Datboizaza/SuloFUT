import { createPortal } from "react-dom";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";

function Grab({
  dragPos,
  assignedPlayers,
  dragKey,
  isDragging,
  chemImg,
  playerChemMap,
  displayedPosition,
  gameLayout,
}) {
  if (!isDragging || dragKey === null || !assignedPlayers[dragKey]) {
    return null;
  }

  return createPortal(
    <div
      className="dragOverlay pos"
      style={{
        left: dragPos.x,
        top: dragPos.y,
      }}
    >
      <PlayerCard
        player={assignedPlayers[dragKey]}
        isDragging={true}
        isSource={true}
        chemImg={chemImg}
        playerChemMap={playerChemMap}
        displayedPosition={displayedPosition}
        slotPos={gameLayout?.[dragKey]?.pos}
        isModal={true}
      />
    </div>,
    document.body,
  );
}

export default Grab;
