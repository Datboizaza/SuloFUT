import { useEffect, useState } from "react";
import "./Store.css";
import Coins from "../../assets/coins.png";
import Bronze from "../../assets/bronzePack.png";
import Silver from "../../assets/silverPack.png";
import Gold from "../../assets/goldPack.png";
import Special from "../../assets/specialpack.png";
import Toty from "../../assets/totypack.png";
import Flashback from "../../assets/promopack.png";
import Scream from "../../assets/specialpack.png";

const packImages = {
  bronze: Bronze,
  silver: Silver,
  gold: Gold,
  special: Special,
  toty: Toty,
  flashback: Flashback,
  scream: Scream,
};

function Store() {
  const [activeTab, setActiveTab] = useState("mypacks");

  const [data, setData] = useState({
    mypacks: [],
    buypacks: [],
  });

  //!My Packs fetch
  const fetchMyPacks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/users/me/packs", {
        credentials: "include",
      });

      const result = await response.json();

      setData((prev) => ({
        ...prev,
        mypacks: result,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  //!Buy Packs fetch
  const fetchStorePacks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/storepacks");

      const result = await response.json();

      setData((prev) => ({
        ...prev,
        buypacks: result,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  //!Frissítés
  useEffect(() => {
    const init = async () => {
      await fetchMyPacks();
      await fetchStorePacks();
    };
    init();
  }, []);

  const current = data[activeTab];

  //!Pack nyitás
  const handleOpen = async (pack) => {};

  //!Pack vásárlás
  const handleBuy = async (pack) => {};

  return (
    <div className="storeContainer">
      {/* Tabs */}
      <div className="tabs">
        {["mypacks", "buypacks"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "mypacks" ? "MY PACKS" : "BUY PACKS"}
          </button>
        ))}
      </div>

      <div className="storeGrid">
        {current.map((pack) => {
          const img = packImages[pack.packDesign] || Special;

          return (
            <div key={`${activeTab}-${pack.id}`} className="packCard">
              <img src={img} alt="pack" className="packImage" />

              <p>{pack.packName}</p>

              {/* My packs */}
              {activeTab === "mypacks" && (
                <button className="storeBtn" onClick={() => handleOpen(pack)}>
                  Open
                </button>
              )}

              {/* Buy packd */}
              {activeTab === "buypacks" && (
                <>
                  <p className="price">
                    {pack.packPrice.toLocaleString("hu-HU")}
                    <img src={Coins} alt="coins" />
                  </p>

                  <button className="storeBtn" onClick={() => handleBuy(pack)}>
                    Buy
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Store;
