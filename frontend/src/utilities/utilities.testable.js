//! Chemistry képek érték alapján
export const chemImg = (chem) => {
  if (chem === 3) return "three";
  if (chem === 2) return "two";
  if (chem === 1) return "one";
  return "zero";
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

//! Grafikon draft
export const calculateGraphProgress = (chem, rating) => {
  return Math.max(0, Math.min((chem + rating) / 133, 1)) * 360;
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
  const response = await fetch("http://127.0.0.1:3000/api/draft/chemistry", {
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
  const response = await fetch("http://127.0.0.1:3000/api/draft/rating", {
    credentials: "include",
  });

  const data = await response.json();

  return data.rating;
};

//!Rating fetchelése (sub nélkül)
export const fetchRatingWOSub = async () => {
  const response = await fetch(
    "http://127.0.0.1:3000/api/draft/ratingwithoutsub",
    {
      credentials: "include",
    },
  );

  const data = await response.json();

  return data.rating;
};

//! RewardValue-k
export const getRewardValue = (score) => {
  if (score > 122) return "excellent";
  if (score > 117) return "great";
  if (score > 112) return "good";
  if (score > 105) return "mid";
  return "bad";
};

//! Draft ki van e töltve
export const isDraftComplete = (
  draftStarted,
  gameLayout,
  assignedPlayers,
  benchLayout,
) => {
  if (!draftStarted || !gameLayout) return false;

  const mainFull = gameLayout.every((_, i) => Boolean(assignedPlayers[i]));
  const benchFull = benchLayout.every((slot) =>
    Boolean(assignedPlayers[slot.id]),
  );

  return mainFull && benchFull;
};

//! Club value kiszámolása
export const calculateClubValue = (players) => {
  return players.reduce((sum, player) => sum + (player.value || 0), 0);
};

//! Objective teljesítve van e
export const isObjectiveCompleted = (subobjectives) => {
  return subobjectives.every((s) => s.progress >= s.requirement && s.claimed);
};

//! Objective progress
export const calculateProgressPercent = (current, max) => {
  if (!max) return 0;
  return Math.min((current / max) * 100, 100);
};

//! PLayer rarity
export const getRarityClass = (rarity) => {
  switch (rarity) {
    case "bronze":
      return "text-bronze";
    case "silver":
      return "text-silver";
    case "gold":
      return "text-gold";
    case "icon":
      return "text-icon";
    case "toty":
      return "text-toty";
    case "hero":
      return "text-hero";
    case "scream":
      return "text-scream";
    case "flashback":
      return "text-flashback";
    default:
      return "text-gold";
  }
};

//! Sbc requirement-ek
export const getRequirements = (sbc) => {
  return Object.entries(sbc).filter(([key, value]) => {
    if (!value) return false;

    if (
      typeof value === "string" &&
      (value.startsWith("min") || value.startsWith("max"))
    ) {
      return true;
    }

    if (key === "rarity") return true;

    return false;
  });
};

//! Requirement-ek szétszedése
export const parseRequirement = (value) => {
  if (!value || typeof value !== "string") {
    return { type: null, value: 0 };
  }

  const [type, num] = value.split(" ");
  return {
    type,
    value: Number(num),
  };
};

//! Requirement-ek ellenőrzése
export const checkRequirement = (key, value, stats) => {
  if (!value) return true;

  if (!value.startsWith("min") && !value.startsWith("max")) {
    if (key === "rarity") {
      return stats.rarity === value;
    }
    return stats[key] === value;
  }

  const { type, value: num } = parseRequirement(value);
  const current = stats[key] || 0;

  if (type === "min") return current >= num;
  if (type === "max") return current <= num;

  return false;
};

//! SBC squad jelenlegi állása
export const getSquadStats = (
  players,
  teamRating,
  teamChemistry,
  chemMap,
  getMaxSame,
) => {
  const list = Object.values(players);

  return {
    rating: teamRating,
    chemistry: teamChemistry,
    leagues: new Set(list.map((p) => p.league_id)).size,
    nations: new Set(list.map((p) => p.nationality_id)).size,
    sameLeague: getMaxSame(list, "league_id"),
    sameNation: getMaxSame(list, "nationality_id"),
    sameClub: getMaxSame(list, "club_team_id"),
    special: list.filter((p) => p.is_special).length,
    chemPP: list.filter((p) => chemMap[p.player_id] >= 1).length,
    rarity:
      list.length > 0
        ? list.every((p) => p.rarity === list[0].rarity)
          ? list[0].rarity
          : "mixed"
        : null,
  };
};

//! Total quick sell value pack-ben
export const calculateTotalValue = (players) => {
  return players.reduce((sum, p) => sum + (p.value || 0), 0);
};

//! Csak duplicate a pack-ben
export const hasOnlyDuplicates = (nonDuplicates) => {
  return nonDuplicates.length === 0;
};
