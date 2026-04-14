import ZeroChem from "../assets/zeroChem.png";
import OneChem from "../assets/oneChem.png";
import TwoChem from "../assets/twoChem.png";
import ThreeChem from "../assets/threeChem.png";

//! Kispad layout
export const benchLayout = [
  { id: "SUBGK", pos: "GK" },
  { id: "SUBDEF1", pos: "DEF" },
  { id: "SUBDEF2", pos: "DEF" },
  { id: "SUBMID1", pos: "MID" },
  { id: "SUBMID2", pos: "MID" },
  { id: "SUBATT1", pos: "ATT" },
  { id: "SUBATT2", pos: "ATT" },

  { id: "RES1", pos: "ANY" },
  { id: "RES2", pos: "ANY" },
  { id: "RES3", pos: "ANY" },
  { id: "RES4", pos: "ANY" },
  { id: "RES5", pos: "ANY" },
];

//! Chemistry csillagok
export const chemImg = (chem) => {
  if (chem === 3) return ThreeChem;
  if (chem === 2) return TwoChem;
  if (chem === 1) return OneChem;
  return ZeroChem;
};

//!Rating csillagok
export const ratingStars = (rating) => {
  if (rating >= 83) return "★★★★★";
  if (rating >= 75) return "★★★★☆";
  if (rating >= 69) return "★★★☆☆";
  if (rating >= 65) return "★★☆☆☆";
  if (rating >= 2) return "★☆☆☆☆";
  return "☆☆☆☆☆";
};

//! Kijelzett pozíció
export const displayedPosition = (player, slotPos) => {
  const positions = player.player_positions.split(", ");
  const primary = positions[0];

  if (!slotPos || slotPos === "ANY") return primary;
  if (positions.includes(slotPos)) return slotPos;

  return primary;
};

//! Chemistry fetchelése
export const fetchChemistry = async () => {
  const response = await fetch("http://127.0.0.1:3000/api/chemistry", {
    credentials: "include",
  });

  const data = await response.json();

  const map = {};
  data.players.forEach((p) => {
    map[p.player_id] = p.chemistry;
  });

  return {
    teamChemistry: data.teamChemistry,
    playerChemMap: map,
  };
};

//!Rating fetchelése
export const fetchRating = async () => {
  const response = await fetch("http://127.0.0.1:3000/api/rating", {
    credentials: "include",
  });

  const data = await response.json();

  return data.rating;
};
