import { useState, useEffect } from "react";

export const useDrag = (assignedPlayers, handleSwapPlayers) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const startDrag = (e, key) => {
    if (e.type === "mousedown" && e.button !== 0) return;

    e.preventDefault();

    setDragKey(key);
    setIsDragging(true);

    const point = e.touches ? e.touches[0] : e;

    setDragPos({
      x: point.clientX,
      y: point.clientY,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const point = e.touches ? e.touches[0] : e;

      setDragPos({
        x: point.clientX,
        y: point.clientY,
      });
    };

    const handleUp = async (e) => {
      const point = e.changedTouches ? e.changedTouches[0] : e;

      const from = dragKey;

      setIsDragging(false);
      setDragKey(null);

      if (!assignedPlayers[from]) return;

      const element = document.elementFromPoint(point.clientX, point.clientY);
      const slotElement = element?.closest("[data-slotkey]");

      if (!slotElement) return;

      const toKey = slotElement.getAttribute("data-slotkey");
      const to = /^\d+$/.test(toKey) ? Number(toKey) : toKey;

      if (!assignedPlayers[to]) return;

      await handleSwapPlayers(from, to);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, dragKey, assignedPlayers, handleSwapPlayers]);

  return {
    isDragging,
    dragKey,
    dragPos,
    startDrag,
  };
};
