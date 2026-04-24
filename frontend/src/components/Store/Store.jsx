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
import scream from "../../assets/screamPack.png";
import PlayerCard from "../PlayerCard/PlayerCard.jsx";
import Confetti from "../../assets/confetti.gif";
import BackIcon from "../../assets/back-icon.png";

const packImages = {
  bronze,
  silver,
  gold,
  special,
  toty,
  flashback,
  scream,
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

  const [modal, setModal] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [clubPlayers, setClubPlayers] = useState([]);

  //! Club fetch
  const fetchClub = async () => {
    const result = await getMethodFetch("http://127.0.0.1:3000/api/myclub");

    setClubPlayers(result || []);
  };

  //!My Packs fetch
  const fetchMyPacks = async () => {
    try {
      const result = await getMethodFetch(
        "http://127.0.0.1:3000/api/users/me/packs",
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
        "http://127.0.0.1:3000/api/store/storepacks",
      );

      setData((prev) => ({
        ...prev,
        buypacks: [...new Map(result.map((p) => [p.id, p])).values()],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchMyPacks();
      await fetchStorePacks();
      await fetchClub();
    };
    init();
  }, []);

  const current = data[activeTab];

  //!Pack nyitás
  const handleOpen = async (pack) => {
    try {
      await fetchClub();

      await postMethodFetch("http://127.0.0.1:3000/api/store/deletemypack", {
        packId: pack.id,
      });

      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 29,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 30,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 31,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 32,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 33,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 34,
        },
      );

      await fetchMyPacks();

      const packPlayers = await getMethodFetch(
        `http://127.0.0.1:3000/api/store/generatePack/${pack.id}`,
      );

      const players = packPlayers.randomjatekosok;

      setCurrentPack(pack);
      setPackPlayersArr(players);

      setPackOpening(true);
      setOpeningStage("pack");

      setTimeout(() => setOpeningStage("confetti"), 2000);
      setTimeout(() => setOpeningStage("reveal"), 2700);
      setTimeout(() => setOpeningStage("full"), 9000);
    } catch (error) {
      console.log(error);
    }
  };

  //!Pack vásárlás
  const handleBuy = async (pack) => {
    try {
      await fetchClub();

      const coins = await getMethodFetch(
        "http://127.0.0.1:3000/api/users/me/coins",
      );

      if (coins.coinNumber < pack.packPrice) {
        setModal("noCoins");
        return;
      }

      await postMethodFetch("http://127.0.0.1:3000/api/updatecoins", {
        coins: -pack.packPrice,
      });

      window.dispatchEvent(new Event("coinsUpdated"));

      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 29,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 30,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 31,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 32,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 33,
        },
      );
      await postMethodFetch(
        "http://127.0.0.1:3000/api/users/me/objectiveprogress",
        {
          subId: 34,
        },
      );

      const packPlayers = await getMethodFetch(
        `http://127.0.0.1:3000/api/store/generatePack/${pack.id}`,
      );

      const players = packPlayers.randomjatekosok;

      await postMethodFetch("http://127.0.0.1:3000/api/users/me/cardsopened", {
        cards: players.length,
      });

      setCurrentPack(pack);
      setPackPlayersArr(players);

      setPackOpening(true);
      setOpeningStage("pack");

      setTimeout(() => setOpeningStage("confetti"), 2000);
      setTimeout(() => setOpeningStage("reveal"), 2700);
      setTimeout(() => setOpeningStage("full"), 9000);
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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  //! Duplicates
  const duplicates = packPlayersArr.filter((p) =>
    clubPlayers.some((c) => String(c.player_id) === String(p.player_id)),
  );

  const nonDuplicates = packPlayersArr.filter(
    (p) =>
      !clubPlayers.some((c) => String(c.player_id) === String(p.player_id)),
  );

  //! Játékos hozzáadása a klub-hoz
  const handleSendAllToClub = async () => {
    try {
      await postMethodFetch(
        "http://127.0.0.1:3000/api/myclub/addPlayersToClub",
        {
          players: nonDuplicates,
        },
      );

      await fetchClub();

      setPackPlayersArr(duplicates);

      if (duplicates.length === 0) {
        setPackOpening(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //! Csak duplicate ellenőrzése
  const onlyDuplicates = nonDuplicates.length === 0;

  //! Objective progress-ek
  useEffect(() => {
    const updateObjective = async () => {
      const hasToty = Object.values(packPlayersArr).some(
        (p) => p?.rarity === "toty",
      );

      if (hasToty) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 36,
          },
        );
      }

      const hasFlashback = Object.values(packPlayersArr).some(
        (p) => p?.rarity === "flashback",
      );

      if (hasFlashback) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 39,
          },
        );
      }

      const hasScream = Object.values(packPlayersArr).some(
        (p) => p?.rarity === "scream",
      );

      if (hasScream) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 42,
          },
        );
      }

      const hasIcon = Object.values(packPlayersArr).some(
        (p) => p?.rarity === "icon",
      );

      if (hasIcon) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 46,
          },
        );
      }

      const hasWalkout = Object.values(packPlayersArr).some(
        (p) => Number(p?.overall) >= 86,
      );

      if (hasWalkout) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 44,
          },
        );
      }

      const hasNinety = Object.values(packPlayersArr).some(
        (p) => Number(p?.overall) >= 90,
      );

      if (hasNinety) {
        await postMethodFetch(
          "http://127.0.0.1:3000/api/users/me/objectiveprogress",
          {
            subId: 45,
          },
        );
      }
    };
    updateObjective();
  }, [packPlayersArr]);

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
          {current.length === 0 ? (
            <p className="noText">NO PACKS</p>
          ) : (
            current.map((pack) => {
              const img = packImages[pack.packDesign] || special;

              return (
                <div key={pack.id} className="packCard">
                  <img src={img} alt="pack" className="packImage" />

                  <p>{pack.packName}</p>

                  {activeTab === "mypacks" && (
                    <button
                      className="storeBtn"
                      onClick={() => handleOpen(pack)}
                    >
                      Open
                    </button>
                  )}

                  {activeTab === "buypacks" && (
                    <>
                      <p className="price">
                        {pack.packPrice.toLocaleString("hu-HU")}
                        <img src={Coins} alt="coins" />
                      </p>

                      <button
                        className="storeBtn"
                        onClick={() => {
                          setSelectedPack(pack);
                          setModal("buy");
                        }}
                      >
                        Buy
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pack opening */}
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
                    disabled={onlyDuplicates}
                  >
                    Send all players to my club
                  </button>
                </div>

                {/* Nem duplicate-ek */}
                {nonDuplicates.map((player) => (
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
                        onClick={() => {
                          setSelectedPlayer(player);
                          setModal("quickSell");
                        }}
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

                {/* Duplicate-ek */}
                {duplicates.length > 0 && (
                  <>
                    <h3 style={{ color: "red" }}>DUPLICATES</h3>

                    {duplicates.map((player, index) => (
                      <div
                        key={`${player.player_id}-${index}`}
                        className="cardRow duplicate"
                      >
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
                            onClick={() => {
                              setSelectedPlayer(player);
                              setModal("quickSell");
                            }}
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
                  </>
                )}

                <div className="packBottom">
                  <button
                    className="storeBtnPack"
                    onClick={() => setModal("quickSellAll")}
                  >
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

      {/* Confirm modal */}
      {modal &&
        createPortal(
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              {modal === "buy" && (
                <>
                  <p>
                    Are you sure you want to buy this pack for{" "}
                    {selectedPack.packPrice.toLocaleString("hu-HU")} coins?
                  </p>

                  <div className="modalBtns">
                    <button onClick={() => setModal(null)} className="noButton">
                      No
                    </button>
                    <button
                      onClick={() => {
                        handleBuy(selectedPack);
                        setModal(null);
                      }}
                      className="yesButton"
                    >
                      Yes
                    </button>
                  </div>
                </>
              )}

              {modal === "noCoins" && (
                <>
                  <p>Not enough coins</p>
                  <button
                    onClick={() => setModal(null)}
                    className="backIconBtn"
                  >
                    <img src={BackIcon} className="backIcon" />
                    <p>Back</p>
                  </button>
                </>
              )}

              {modal === "quickSell" && (
                <>
                  <p>
                    Are you sure you want to quick sell this player for{" "}
                    {selectedPlayer.value.toLocaleString("hu-HU")} coins?
                  </p>

                  <div className="modalBtns">
                    <button onClick={() => setModal(null)} className="noButton">
                      No
                    </button>
                    <button
                      onClick={() => {
                        handleQuickSell(selectedPlayer);
                        setModal(null);
                      }}
                      className="yesButton"
                    >
                      Yes
                    </button>
                  </div>
                </>
              )}

              {modal === "quickSellAll" && (
                <>
                  <p>
                    Are you sure you want to quick sell all players for{" "}
                    {packPlayersArr
                      .reduce((sum, p) => sum + p.value, 0)
                      .toLocaleString("hu-HU")}{" "}
                    coins?
                  </p>

                  <div className="modalBtns">
                    <button onClick={() => setModal(null)} className="noButton">
                      No
                    </button>
                    <button
                      onClick={() => {
                        handleQuickSellAll();
                        setModal(null);
                      }}
                      className="yesButton"
                    >
                      Yes
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

const getMethodFetch = async (url) => {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("GET hiba");
  return await response.json();
};

const postMethodFetch = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return await response.json();
};

export default Store;
