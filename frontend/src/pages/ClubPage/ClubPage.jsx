import { useEffect } from "react";

import Club from "../../components/Club/Club.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./ClubPage.css";

function ClubPage() {
  useEffect(() => {
    document.title = "SuloFUT | Club";
  });
  return (
    <div className="clubPage">
      <div className="clubHeader">
        <StatBar title="club" />
      </div>

      <div className="clubBody">
        <Club />
      </div>
    </div>
  );
}

export default ClubPage;
