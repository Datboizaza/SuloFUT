import Coins from "../../assets/coins.png";
import SpecialPack from "../../assets/specialpack.png";

function Reward({ reward }) {
  if (!reward) return null;

  return (
    <div className="reward">
      {reward.coins && (
        <span className="coins">
          {reward.coins}
          <img src={Coins} className="coinImg" />
        </span>
      )}

      {reward.packs?.map((p) => (
        <span key={p.id} className="pack">
          <img src={SpecialPack} className="packImg" />
          {p.name}
        </span>
      ))}
    </div>
  );
}

export default Reward;
