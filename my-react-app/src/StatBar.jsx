import "./StatBar.css";
import Coins from "./assets/coins.png";
import BackIcon from "./assets/back-icon.png";

function StatBar({ title }) {
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
            <p id="coinCounter">123 456</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatBar;
