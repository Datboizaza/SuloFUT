import "./SideBar.css";

function SideBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg col-lg-3" id="sideBar">
        <h3>sulofut</h3>
        <button
          className="navbarIcon d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <img src="./assets/navbarIcon.png" alt="Menu" id="navbarIcon"></img>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabindex="-1"
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
            <ul className="navbar-nav flex-grow-1">
              <li className="nav-item">
                <a
                  className="nav-link disabled"
                  id="navbarItem"
                  aria-current="page"
                  href="#"
                >
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
                <a className="nav-link" id="navbarItem" href="">
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
                <a className="nav-link" id="navbarItem" href="">
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
