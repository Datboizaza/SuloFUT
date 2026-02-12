import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import "./Draft.css";

function Draft() {
  const [formation1, setFormation1] = useState(null);
  const [formation2, setFormation2] = useState(null);
  const [formation3, setFormation3] = useState(null);
  const [formation4, setFormation4] = useState(null);
  const [formation5, setFormation5] = useState(null);
  const [layout1, setLayout1] = useState(null);
  const [layout2, setLayout2] = useState(null);
  const [layout3, setLayout3] = useState(null);
  const [layout4, setLayout4] = useState(null);
  const [layout5, setLayout5] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/randomformations",
        );
        setFormation1(Object.values(result.randomformations[0].formation));
        setFormation2(Object.values(result.randomformations[1].formation));
        setFormation3(Object.values(result.randomformations[2].formation));
        setFormation4(Object.values(result.randomformations[3].formation));
        setFormation5(Object.values(result.randomformations[4].formation));

        setLayout1(result.randomformations[0].layout);
        setLayout2(result.randomformations[1].layout);
        setLayout3(result.randomformations[2].layout);
        setLayout4(result.randomformations[3].layout);
        setLayout5(result.randomformations[4].layout);
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
                onClick={(e) => startDraft(e)}
              >
                <div className="miniFormationLayout">
                  {layout1 &&
                    layout1.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      />
                    ))}
                </div>
                <h5 className="formationText">{formation1}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
                onClick={(e) => startDraft(e)}
              >
                <div className="miniFormationLayout">
                  {layout2 &&
                    layout2.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      />
                    ))}
                </div>
                <h5 className="formationText">{formation2}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
                onClick={(e) => startDraft(e)}
              >
                <div className="miniFormationLayout">
                  {layout3 &&
                    layout3.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      />
                    ))}
                </div>
                <h5 className="formationText">{formation3}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
                onClick={(e) => startDraft(e)}
              >
                <div className="miniFormationLayout">
                  {layout4 &&
                    layout4.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      />
                    ))}
                </div>
                <h5 className="formationText">{formation4}</h5>
              </button>
            </div>
            <div className="row">
              <button
                type="button"
                className="formationSelectBtn"
                id="formationSelectBtn"
                onMouseOver={(e) => formationFunction(e)}
                onClick={(e) => startDraft(e)}
              >
                <div className="miniFormationLayout">
                  {layout5 &&
                    layout5.map((p, i) => (
                      <div
                        key={i}
                        className="pos"
                        style={{ left: p.x + "%", top: p.y + "%" }}
                        id={p.pos}
                      />
                    ))}
                </div>
                <h5 className="formationText">{formation5}</h5>
              </button>
            </div>
          </div>
          <div className="col-8" id="formationImage">
            <h2 id="formationName">Formation: {formation1}</h2>
            <div className="formationLayout">
              {layout1 &&
                layout1.map((p, i) => (
                  <div
                    key={i}
                    className="pos"
                    style={{ left: p.x + "%", top: p.y + "%" }}
                    id={p.pos}
                  />
                ))}
            </div>
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

  const miniFormationLayout = e.currentTarget.querySelector(
    ".miniFormationLayout",
  ).innerHTML;
  const formationLayout = document.querySelector(".formationLayout");
  formationLayout.innerHTML = miniFormationLayout;
};

const startDraft = (e) => {
  const layoutDivs = e.currentTarget.querySelectorAll(
    ".miniFormationLayout .pos",
  );
  const layoutData = Array.from(layoutDivs).map((pos) => ({
    x: pos.style.left,
    y: pos.style.top,
    pos: pos.id,
  }));

  createRoot(document.getElementById("root2")).render(
    <StrictMode>
      <div className="gameFormationLayout">
        {layoutData.map((p, i) => (
          <div
            key={i}
            className="pos"
            style={{ left: p.x, top: p.y }}
            id={p.pos}
          />
        ))}
        {layoutData.map((p, i) => (
          <p
            key={i}
            className="posText"
            style={{ left: p.x, top: `calc(${p.y} + 7%)` }}
          >
            {p.pos}
          </p>
        ))}
        <div className="playerSelectionModal d-none">
          {chooseCaptainModal()}
          <div className="playerSlot"></div>
          <div className="playerSlot"></div>
          <div className="playerSlot"></div>
          <div className="playerSlot"></div>
          <div className="playerSlot"></div>
        </div>
      </div>
    </StrictMode>,
  );
};

const chooseCaptainModal = () => {
  setTimeout(() => {
    const playerSelectionModal = document.querySelector(
      ".playerSelectionModal",
    );
    playerSelectionModal.classList.remove("d-none");

    chooseCaptain();
  }, 500);
};

const chooseCaptain = async () => {
  try {
    const result = await getMethodFetch(
      "http://127.0.0.1:3000/api/randomplayers",
    );

    let i = 0;
    result.randomjatekosok.forEach((element) => {
      document.querySelectorAll(".playerSlot")[i].textContent =
        element.short_name;
      i++;
    });
  } catch (error) {
    console.log(error);
  }
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

export default Draft;
