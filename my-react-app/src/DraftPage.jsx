import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./DraftPage.css";
import FormationSelect from "./FormationSelect.jsx";
import StatBar from "./StatBar.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <StatBar title="Draft" />
  </StrictMode>,
);

createRoot(document.getElementById("root2")).render(
  <StrictMode>
    <FormationSelect />
  </StrictMode>,
);
