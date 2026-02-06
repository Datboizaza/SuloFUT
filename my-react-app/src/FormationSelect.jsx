import "./FormationSelect.css";
import FormationPlaceholder from "./assets/formationPlaceholder.jpg";

function FormationSelect() {
  return (
    <>
      <div id="formationSelectDiv">
        <div className="row">
          <div className="col-4" id="chooseFormation">
            <div className="row">
              <h3>Choose a formation</h3>
            </div>
            <div className="row">
              <button type="button" id="formationSelectBtn">
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 id="formation1">3-4-2-1</h5>
              </button>
            </div>
            <div className="row">
              <button type="button" id="formationSelectBtn">
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 id="formation1">3-4-2-1</h5>
              </button>
            </div>
            <div className="row">
              <button type="button" id="formationSelectBtn">
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 id="formation1">3-4-2-1</h5>
              </button>
            </div>
            <div className="row">
              <button type="button" id="formationSelectBtn">
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 id="formation1">3-4-2-1</h5>
              </button>
            </div>
            <div className="row">
              <button type="button" id="formationSelectBtn">
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 id="formation1">3-4-2-1</h5>
              </button>
            </div>
          </div>
          <div className="col-8" id="formationImage">
            <h2 id="formationName">Formation: 3-1-4-2</h2>
            <img src={FormationPlaceholder} alt="Formation" id="formationImg" />
          </div>
        </div>
      </div>
    </>
  );
}




import { useEffect, useState } from "react";

const getMethodFetch = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "GET hiba: " + response.status + " " + response.statusText,
      );
    }
    return await response.json();
  } catch (error) {
    throw new Error("Hiba történt: " + error.message);
  }
};

function App() {
  const [faceUrl, setFaceUrl] = useState(null);
  const [overall, setOverall] = useState(null);
  const [position, setPosition] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [playerPace, setplayerPace] = useState(null);
  const [playerShooting, setplayerShooting] = useState(null);
  const [playerPassing, setplayerPassing] = useState(null);
  const [playerDribbling, setplayerDribbling] = useState(null);
  const [playerDefending, setplayerDefending] = useState(null);
  const [playerPhysic, setplayerPhysic] = useState(null);
  const [playerNation, setplayerNation] = useState(null);
  const [playerLeague, setplayerLeague] = useState(null);
  const [playerClub, setplayerClub] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/players",
        );

        setOverall(result.data[0].overall);
        setPosition(result.data[0].club_position);
        setFaceUrl(result.data[0].player_face_url);
        setPlayerName(result.data[0].short_name);
        setplayerPace(result.data[0].pace);
        setplayerShooting(result.data[0].shooting);
        setplayerPassing(result.data[0].passing);
        setplayerDribbling(result.data[0].dribbling);
        setplayerDefending(result.data[0].defending);
        setplayerPhysic(result.data[0].physic);
        setplayerNation(result.data[0].nationality_name);
        setplayerLeague(result.data[0].league_name);
        setplayerClub(result.data[0].club_name);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <p>{overall}</p>
        <p>{position}</p>
        <img src={faceUrl} alt="" referrerPolicy="no-referrer" />
        <p>{playerName}</p>
        <p>PAC</p>
        <p>{playerPace}</p>
        <p>SHO</p>
        <p>{playerShooting}</p>
        <p>PAS</p>
        <p>{playerPassing}</p>
        <p>DRI</p>
        <p>{playerDribbling}</p>
        <p>DEF</p>
        <p>{playerDefending}</p>
        <p>PHY</p>
        <p>{playerPhysic}</p>
        <p>{playerNation}</p>
        <p>{playerLeague}</p>
        <p>{playerClub}</p>
      </div>
    </>
  );
}

export default App;


export default FormationSelect;
