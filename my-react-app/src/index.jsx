import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SideBar from "./SideBar.jsx";
import StatBarMainPage from "./StatBarMainPage.jsx";
import MainPageTiles from "./MainPageTiles.jsx";
import MainPageTilesUnassigned from "./MainPageTilesUnassigned.jsx";

const checkLogin = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/users/me", {
      credentials: "include",
    });

    if (response.status === 400) {
      window.location.href = "/login.html";
      return;
    }
  } catch (error) {
    console.error("Login check error:", error);
    window.location.href = "/login.html";
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await checkLogin();

  createRoot(document.getElementById("root1")).render(
    <StrictMode>
      <SideBar />
    </StrictMode>,
  );

  createRoot(document.getElementById("root2")).render(
    <StrictMode>
      <StatBarMainPage />
    </StrictMode>,
  );

  createRoot(document.getElementById("root3")).render(
    <StrictMode>
      <MainPageTiles />
    </StrictMode>,
  );
});
