import { useEffect } from "react";

import Objectives from "../../components/Objectives/Objectives.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./ObjectivesPage.css";

function ObjectivesPage() {
  useEffect(() => {
    document.title = "SuloFUT | Objectives";
  });
  return (
    <div className="objectivesPage">
      <div className="objectivesHeader">
        <StatBar title="objectives" />
      </div>

      <div className="objectivesBody">
        <Objectives />
      </div>
    </div>
  );
}

export default ObjectivesPage;
