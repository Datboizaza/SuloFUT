import { useEffect } from "react";

import Squad from "../../components/Squad/Squad.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./SquadPage.css";

function SquadPage() {
  useEffect(() => {
    document.title = "SuloFUT | Squad";
  });
  return (
    <div className="SquadPage">
      <div className="SquadHeader">
        <StatBar title="squad" />
      </div>

      <div className="SquadBody">
        <Squad />
      </div>
    </div>
  );
}

export default SquadPage;
