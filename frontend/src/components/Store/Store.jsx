import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Store.css";
import Coins from "../../assets/coins.png";
import bronze from "../../assets/bronzePack.png";
import silver from "../../assets/silverPack.png";
import gold from "../../assets/goldPack.png";
import special from "../../assets/specialpack.png";
import toty from "../../assets/totypack.png";
import flashback from "../../assets/promopack.png";
import scream from "../../assets/specialpack.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import Confetti from "../../assets/confetti.gif";

const packImages = {
  bronze: bronze,
  silver: silver,
  gold: gold,
  special: special,
  toty: toty,
  flashback: flashback,
  scream: scream,
};

function Store() {
  const [activeTab, setActiveTab] = useState("mypacks");

  const [data, setData] = useState({
    mypacks: [],
    buypacks: [],
  });

  const [packOpening, setPackOpening] = useState(false);
  const [packPlayersArr, setPackPlayersArr] = useState([]);

  const [openingStage, setOpeningStage] = useState("idle");

  const [currentPack, setCurrentPack] = useState(null);

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
        mypacks: [...new Map(result.map((p) => [p.id, p])).values()],
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
        buypacks: [...new Map(result.map((p) => [p.id, p])).values()],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  //!Async-await miatt
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
      await postMethodFetch("http://127.0.0.1:3000/api/deletemypack", {
        packId: pack.id,
      });

      await fetchMyPacks();

      const packPlayers = await getMethodFetch(
        `http://127.0.0.1:3000/api/generatePack/${pack.id}`,
      );

      const players = packPlayers.randomjatekosok;

      setCurrentPack(pack);
      setPackPlayersArr(players);

      setPackOpening(true);
      setOpeningStage("pack");

      setTimeout(() => {
        setOpeningStage("confetti");
      }, 2000);

      setTimeout(() => {
        setOpeningStage("reveal");
      }, 2700);

      setTimeout(() => {
        setOpeningStage("full");
      }, 9000);
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

        const packPlayers = await getMethodFetch(
          `http://127.0.0.1:3000/api/generatePack/${pack.id}`,
        );

        const players = packPlayers.randomjatekosok;

        setCurrentPack(pack);
        setPackPlayersArr(players);

        setPackOpening(true);
        setOpeningStage("pack");

        setTimeout(() => {
          setOpeningStage("confetti");
        }, 2000);

        setTimeout(() => {
          setOpeningStage("reveal");
        }, 2700);

        setTimeout(() => {
          setOpeningStage("full");
        }, 9000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //! Quick sell 1 játékos
  const handleQuickSell = async (player) => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
        coins: player.value,
      });

      setPackPlayersArr((prev) => {
        const updated = prev.filter((p) => p.player_id !== player.player_id);
        if (updated.length === 0) {
          setPackOpening(false);
        }
        return updated;
      });

      window.dispatchEvent(new Event("coinsUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  //! Quick sell összes játékos
  const handleQuickSellAll = async () => {
    try {
      const total = packPlayersArr.reduce((sum, p) => sum + p.value, 0);

      await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
        coins: total,
      });

      setPackPlayersArr([]);

      window.dispatchEvent(new Event("coinsUpdated"));
      setPackOpening(false);
    } catch (err) {
      console.log(err);
    }
  };

  //! Játékos hozzáadása a klub-hoz
  const handleSendAllToClub = async () => {
    try {
      await postMethodFetch("http://127.0.0.1:3000/api/addPlayersToClub", {
        players: packPlayersArr,
      });

      setPackPlayersArr([]);
      setPackOpening(false);
    } catch (err) {
      console.log(err);
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

        <div key={activeTab} className="storeGrid">
          {current.map((pack) => {
            const img = packImages[pack.packDesign] || special;

            return (
              <div key={pack.id} className="packCard">
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
            {(openingStage === "pack" || openingStage === "idle") && (
              <div className="packStage">
                <img
                  src={packImages[currentPack.packDesign] || special}
                  className="openingPackImage"
                />
              </div>
            )}

            {openingStage === "confetti" && (
              <div className="packStage confetti">
                <img
                  src={packImages[currentPack.packDesign] || special}
                  className="openingPackImage confettiPack"
                />
                <img src={Confetti} className="confettiGif" />
              </div>
            )}

            {openingStage === "reveal" && packPlayersArr[0] && (
              <div className="packStage reveal">
                <PlayerCard
                  player={packPlayersArr[0]}
                  isModal={true}
                  displayedPosition={(p) => p.player_positions.split(", ")[0]}
                  slotPos={null}
                  playerChemMap={{}}
                  chemImg={() => null}
                />
              </div>
            )}

            {openingStage === "full" && (
              <>
                <div className="packTop">
                  <button
                    className="storeBtnPack"
                    onClick={handleSendAllToClub}
                  >
                    Send all players to my club
                  </button>
                </div>

                {packPlayersArr.map((player) => (
                  <div key={player.player_id} className="cardRow">
                    <div className="cardWrapper">
                      <PlayerCard
                        player={player}
                        isModal={true}
                        displayedPosition={(p) =>
                          p.player_positions.split(", ")[0]
                        }
                        slotPos={null}
                        playerChemMap={{}}
                        chemImg={() => null}
                      />
                    </div>

                    <p className="packPlayerName">
                      {player.long_name}
                      <button
                        className="quickSellBtn"
                        onClick={() => handleQuickSell(player)}
                      >
                        <p>Quick Sell</p>
                        <p className="quickSellText">
                          {player.value.toLocaleString("hu-HU")}
                          <img src={Coins} alt="coins" />
                        </p>
                      </button>
                    </p>
                  </div>
                ))}

                <div className="packBottom">
                  <button className="storeBtnPack" onClick={handleQuickSellAll}>
                    <p>Quick sell all players for</p>
                    <p className="quickSellText">
                      {packPlayersArr
                        .reduce((sum, p) => sum + p.value, 0)
                        .toLocaleString("hu-HU")}
                      <img src={Coins} alt="coins" />
                    </p>
                  </button>
                </div>
              </>
            )}
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
