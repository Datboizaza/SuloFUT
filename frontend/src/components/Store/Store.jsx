import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Store.css";
import Coins from "../../assets/coins.png";
import Bronze from "../../assets/bronzePack.png";
import Silver from "../../assets/silverPack.png";
import Gold from "../../assets/goldPack.png";
import Special from "../../assets/specialpack.png";
import Toty from "../../assets/totypack.png";
import Flashback from "../../assets/promopack.png";
import Scream from "../../assets/specialpack.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";

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

  const [packOpening, setPackOpening] = useState(false);
  const [packPlayersArr, setPackPlayersArr] = useState([]);

  //!My Packs fetch
  const fetchMyPacks = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/users/me/packs",
        {
          credentials: "include",
        },
      );

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
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/storepacks",
      );

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
  const handleOpen = async (pack) => {
    try {
      // await postMethodFetch("http://127.0.0.1:3000/api/deletemypack", {
      //   packId: pack.id,
      // });

      window.dispatchEvent(new Event("packDeleted"));

      try {
        const players = [];
        const packPlayers = await getMethodFetch(
          `http://127.0.0.1:3000/api/generatePack/${pack.id}`,
        );
        packPlayers.randomjatekosok.forEach((element) => {
          players.push(element);
        });

        setPackPlayersArr(players);
        setPackOpening(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //!Pack vásárlás
  const handleBuy = async (pack) => {
    try {
      const coins = await getMethodFetch(
        "http://127.0.0.1:3000/api/users/me/coins",
      );
      if (coins.coinNumber < pack.packPrice) {
        console.log("csóró geci");
      } else {
        await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
          coins: -pack.packPrice,
        });

        window.dispatchEvent(new Event("coinsUpdated"));

        try {
          const players = [];
          const packPlayers = await getMethodFetch(
            `http://127.0.0.1:3000/api/generatePack/${pack.id}`,
          );
          packPlayers.randomjatekosok.forEach((element) => {
            players.push(element);
          });

          setPackPlayersArr(players);
          setPackOpening(true);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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

                    <button
                      className="storeBtn"
                      onClick={() => handleBuy(pack)}
                    >
                      Buy
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {packOpening &&
        createPortal(
          <div className="packOpeningModal">
            {packPlayersArr.map((player) => (
              <div key={player.player_id} className="cardRow">
                <div key={player.player_id} className="cardWrapper">
                  <PlayerCard
                    player={player}
                    isModal={true}
                    displayedPosition={(p) => p.player_positions.split(", ")[0]}
                    slotPos={null}
                    playerChemMap={{}}
                    chemImg={() => null}
                  />
                </div>
                <p className="packPlayerName">{player.long_name}</p>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

const getMethodFetch = async (url) => {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error("GET hiba");
  }
  return await response.json();
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

export default Store;
