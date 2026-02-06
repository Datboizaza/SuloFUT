import "./Leaderboard.css";

function Leaderboard() {
  return (
    <>
      <div id="leaderboardDiv">
        <div className="row" id="leaderboardRow1">
          <h3 className="col-12 mt-3" id="actualLeaderboard">
            Top Squad
          </h3>
        </div>
        <div className="row" id="leaderboardRow2">
          <div className="col-12" id="selectLeaderboardDiv">
            <select
              name="selectLeaderboard"
              id="selectLeaderboard"
              aria-label="Select leaderboard"
              onChange={actualLeaderboard}
            >
              <option defaultValue>Top Squad</option>
              <option value="Club Value">Club Value</option>
              <option value="Best Draft">Best Draft</option>
              <option value="Cards opened">Cards opened</option>
              <option value="Total earnings">Total earnings</option>
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
                <tr>
                  <th>1</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>6</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>7</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>8</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>9</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>10</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>11</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>12</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>13</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>14</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>15</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>16</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>17</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>18</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>19</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
                <tr>
                  <th>20</th>
                  <td>Bobber23</td>
                  <td>194</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const actualLeaderboard = () => {
  const selectedLeaderboard =
    document.getElementById("selectLeaderboard").value;
  const leaderboardTitle = document.getElementById("actualLeaderboard");
  leaderboardTitle.innerHTML = selectedLeaderboard;
};

export default Leaderboard;
