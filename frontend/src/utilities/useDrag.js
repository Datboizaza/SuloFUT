import { useState, useEffect } from "react";

export const useDrag = (assignedPlayers, handleSwapPlayers) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const getPoint = (e) => (e.touches ? e.touches[0] : e);

  const startDrag = (e, key) => {
    if (e.type === "mousedown" && e.button !== 0) return;
    e.preventDefault();
    const point = getPoint(e);
    setDragKey(key);
    setIsDragging(true);
    setDragPos({ x: point.clientX, y: point.clientY });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const point = getPoint(e);
      setDragPos({ x: point.clientX, y: point.clientY });
    };

    const handleUp = async (e) => {
      const point = getPoint(e);
      const element = document.elementFromPoint(point.clientX, point.clientY);
      const slot = element?.closest("[data-slotkey]");
      const to = slot?.getAttribute("data-slotkey");
      setIsDragging(false);
      setDragKey(null);

      if (!to || dragKey === null) return;
      await handleSwapPlayers(dragKey, isNaN(to) ? to : Number(to));
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
  }, [isDragging, dragKey, handleSwapPlayers]);

  return { isDragging, dragKey, dragPos, startDrag };
};
