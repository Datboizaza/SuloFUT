import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./DraftPage.css";
import Draft from "./Draft.jsx";
import StatBar from "./StatBar.jsx";

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
      <StatBar title="draft" />
    </StrictMode>,
  );

  createRoot(document.getElementById("root2")).render(
    <StrictMode>
      <Draft />
    </StrictMode>,
  );
});
