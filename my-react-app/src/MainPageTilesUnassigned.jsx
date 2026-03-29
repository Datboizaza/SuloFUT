import "./MainPageTiles.css";
import UnassignedPacks from "./assets/unassignedCards.png";
import StoreLogo from "./assets/allPacks.png";
import HubLogo from "./assets/logoWhite.png";
import SbcLogo from "./assets/sbcIcon.png";
import DraftLogo from "./assets/draftLogo.png";
import ObjectivesLogo from "./assets/xpIcon.png";

function MainPageTilesUnassigned() {
  return (
    <>
      <div id="tileContainer">
        <div className="row" id="tileRow0">
          <a className="col-12" id="tile0" href="">
            <div id="tileTexts1" className="col-8">
              <h3>UNASSIGNED ITEMS</h3>
              <p>5 Items Remaining</p>
            </div>
            <div id="tileImages1" className="col-4">
              <img
                src={UnassignedPacks}
                alt="Unassigned Packs Icon"
                id="unassignedPacksIcon"
              />
            </div>
          </a>
        </div>
        <div className="row" id="tileRow1">
          <a className="col-12" id="tile1" href="">
            <div id="tileTexts1" className="col-8">
              <h3>SULOFUT HUB</h3>
              <p>Check out seasonal rewards.</p>
            </div>
            <div id="tileImages1" className="col-4">
              <img src={HubLogo} alt="SuloFUT Hub Logo" id="hubLogo" />
            </div>
          </a>
          <a className="col-12" id="tile1" href="">
            <div id="tileTexts1" className="col-8">
              <h3>SBC</h3>
              <p>Exchange squads for rewards.</p>
            </div>
            <div id="tileImages1" className="col-4">
              <img
                src={SbcLogo}
                alt="Squad Building Challenges Logo"
                id="sbcLogo"
              />
            </div>
          </a>
        </div>
        <div className="row" id="tileRow2">
          <a className="col-12" id="tile2" href="../draft.html">
            <div id="tileTexts2" className="col-12 col-md-8">
              <h3>DRAFT MODE</h3>
              <p>Build a team from randomly selected players.</p>
            </div>
            <div id="tileImages2" className="col-12 col-md-4">
              <img src={DraftLogo} alt="Draft Logo" id="draftLogo" />
            </div>
          </a>
          <a className="col-12" id="tile2" href="">
            <div id="tileTexts2" className="col-12  col-md-8">
              <h3>STORE</h3>
              <p>Open packs to obtain new cards.</p>
            </div>
            <div id="tileImages2" className="col-12 col-md-4">
              <img src={StoreLogo} alt="Store Logo" id="storeLogo" />
            </div>
          </a>
          <a className="col-12" id="tile2" href="../objectives.html">
            <div id="tileTexts2" className="col-12  col-md-8">
              <h3>OBJECTIVES</h3>
              <p>Complete tasks to earn packs or coins.</p>
            </div>
            <div id="tileImages2" className="col-12 col-md-4">
              <img
                src={ObjectivesLogo}
                alt="Objectives Logo"
                id="objectivesLogo"
              />
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

export default MainPageTilesUnassigned;
