import { useEffect, useState } from "react";
import "./Leaderboard.css";
import Coins from "../../assets/coins.png";

//! Type-ok
const typeMap = {
  "Top Squad": "top_squad",
  "Club Value": "club_value",
  "Best Draft": "best_draft",
  "Cards opened": "cards_opened",
};

function Leaderboard() {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState("Top Squad");
  const [rankings, setRankings] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  //! Leaderboard opciók
  const leaderboardOptions = [
    "Top Squad",
    "Club Value",
    "Best Draft",
    "Cards opened",
  ];

  //! Leaderboard fetchelése
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const type = typeMap[selectedLeaderboard];

        const data = await getMethodFetch(
          `http://127.0.0.1:3000/api/leaderboard/${type}`,
        );

        const ranked = data.results.map((player, index) => ({
          rank: index + 1,
          account: player.username,
          points: player.points,
        }));

        setRankings(ranked);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLeaderboard();
  }, [selectedLeaderboard]);

  //! User fetchelése
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMethodFetch("http://127.0.0.1:3000/api/users/me");
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="leaderboardDiv">
      <div id="leaderboardRow1">
        <h3 id="actualLeaderboard">{selectedLeaderboard.toUpperCase()}</h3>
        <div className="selectLeaderboard">
          <div
            className="selectBox"
            onClick={() => setOpenDropdown((prev) => !prev)}
          >
            {selectedLeaderboard}
            <span className="arrow">▼</span>
          </div>

          {openDropdown && (
            <div className="options">
              {leaderboardOptions.map((option) => (
                <div
                  key={option}
                  className="option"
                  onClick={() => {
                    setSelectedLeaderboard(option);
                    setOpenDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard táblázat */}
      <div className="row" id="leaderboardRow3">
        <div className="col-12" id="rankingsDiv">
          <h4 id="rankingsTitle">Rankings</h4>

          <table className="table table-dark table-hover" id="rankingsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Account</th>
                <th>{selectedLeaderboard}</th>
              </tr>
            </thead>

            <tbody>
              {rankings.map((player) => (
                <tr
                  key={player.rank}
                  className={`
                    ${player.rank === 1 ? "gold" : ""}
                    ${player.rank === 2 ? "silver" : ""}
                    ${player.rank === 3 ? "bronze" : ""}
                    ${player.account === currentUser ? "currentUser" : ""}
                  `}
                >
                  <th className="col-4">{player.rank}</th>
                  <td className="col-4">{player.account}</td>
                  <td className="col-4">
                    {player.points.toLocaleString()}

                    {selectedLeaderboard === "Club Value" && (
                      <img src={Coins} alt="coin" className="coinIcon" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

export default Leaderboard;
