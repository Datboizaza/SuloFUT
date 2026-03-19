import "./Objectives.css";

function Objectives() {
  const proba = async () => {
    try {
      const results = await getMethodFetch(
        "http://127.0.0.1:3000/api/objectives",
      );

      results.results.forEach((element) => {
        const key = Object.keys(element)[0];
        const array = element[key];
        console.log(key);
        array.forEach((valami) => {
          console.log(valami);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  proba();

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
