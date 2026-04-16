import { useState, useEffect } from "react";
import "./Club.css";

function Club() {
  const [myClubPlayers, setMyClubPlayers] = useState([]);

  //!Club fetch
  const myClubFetch = async () => {
    try {
      const clubPlayers = await getMethodFetch(
        `http://127.0.0.1:3000/api/myclub`,
      );

      setMyClubPlayers(clubPlayers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myClubFetch();
  }, []);

  return (
    <>
      <div className="clubContainer"></div>
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

// const postMethodFetch = async (url, data) => {
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error(`POST Hiba: ${response.status} ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     throw new Error(`Hiba történt: ${error.message}`);
//   }
// };

export default Club;
