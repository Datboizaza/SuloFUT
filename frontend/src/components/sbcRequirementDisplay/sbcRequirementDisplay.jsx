import "./sbcRequirementDisplay.css";

function SBCRequirements({
  sbc,
  stats,
  getRequirements,
  parseRequirement,
  checkRequirement,
}) {
  const requirements = getRequirements(sbc);

  const requirementTexts = {
    rating: "Rating",
    chemistry: "Chemistry",
    leagues: "Leagues",
    nations: "Nations",
    sameLeague: "Players from the same league",
    sameNation: "Players from the same nation",
    sameClub: "Players from the same club",
    chemPP: "Chemistry point(s) per player",
    special: "Special player(s)",
    rarity: "Rarity",
  };

  return (
    <div className="sbcRequirements">
      {/* Név */}
      <div className="reqHeader">
        <span className="reqIcon">📋</span>
        <span className="reqTitle">{sbc.sbcName}</span>
        <span className="reqArrow">▼</span>
      </div>

      {/* Requirementek */}
      <div className="reqContent">
        {requirements.map(([key, value]) => {
          const parsed = parseRequirement(value);
          const current = stats[key] || 0;
          const done = checkRequirement(key, value, stats);

          return (
            <div key={key} className={`reqRow ${done ? "done" : "fail"}`}>
              <span>{requirementTexts[key] || key}</span>
              <span className="reqValue">
                {key === "rarity" ? (
                  value
                ) : parsed.type ? (
                  <>
                    <span className="reqType">{parsed.type}.</span>{" "}
                    {parsed.value}{" "}
                    <span className="reqCurrent">({current})</span>
                  </>
                ) : (
                  <>
                    {value} <span className="reqCurrent">({current})</span>
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SBCRequirements;
