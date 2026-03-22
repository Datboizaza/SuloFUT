import { useEffect, useState } from "react";
import "./StatBar.css";
import Coins from "./assets/coins.png";
import BackIcon from "./assets/back-icon.png";

function StatBar({ title }) {
  const [coinNumber, setCoinNumber] = useState(0);

  useEffect(() => {
    const getMethodFetch = async (url) => {
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("GET hiba");
      }
      return await response.json();
    };

    const fetchCoins = async () => {
      try {
        const data = await getMethodFetch(
          "http://127.0.0.1:3000/api/users/me/coins",
          { credentials: "include" },
        );
        setCoinNumber(data.coinNumber);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoins();
  }, []);

  return (
    <>
      <div id="statBarDiv">
        <div id="div1">
          <a href="../index.html">
            <img src={BackIcon} alt="Go back" id="backIcon" />
          </a>
        </div>
        <div id="div2">
          <h4 id="actualPage">{title}</h4>
        </div>
        <div id="div3">
          <div id="coinsDiv">
            <img src={Coins} alt="Coins" id="coinsImage" />
            <p id="coinCounter">{coinNumber.toLocaleString("hu-HU")}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatBar;
