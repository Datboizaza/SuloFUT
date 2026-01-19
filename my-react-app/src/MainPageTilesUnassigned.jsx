import "./MainPageTilesUnassigned.css";

function MainPageTilesUnassigned() {
  return (
    <>
      <div className="col-lg-9 col-12" id="tileContainer">
        <div className="row" id="tileRow0">
          <a className="col-12" id="tile0" href="">
            <div id="tileTexts" className="col-8">
              <h3>Unassigned Items</h3>
              <p>5 Items Remaining</p>
            </div>
            <div id="tileImages" className="col-4">
              <h1>Kép</h1>
            </div>
          </a>
        </div>
        <div className="row" id="tileRow1">
          <a className="col-12" id="tile1" href="">
            <div id="tileTexts" className="col-8">
              <h3>SuloFUT Hub</h3>
              <p>Check daily objectives and seasonal rewards.</p>
            </div>
            <div id="tileImages" className="col-4">
              <h1>Kép</h1>
            </div>
          </a>
          <a className="col-12" id="tile1" href="">
            <div id="tileTexts" className="col-8">
              <h3>SBC</h3>
              <p>Exchange squads for rewards.</p>
            </div>
            <div id="tileImages" className="col-4">
              <h1>Kép</h1>
            </div>
          </a>
        </div>
        <div className="row" id="tileRow2">
          <a className="col-12" id="tile2" href="">
            <div id="tileTexts" className="col-12">
              <h3>Draft Mode</h3>
            </div>
            <div id="tileTexts" className="col-12">
              <p>
                Build a team from randomly selected players at each position.
              </p>
            </div>
            <div id="tileImages" className="col-12">
              <h1>Kép</h1>
            </div>
          </a>
          <a className="col-12" id="tile2" href="">
            <div id="tileTexts" className="col-12">
              <h3>Store</h3>
            </div>
            <div id="tileTexts" className="col-12">
              <p>Open packs to obtain new cards.</p>
            </div>
            <div id="tileImages" className="col-12">
              <h1>Kép</h1>
            </div>
          </a>
          <a className="col-12" id="tile2" href="">
            <div id="tileTexts" className="col-12">
              <h3>Challenges</h3>
            </div>
            <div id="tileTexts" className="col-12">
              <p>Complete tasks to earn packs or coins.</p>
            </div>
            <div id="tileImages" className="col-12">
              <h1>Kép</h1>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

export default MainPageTilesUnassigned;
