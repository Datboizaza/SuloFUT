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

export default FormationSelect;
