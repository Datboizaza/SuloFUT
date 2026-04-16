import "./SideBar.css";
import NavbarIcon from "../../assets/navbarIcon.png";
import HubLogo from "../../assets/logoWhite.png";
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
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  Squads
                </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/sbc">
                  SBC
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/draft">
                  Draft
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/store">
                  Store
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/club">
                  Club
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/leaderboard">
                  Leaderboards
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" id="navbarItem" to="/settings">
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
