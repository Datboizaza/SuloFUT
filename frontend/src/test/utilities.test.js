/* global QUnit */
import {
  chemImg,
  ratingStars,
  calculateGraphProgress,
  displayedPosition,
  getRewardValue,
  isDraftComplete,
  calculateClubValue,
  isObjectiveCompleted,
  calculateProgressPercent,
  getRarityClass,
  getRequirements,
  parseRequirement,
  checkRequirement,
  getSquadStats,
  calculateTotalValue,
  hasOnlyDuplicates,
} from "../utilities/utilities.testable.js";

QUnit.module("Játékban szereplő függvények tesztelése");

// ChemImg
QUnit.test("Chemistry csillag megjelenik", (assert) => {
  assert.ok(chemImg(3) !== undefined);
  assert.ok(chemImg(2) !== undefined);
  assert.ok(chemImg(1) !== undefined);
  assert.ok(chemImg(0) !== undefined);
});

// RatingStars
QUnit.test("Rating csillagok működnek", (assert) => {
  assert.strictEqual(ratingStars(85), "★★★★★");
  assert.strictEqual(ratingStars(80), "★★★★☆");
  assert.strictEqual(ratingStars(70), "★★★☆☆");
  assert.strictEqual(ratingStars(66), "★★☆☆☆");
  assert.strictEqual(ratingStars(10), "★☆☆☆☆");
  assert.strictEqual(ratingStars(0), "☆☆☆☆☆");
});

// GraphProgress
QUnit.test("Grafikon működik", (assert) => {
  assert.strictEqual(calculateGraphProgress(0, 0), 0);
  assert.ok(calculateGraphProgress(50, 50) <= 360);
});

// DisplayedPosition
QUnit.test(
  "Jó pozíció jelenik meg a játékos csapatba helyezésekor",
  (assert) => {
    const player = { player_positions: "ST, LW" };

    assert.strictEqual(displayedPosition(player, null), "ST");
    assert.strictEqual(displayedPosition(player, "LW"), "LW");
    assert.strictEqual(displayedPosition(player, "GK"), "ST");
  },
);

// RewardValue
QUnit.test("Reward értékek működnek", (assert) => {
  assert.strictEqual(getRewardValue(130), "excellent");
  assert.strictEqual(getRewardValue(120), "great");
  assert.strictEqual(getRewardValue(115), "good");
  assert.strictEqual(getRewardValue(107), "mid");
  assert.strictEqual(getRewardValue(90), "bad");
});

// DraftComplete
QUnit.test("Draft kitöltésének ellenőrzése", (assert) => {
  const layout = [1, 2];
  const bench = [{ id: "RES1" }];
  const players = { 0: {}, 1: {}, RES1: {} };

  assert.ok(isDraftComplete(true, layout, players, bench));
  assert.notOk(isDraftComplete(false, layout, players, bench));
});

// ClubValue
QUnit.test("Klub értékének kiszámolása", (assert) => {
  const players = [{ value: 100 }, { value: 200 }];
  assert.strictEqual(calculateClubValue(players), 300);
});

// ObjectiveCompleted
QUnit.test("Objective teljesítésének ellenőrzése", (assert) => {
  const subs = [
    { progress: 5, requirement: 5, claimed: true },
    { progress: 3, requirement: 3, claimed: true },
  ];

  assert.ok(isObjectiveCompleted(subs));
});

// ProgressPercentage
QUnit.test("Objective progress százalék működik", (assert) => {
  assert.strictEqual(calculateProgressPercent(5, 10), 50);
  assert.strictEqual(calculateProgressPercent(10, 10), 100);
  assert.strictEqual(calculateProgressPercent(5, 0), 0);
});

// RarityClass
QUnit.test("Kártya szövegeinek színe működik", (assert) => {
  assert.strictEqual(getRarityClass("gold"), "text-gold");
  assert.strictEqual(getRarityClass("icon"), "text-icon");
  assert.strictEqual(getRarityClass("unknown"), "text-gold");
});

// RequirementsFilter
QUnit.test("SBC feltételek", (assert) => {
  const sbc = {
    rating: "min 80",
    chemistry: "max 30",
    rarity: "gold",
    useless: null,
  };
  const result = getRequirements(sbc);
  assert.strictEqual(result.length, 3);
});

// ParseRequirement
QUnit.test("SBC feltételek ketté szedése - min/max és value", (assert) => {
  const result = parseRequirement("min 5");

  assert.strictEqual(result.type, "min");
  assert.strictEqual(result.value, 5);
});

// CheckRequirement
QUnit.test("SBC feltételek teljesítésének ellenőrzése", (assert) => {
  const stats = { rating: 85, rarity: "gold" };

  assert.ok(checkRequirement("rating", "min 80", stats));
  assert.notOk(checkRequirement("rating", "max 80", stats));
  assert.ok(checkRequirement("rarity", "gold", stats));
});

// SquadStats
QUnit.test("SBC aktuális csapat állása", (assert) => {
  const players = {
    1: {
      league_id: 1,
      nationality_id: 1,
      club_team_id: 1,
      rarity: "gold",
      is_special: true,
      player_id: 1,
    },
    2: {
      league_id: 1,
      nationality_id: 2,
      club_team_id: 1,
      rarity: "gold",
      is_special: false,
      player_id: 2,
    },
  };

  const chemMap = { 1: 2, 2: 1 };

  const getMaxSame = (list, key) => {
    const count = {};
    list.forEach((p) => {
      count[p[key]] = (count[p[key]] || 0) + 1;
    });
    return Math.max(...Object.values(count));
  };

  const stats = getSquadStats(players, 80, 25, chemMap, getMaxSame);

  assert.strictEqual(stats.rating, 80);
  assert.strictEqual(stats.chemistry, 25);
  assert.strictEqual(stats.leagues, 1);
  assert.strictEqual(stats.rarity, "gold");
});

// TotalValue
QUnit.test("Pack játékosainak értéke", (assert) => {
  const players = [{ value: 100 }, { value: 50 }];
  assert.strictEqual(calculateTotalValue(players), 150);
});

// OnlyDuplicates
QUnit.test("Pack-ben csak duplicate van-e", (assert) => {
  assert.ok(hasOnlyDuplicates([]));
  assert.notOk(hasOnlyDuplicates([1]));
});
