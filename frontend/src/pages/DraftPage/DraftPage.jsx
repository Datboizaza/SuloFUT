import { useEffect } from "react";
import Draft from "../../components/Draft/Draft.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./DraftPage.css";

function DraftPage() {
  useEffect(() => {
    document.title = "SuloFUT | Draft";
  });

  return (
    <div className="draftPage">
      <div className="draftContent">
        <StatBar title="draft" />

        <div className="draftBody">
          <Draft />
        </div>
      </div>
    </div>
  );
}

export default DraftPage;
