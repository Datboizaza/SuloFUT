import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SideBar from "./SideBar.jsx";
import StatBar from "./StatBar.jsx";
import MainPageTiles from "./MainPageTiles.jsx";
import MainPageTilesUnassigned from "./MainPageTilesUnassigned.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <SideBar />
  </StrictMode>,
);

createRoot(document.getElementById("root2")).render(
  <StrictMode>
    <StatBar />
  </StrictMode>,
);

createRoot(document.getElementById("root3")).render(
  <StrictMode>
    <MainPageTiles />
  </StrictMode>,
);
