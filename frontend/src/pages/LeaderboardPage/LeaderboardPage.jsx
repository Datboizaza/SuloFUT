import { useEffect } from "react";

import Leaderboard from "../../components/Leaderboard/Leaderboard.jsx";
import StatBar from "../../components/StatBar/StatBar.jsx";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  useEffect(() => {
    document.title = "SuloFUT | Leaderboard";
  });
  return (
    <div className="leaderboardPage">
      <div className="leaderboardHeader">
        <StatBar title="leaderboards" />
      </div>

      <div className="leaderboardBody">
        <Leaderboard />
      </div>
    </div>
  );
}

export default LeaderboardPage;
