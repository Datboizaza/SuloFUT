import { useEffect, useState } from "react";
import "./FormationSelect.css";
import FormationPlaceholder from "./assets/formationPlaceholder.jpg";

function FormationSelect() {
  const [formation1, setFormation1] = useState(null);
  const [formation2, setFormation2] = useState(null);
  const [formation3, setFormation3] = useState(null);
  const [formation4, setFormation4] = useState(null);
  const [formation5, setFormation5] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/randomformations",
        );
        setFormation1(Object.values(result.randomformations[0]));
        setFormation2(Object.values(result.randomformations[1]));
        setFormation3(Object.values(result.randomformations[2]));
        setFormation4(Object.values(result.randomformations[3]));
        setFormation5(Object.values(result.randomformations[4]));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div id="formationSelectDiv">
        <div className="row">
          <div className="col-4" id="chooseFormation">
            <div className="row">
              <h3>Choose a formation</h3>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
              >
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  id="buttonFormation"
                />
                <h5 className="formationText">{formation1}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
              >
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  className="buttonFormation"
                  id="buttonFormation"
                />
                <h5 className="formationText">{formation2}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
              >
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  className="buttonFormation"
                  id="buttonFormation"
                />
                <h5 className="formationText">{formation3}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
              >
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  className="buttonFormation"
                  id="buttonFormation"
                />
                <h5 className="formationText">{formation4}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
              >
                <img
                  src={FormationPlaceholder}
                  alt="Formation"
                  className="buttonFormation"
                  id="buttonFormation"
                />
                <h5 className="formationText">{formation5}</h5>
              </button>
            </div>
          </div>
          <div className="col-8" id="formationImage">
            <h2 id="formationName">Formation: {formation1}</h2>
            <img src={FormationPlaceholder} alt="Formation" id="formationImg" />
          </div>
        </div>
      </div>
    </>
  );
}

const formationFunction = (e) => {
  const btnValue = e.currentTarget.querySelector(".formationText").innerHTML;
  const formationName = document.getElementById("formationName");
  formationName.innerHTML = "Formation: " + btnValue;
};

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

export default FormationSelect;
