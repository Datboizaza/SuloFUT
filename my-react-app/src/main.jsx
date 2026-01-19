import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SideBar from "./SideBar.jsx";
import MainPageTiles from "./MainPageTiles.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SideBar />
    <MainPageTiles />
  </StrictMode>,
);
