import { useEffect, useState } from "react";
import "./SBC.css";
import Coins from "../../assets/coins.png";
import SpecialPack from "../../assets/specialpack.png";

function SBC() {
  const [data, setData] = useState({
    challenges: [],
    upgrades: [],
    foundations: [],
  });

  const [activeTab, setActiveTab] = useState("challenges");

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

  //! SBC claim (ha később lesz)
  const handleClaim = async (sbcId) => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/sbc/claim", { sbcId });

      window.dispatchEvent(new Event("coinsUpdated"));

      const result = await getMethodFetch("http://127.0.0.1:3000/api/sbc");

      setData(result.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        {current.map((sbc) => (
          <div key={sbc.id} className="sbcCard">
            <div className="sbcHeader">
              <p className="sbcTitle">{sbc.name}</p>
              <Reward reward={sbc.reward} />
            </div>

            {!sbc.completed && (
              <button className="claimBtn" onClick={() => handleClaim(sbc.id)}>
                Complete SBC
              </button>
            )}

            {sbc.completed && (
              <button className="claimBtn claimed" disabled>
                Completed &#x1F5F8;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Reward({ reward, small }) {
  if (!reward) return null;

  return (
    <div className={`reward ${small ? "small" : ""}`}>
      {reward.coins && (
        <span className="coins">
          {reward.coins}
          <img src={Coins} alt="coin" className="coinImg" />
        </span>
      )}

      {reward.packs?.map((p) => (
        <span key={p.id} className="pack">
          <img src={SpecialPack} alt="pack" className="packImg" />
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

export default SBC;
