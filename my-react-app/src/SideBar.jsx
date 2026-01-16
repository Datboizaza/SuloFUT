import "./SideBar.css";

function SideBar() {
  return (
    <>
      <div className="col-lg-3" id="sideBarCol">
        <div id="sideBarRow1">
          <img
            src="./assets/logohelyettesito.png"
            alt="SuloFUT logó"
            id="logoImageSideBar"
          />
          <p id="suloFutTitle">sulofut</p>
        </div>
        <div id="sideBarRow2">
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Home" />
            <p id="suloFutTitle">Home</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Squads" />
            <p id="suloFutTitle">Squads</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="SBC" />
            <p id="suloFutTitle">SBC</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Draft" />
            <p id="suloFutTitle">Draft</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Store" />
            <p id="suloFutTitle">Store</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Club" />
            <p id="suloFutTitle">Club</p>
          </button>
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Leaderboards" />
            <p id="suloFutTitle">Leaderboards</p>
          </button>
        </div>
        <div id="sideBarRow3">
          <button type="button" id="sideBarMenuBtn">
            <img src="./assets/logohelyettesito.png" alt="Settings" />
            <p id="suloFutTitle">Settings</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default SideBar;
