import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./LoginRegisterPage.css";
import Register from "./Register.jsx";

const checkLogin = async () => {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/users/me", {
      credentials: "include",
    });

    if (response.status === 200) {
      window.location.href = "/";
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
      <Register />
    </StrictMode>,
  );
});
