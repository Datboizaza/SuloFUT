import { useEffect } from "react";

import Store from "../../components/Store/Store.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./StorePage.css";

function StorePage() {
  useEffect(() => {
    document.title = "SuloFUT | Store";
  });
  return (
    <div className="storePage">
      <div className="storeHeader">
        <StatBar title="store" />
      </div>

      <div className="storeBody">
        <Store />
      </div>
    </div>
  );
}

export default StorePage;
