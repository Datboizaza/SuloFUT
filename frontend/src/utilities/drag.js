import { useState, useEffect } from "react";

export const Drag = (assignedPlayers, handleSwapPlayers) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragKey, setDragKey] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  //! Mouse és touch egységesítése
  const getPoint = (e) => (e.touches ? e.touches[0] : e);

  //! Drag elkezdése
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

    //! Pozíció frissítése
    const handleMove = (e) => {
      const point = getPoint(e);
      setDragPos({ x: point.clientX, y: point.clientY });
    };

    //! Amikor elengedjük az elemet
    const handleUp = async (e) => {
      const point = getPoint(e);
      const element = document.elementFromPoint(point.clientX, point.clientY);
      const slot = element?.closest("[data-slotkey]");
      const to = slot?.getAttribute("data-slotkey");
      setIsDragging(false);
      setDragKey(null);

      if (!to || dragKey === null || !assignedPlayers[to]) return;
      await handleSwapPlayers(dragKey, to);
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
  }, [isDragging, dragKey, handleSwapPlayers, assignedPlayers]);

  return { isDragging, dragKey, dragPos, startDrag };
};
