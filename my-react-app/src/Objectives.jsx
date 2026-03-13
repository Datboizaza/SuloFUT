import "./Objectives.css";

function Objectives() {
  return (
    <>
      <div className="objectivesDiv">
        <div className="objectiveTile"></div>
      </div>
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

export default Objectives;
