import { useEffect } from "react";

import SideBar from "../../components/SideBar/SideBar.jsx";
import StatBarMainPage from "../../components/StatBarMainPage/StatBarMainPage.jsx";
import MainPageTiles from "../../components/MainPageTiles/MainPageTiles.jsx";
import "./MainPage.css";

function MainPage() {
  useEffect(() => {
    document.title = "SuloFUT | Home";
  });
  return (
    <div className="mainPage">
      <div className="mainLayout">
        <SideBar />

        <div className="mainContent">
          <div className="mainHeader">
            <StatBarMainPage />
          </div>

          <div className="mainBody">
            <MainPageTiles />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
