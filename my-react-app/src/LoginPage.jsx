import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./LoginRegisterPage.css";
import Login from "./Login.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <Login />
  </StrictMode>,
);
