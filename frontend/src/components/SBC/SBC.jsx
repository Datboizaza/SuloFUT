import { useEffect, useState } from "react";
import "./SBC.css";
import SpecialPack from "../../assets/specialpack.png";

function SBC() {
  const [data, setData] = useState({
    challenges: [],
    upgrades: [],
    foundations: [],
  });

  const [activeTab, setActiveTab] = useState("challenges");

  const [sbcGameStarted, setSbcGameStarted] = useState(false);

  //! Adatok lekérése
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/sbc/allsbc",
        );
        setData(result.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //! Aktuális tab
  const current = data[activeTab] || [];

  //! Start Challenge
  const handleStart = (id) => {
    console.log("Start SBC:", id);
    setSbcGameStarted(true);
  };

  return (
    <>
      {!sbcGameStarted && (
        <div className="sbcContainer">
          {/* Tabs */}
          <div className="tabs">
            {["challenges", "upgrades", "foundations"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="sbcGrid">
            {current.map((element) => {
              const sbc = element.sbcData;

              return (
                <div key={sbc.id} className="sbcCard">
                  <div className="sbcHeader">
                    <p className="sbcTitle">{sbc.sbcName}</p>
                  </div>

                  <div className="sbcInfo">
                    <div className="rewardDiv">
                      <p>
                        <strong>Reward:</strong>
                      </p>
                      <div className="packDiv">
                        <img
                          src={SpecialPack}
                          alt="Reward Pack Image"
                          className="rewardPack"
                        />
                        <p>x1 {sbc.rewardPack}</p>
                      </div>
                    </div>
                    <p>
                      <strong>Repeatable:</strong>{" "}
                      {sbc.repeat === null || sbc.repeat === undefined
                        ? "Infinite"
                        : sbc.repeat}
                    </p>
                  </div>

                  <button
                    className="startBtn"
                    onClick={() => handleStart(sbc.id)}
                  >
                    Start Challenge
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sbcGameStarted && <div className="sbcGameContainer"></div>}
    </>
  );
}

const getMethodFetch = async (url) => {
  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(`GET hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default SBC;
