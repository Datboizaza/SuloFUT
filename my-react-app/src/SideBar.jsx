import "./SideBar.css";
import NavbarIcon from "./assets/navbarIcon.png";
import HubLogo from "./assets/logoWhite.png";

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
                <a className="nav-link" id="navbarItem" href="../index.html">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  Squads
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  SBC
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="../draft.html">
                  Draft
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  Store
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  Club
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="navbarItem"
                  href="../leaderboard.html"
                >
                  Leaderboards
                </a>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" id="navbarItem" href="">
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default SideBar;
