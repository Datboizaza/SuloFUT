// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { useEffect, useState } from "react";
import "./Draft.css";
import FormationPlaceholder from "./assets/formationPlaceholder.jpg";

function Draft() {
  return (
    <>
      <div id="draftDiv">
        {/* <div className="row" id="textRow">
          <div className="col-12">
            <h3 id="chooseText">Select a captain</h3>
          </div>
        </div>
        <div className="row" id="playersRow">
          <div className="col-2"></div>
          <div className="col-2"></div>
          <div className="col-2"></div>
          <div className="col-2"></div>
          <div className="col-2"></div>
        </div> */}
      </div>
    </>
  );
}

// const getMethodFetch = async (url) => {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(
//         "GET hiba: " + response.status + " " + response.statusText,
//       );
//     }
//     return await response.json();
//   } catch (error) {
//     throw new Error("Hiba történt: " + error.message);
//   }
// };

export default Draft;
