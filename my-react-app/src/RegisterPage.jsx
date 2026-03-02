import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./LoginRegisterPage.css";
import Register from "./Register.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <Register />
  </StrictMode>,
);
