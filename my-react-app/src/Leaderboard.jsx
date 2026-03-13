import { useState } from "react";
import "./Leaderboard.css";

function Leaderboard() {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState("Top Squad");

  const leaderboardOptions = [
    "Top Squad",
    "Club Value",
    "Best Draft",
    "Cards opened",
    "Total earnings",
  ];

  const rankings = [
    { rank: 1, account: "Bobber23", points: 194 },
    { rank: 2, account: "Bobber23", points: 194 },
    { rank: 3, account: "Bobber23", points: 194 },
    { rank: 4, account: "Bobber23", points: 194 },
    { rank: 5, account: "Bobber23", points: 194 },
    { rank: 6, account: "Bobber23", points: 194 },
    { rank: 7, account: "Bobber23", points: 194 },
    { rank: 8, account: "Bobber23", points: 194 },
    { rank: 9, account: "Bobber23", points: 194 },
    { rank: 10, account: "Bobber23", points: 194 },
    { rank: 11, account: "Bobber23", points: 194 },
    { rank: 12, account: "Bobber23", points: 194 },
    { rank: 13, account: "Bobber23", points: 194 },
    { rank: 14, account: "Bobber23", points: 194 },
    { rank: 15, account: "Bobber23", points: 194 },
    { rank: 16, account: "Bobber23", points: 194 },
    { rank: 17, account: "Bobber23", points: 194 },
    { rank: 18, account: "Bobber23", points: 194 },
    { rank: 19, account: "Bobber23", points: 194 },
    { rank: 20, account: "Bobber23", points: 194 },
  ];

  const handleLeaderboardChange = (event) => {
    setSelectedLeaderboard(event.target.value);
  };

  // const handleSearch = () => {
  //   console.log("Kiválasztott leaderboard:", selectedLeaderboard);
  //   // ide jöhet majd a backend fetch
  // };

  return (
    <>
      <div className="leaderboardDiv">
        <div className="row" id="leaderboardRow1">
          <h3 className="col-12 mt-3" id="actualLeaderboard">
            {selectedLeaderboard}
          </h3>
        </div>
        <div className="row" id="leaderboardRow2">
          <div className="col-12" id="selectLeaderboardDiv">
            <select
              name="selectLeaderboard"
              id="selectLeaderboard"
              aria-label="Select leaderboard"
              value={selectedLeaderboard}
              onChange={handleLeaderboardChange}
            >
              {leaderboardOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" className="btn" id="searchBtn">
              Search
            </button>
          </div>
        </div>
        <div className="row" id="leaderboardRow3">
          <div className="col-12" id="rankingsDiv">
            <h4 id="rankingsTitle">Rankings</h4>
            <table className="table table-dark table-hover" id="rankingsTable">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Account</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((player) => (
                  <tr key={player.rank}>
                    <th>{player.rank}</th>
                    <td>{player.account}</td>
                    <td>{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
