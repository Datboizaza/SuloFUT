import "./StatBarMainPage.css";
import Coins from "./assets/coins.png";

function StatBarMainPage() {
  return (
    <>
      <div id="statBarDiv">
        <div id="div1"></div>
        <div id="div2">
          <h4 id="actualPage">Home</h4>
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

export default StatBarMainPage;
