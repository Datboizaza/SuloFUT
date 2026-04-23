import "./SideBar.css";
import NavbarIcon from "../../assets/navbarIcon.png";
import HubLogo from "../../assets/logoWhite.png";
import Home from "../../assets/homeMiniIcon.png";
import Squad from "../../assets/squadMiniIcon.png";
import Sbc from "../../assets/sbcMiniIcon.png";
import Draft from "../../assets/draftMiniIcon.png";
import Store from "../../assets/storeMiniIcon.png";
import Club from "../../assets/myclubMiniIcon.png";
import Leaderboards from "../../assets/leaderboardMiniIcon.png";
import Settings from "../../assets/settingsMiniIcon.png";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg" id="sideBar">
        <div id="logoDiv">
          <img src={HubLogo} alt="SuloFUT Logo" id="sulofutLogo" />
          <h3 className="logoSzoveg">sulofut</h3>
        </div>
        <button
          className="navbarIcon d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <img src={NavbarIcon} alt="Menu" id="navbarIcon"></img>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              id="closeBtn"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/">
                  <img src={Home} className="miniIcon" alt="Home" />
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/squad">
                  <img src={Squad} className="miniIcon" alt="Squad" />
                  Squad
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/sbc">
                  <img src={Sbc} className="miniIcon" alt="SBC" />
                  SBC
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/draft">
                  <img src={Draft} className="miniIcon" alt="Draft" />
                  Draft
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/store">
                  <img src={Store} className="miniIcon" alt="Store" />
                  Store
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/club">
                  <img src={Club} className="miniIcon" alt="Club" />
                  Club
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/leaderboard">
                  <img
                    src={Leaderboards}
                    className="miniIcon"
                    alt="Leaderboards"
                  />
                  Leaderboards
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/settings">
                  <img src={Settings} className="miniIcon" alt="Settings" />
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
