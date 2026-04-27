import { useEffect, useState } from "react";
import "./StatBar.css";
import Coins from "../../assets/coins.png";
import BackIcon from "../../assets/back-icon.png";
import { Link } from "react-router-dom";

function StatBar({ title }) {
  const [coinNumber, setCoinNumber] = useState(0);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getMethodFetch(
          "http://127.0.0.1:3000/api/users/me/coins",
        );
        setCoinNumber(data.coinNumber);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoins();

    const handleCoinsUpdate = () => {
      fetchCoins();
    };
    window.addEventListener("coinsUpdated", handleCoinsUpdate);
    return () => {
      window.removeEventListener("coinsUpdated", handleCoinsUpdate);
    };
  }, []);

  return (
    <>
      <div id="statBarDiv">
        <div id="div1">
          <Link to="/">
            <img src={BackIcon} alt="Go back" id="backIcon" />
          </Link>
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

const getMethodFetch = async (url) => {
  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`GET hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default StatBar;
