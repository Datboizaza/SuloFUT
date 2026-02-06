import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./LeaderboardPage.css";
import Leaderboard from "./Leaderboard.jsx";
import StatBar from "./StatBar.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <StatBar />
  </StrictMode>,
);

createRoot(document.getElementById("root2")).render(
  <StrictMode>
    <Leaderboard />
  </StrictMode>,
);
