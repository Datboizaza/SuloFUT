import { useEffect } from "react";

import Settings from "../../components/Settings/Settings.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./SettingsPage.css";

function SettingsPage() {
  useEffect(() => {
    document.title = "SuloFUT | Settings";
  });
  return (
    <div className="settingsPage">
      <div className="settingsHeader">
        <StatBar title="settings" />
      </div>

      <div className="settingsBody">
        <Settings />
      </div>
    </div>
  );
}

export default SettingsPage;
