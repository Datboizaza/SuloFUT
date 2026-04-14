import { useEffect } from "react";

import SBC from "../../components/SBC/SBC.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./SBCPage.css";

function SBCPage() {
  useEffect(() => {
    document.title = "SuloFUT | SBC";
  });
  return (
    <div className="SBCPage">
      <div className="SBCHeader">
        <StatBar title="sbc" />
      </div>

      <div className="SBCBody">
        <SBC />
      </div>
    </div>
  );
}

export default SBCPage;
