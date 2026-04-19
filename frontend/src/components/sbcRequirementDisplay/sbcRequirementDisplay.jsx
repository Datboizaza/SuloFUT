import "./sbcRequirementDisplay.css";

function SBCRequirements({
  sbc,
  stats,
  getRequirements,
  parseRequirement,
  checkRequirement,
}) {
  const requirements = getRequirements(sbc);

  return (
    <div className="sbcRequirements">
      {requirements.map(([key, value]) => {
        const parsed = parseRequirement(value);
        const current = stats[key] || 0;
        const done = checkRequirement(key, value, stats);

        return (
          <div key={key} className={`reqRow ${done ? "done" : "fail"}`}>
            <span>{key.toUpperCase()}</span>
            <span>
              {current} / {parsed.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SBCRequirements;
