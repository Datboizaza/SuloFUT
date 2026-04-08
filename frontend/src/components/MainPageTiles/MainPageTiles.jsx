import "./MainPageTiles.css";
import UnassignedPacks from "../../assets/unassignedCards.png";
import StoreLogo from "../../assets/allPacks.png";
import HubLogo from "../../assets/logoWhite.png";
import SbcLogo from "../../assets/sbcIcon.png";
import DraftLogo from "../../assets/draftLogo.png";
import ObjectivesLogo from "../../assets/xpIcon.png";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel.jsx";

function MainPageTiles() {
  return (
    <>
      <div id="tileContainer">
        <div className="row" id="tileRow1">
          <div className="col-12" id="tile1">
            <Carousel />
          </div>
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
          <Link className="col-12" id="tile2" to="/draft">
            <div id="tileTexts2" className="col-12 col-md-8">
              <h3>DRAFT MODE</h3>
              <p>Build a team from randomly selected players.</p>
            </div>
            <div id="tileImages2" className="col-12 col-md-4">
              <img src={DraftLogo} alt="Draft Logo" id="draftLogo" />
            </div>
          </Link>
          <Link className="col-12" id="tile2" to="/store">
            <div id="tileTexts2" className="col-12  col-md-8">
              <h3>STORE</h3>
              <p>Open packs to obtain new cards.</p>
            </div>
            <div id="tileImages2" className="col-12 col-md-4">
              <img src={StoreLogo} alt="Store Logo" id="storeLogo" />
            </div>
          </Link>
          <Link className="col-12" id="tile2" to="/objectives">
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
          </Link>
        </div>
      </div>
    </>
  );
}

export default MainPageTiles;
