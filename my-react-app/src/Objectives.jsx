import { useEffect, useState } from "react";
import "./Objectives.css";
import Coins from "./assets/coins.png";
import SpecialPack from "./assets/specialpack.png";

function Objectives() {
  const [data, setData] = useState({
    foundations: [],
    milestones: [],
    campaign: [],
  });
  const [activeTab, setActiveTab] = useState("foundations");
  const [openId, setOpenId] = useState(null);

  //! Adatok kiírása
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMethodFetch(
          "http://127.0.0.1:3000/api/objectives",
        );
        setData(result.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //! Aktuális oldal
  const current = data[activeTab] || [];

  //! Claim-elés funkció
  const handleClaim = async (subId) => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/objectives/claim-sub", {
        subId,
      });

      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/objectives",
      );

      setData(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGroupClaim = async (objectiveId) => {
    try {
      await postMethodFetch(
        "http://127.0.0.1:3000/api/objectives/claim-group",
        {
          objectiveId,
        },
      );

      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/objectives",
      );

      setData(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="objectivesContainer">
      {/* Objective bar */}
      <div className="tabs">
        {["foundations", "milestones", "campaign"].map((tab) => (
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
      <div className="objectivesGrid">
        {current.map((obj) => {
          const isCompleted = obj.subobjectives.every(
            (s) => s.progress >= s.requirement,
          );
          return (
            <div key={obj.id} className="objectiveCard">
              <div
                className="objectiveHeader"
                onClick={() => setOpenId(openId === obj.id ? null : obj.id)}
              >
                <h3>{obj.name}</h3>

                <Reward reward={obj.groupreward} />
              </div>

              {isCompleted && !obj.claimed && (
                <button
                  className="claimBtn"
                  onClick={() => handleGroupClaim(obj.id)}
                >
                  Claim Group Reward
                </button>
              )}

              {obj.claimed && (
                <button className="claimBtn claimed" disabled>
                  Claimed ✔
                </button>
              )}

              {/* Progress */}
              <ProgressBar
                current={
                  obj.subobjectives.filter((s) => s.progress >= s.requirement)
                    .length
                }
                max={obj.subobjectives.length}
              />

              {/* Subobjectives */}
              {openId === obj.id && (
                <div className="subList">
                  {obj.subobjectives.map((sub) => (
                    <div key={sub.id} className="subItem">
                      <div className="subText">
                        <span>{sub.task}</span>
                        <Reward reward={sub.reward} small />
                      </div>

                      <ProgressBar
                        current={sub.progress}
                        max={sub.requirement || 1}
                      />

                      {sub.progress >= sub.requirement && !sub.claimed && (
                        <button
                          onClick={() => handleClaim(sub.id)}
                          className="claimBtn"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ current, max }) {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <div className="progressBar">
      <div className="progressFill" style={{ width: percent + "%" }} />
    </div>
  );
}

function Reward({ reward, small }) {
  if (!reward) return null;

  return (
    <div className={`reward ${small ? "small" : ""}`}>
      {reward.coins && (
        <span className="coins">
          {reward.coins}{" "}
          <img src={Coins} alt="coin image" className="coinImg"></img>
        </span>
      )}

      {reward.packs?.map((p) => (
        <span key={p.id} className="pack">
          <img src={SpecialPack} alt="pack image" className="packImg"></img>{" "}
          {p.name}
        </span>
      ))}
    </div>
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

const postMethodFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST Hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default Objectives;
