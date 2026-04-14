import InterMilan from "../../assets/intermilan.png";
import ACMilan from "../../assets/acmilan.png";
import Atalanta from "../../assets/atalanta.png";
import Lazio from "../../assets/lazio.png";
import AltPlayerImg from "../../assets/altPlayerImg.png";
import Bronze from "../../assets/BronzeRare.png";
import Silver from "../../assets/SilverRare.png";
import Gold from "../../assets/goldRare.png";
import Hero from "../../assets/Hero.png";
import Icon from "../../assets/Icon.png";
import Toty from "../../assets/toty.png";
import Scream from "../../assets/Scream.png";
import Flashback from "../../assets/Flashback.png";
import ClubLeagueAlt from "../../assets/clubalt.png";
import NationAlt from "../../assets/nationalt.png";

import "./PlayerCard.css";

import { memo } from "react";

function PlayerCard({
  player,
  chemImg,
  playerChemMap,
  displayedPosition,
  slotPos,
  isModal,
}) {
  if (!player) return null;

  //! Card szövegek
  const getText = (rarity) => {
    switch (rarity) {
      case "bronze":
        return "text-bronze";
      case "silver":
        return "text-silver";
      case "gold":
        return "text-gold";
      case "icon":
        return "text-icon";
      case "toty":
        return "text-toty";
      case "hero":
        return "text-hero";
      case "scream":
        return "text-scream";
      case "flashback":
        return "text-flashback";
      default:
        return "text-gold";
    }
  };

  //! Card design-ok
  const rarityImgs = {
    bronze: Bronze,
    silver: Silver,
    gold: Gold,
    icon: Icon,
    hero: Hero,
    toty: Toty,
    scream: Scream,
    flashback: Flashback,
  };

  const isGK = player.player_positions === "GK";
  const textClass = getText(player.rarity);
  const altPositions = [];
  player.player_positions.split(", ").forEach((element) => {
    if (element !== displayedPosition(player, slotPos)) {
      altPositions.push(element);
    }
  });

  return (
    <>
      <img
        loading="lazy"
        src={rarityImgs[player.rarity]}
        className={"cardDesign " + player.rarity}
        alt="Card"
      />

      <p className={`cardOverall ${textClass}`}>{player.overall}</p>
      <p className={`cardPosition ${textClass}`}>
        {displayedPosition(player, slotPos)}
      </p>
      <p className={`cardAltPosition ${textClass}`}>
        {altPositions.map((pos, index) => (
          <span key={index}>{pos}</span>
        ))}
      </p>

      <img
        loading="lazy"
        className="cardImg"
        src={player.player_face_url}
        alt="Player Image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = AltPlayerImg;
        }}
      />
      <img
        loading="lazy"
        className="cardNationality"
        src={player.nation_url}
        alt="Nationality Image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = NationAlt;
        }}
      />
      <img
        loading="lazy"
        className="cardLeague"
        src={player.league_url}
        alt="League Image"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = ClubLeagueAlt;
        }}
      />

      {player.rarity !== "icon" && player.rarity !== "hero" && (
        <img
          loading="lazy"
          className="cardClub"
          src={player.club_team_url}
          alt="Club Image"
          onError={(e) => {
            e.currentTarget.onerror = null;

            if (player.club_name === "Inter") {
              e.currentTarget.src = InterMilan;
            } else if (player.club_name === "AC Milan") {
              e.currentTarget.src = ACMilan;
            } else if (player.club_name === "Lazio") {
              e.currentTarget.src = Lazio;
            } else if (player.club_name === "Atalanta") {
              e.currentTarget.src = Atalanta;
            } else {
              e.currentTarget.src = ClubLeagueAlt;
            }
          }}
        />
      )}

      <p className={`cardName ${textClass}`}>{player.short_name}</p>

      {!isModal && (
        <img
          loading="lazy"
          src={chemImg(playerChemMap[player.player_id])}
          className="chemStars"
        />
      )}

      {isGK ? (
        <div>
          {" "}
          <div className="cardPlayerDiving">
            <p className={`cardPlayerDivingNumber ${getText(player.rarity)}`}>
              {player.goalkeeping_diving}
            </p>
            <p className={`cardPlayerDivingText ${getText(player.rarity)}`}>
              DIV
            </p>
          </div>
          <div className="cardPlayerHandling">
            <p className={`cardPlayerHandlingNumber ${getText(player.rarity)}`}>
              {player.goalkeeping_handling}
            </p>
            <p className={`cardPlayerHandlingText ${getText(player.rarity)}`}>
              HAN
            </p>
          </div>
          <div className="cardPlayerKicking">
            <p className={`cardPlayerKickingNumber ${getText(player.rarity)}`}>
              {player.goalkeeping_kicking}
            </p>
            <p className={`cardPlayerKickingText ${getText(player.rarity)}`}>
              KIC
            </p>
          </div>
          <div className="cardPlayerReflexes">
            <p className={`cardPlayerReflexesNumber ${getText(player.rarity)}`}>
              {player.goalkeeping_reflexes}
            </p>
            <p className={`cardPlayerReflexesText ${getText(player.rarity)}`}>
              REF
            </p>
          </div>
          <div className="cardPlayerSpeed">
            <p className={`cardPlayerSpeedNumber ${getText(player.rarity)}`}>
              {player.goalkeeping_speed}
            </p>
            <p className={`cardPlayerSpeedText ${getText(player.rarity)}`}>
              SPD
            </p>
          </div>
          <div className="cardPlayerPositioning">
            <p
              className={`cardPlayerPositioningNumber ${getText(player.rarity)}`}
            >
              {player.goalkeeping_positioning}
            </p>
            <p
              className={`cardPlayerPositioningText ${getText(player.rarity)}`}
            >
              POS
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="cardPlayerPace">
            <p className={`cardPlayerPaceNumber ${getText(player.rarity)}`}>
              {player.pace}
            </p>
            <p className={`cardPlayerPaceText ${getText(player.rarity)}`}>
              PAC
            </p>
          </div>
          <div className="cardPlayerShooting">
            <p className={`cardPlayerShootingNumber ${getText(player.rarity)}`}>
              {player.shooting}
            </p>
            <p className={`cardPlayerShootingText ${getText(player.rarity)}`}>
              SHO
            </p>
          </div>
          <div className="cardPlayerDribbling">
            <p
              className={`cardPlayerDribblingNumber ${getText(player.rarity)}`}
            >
              {player.dribbling}
            </p>
            <p className={`cardPlayerDribblingText ${getText(player.rarity)}`}>
              DRI
            </p>
          </div>
          <div className="cardPlayerPassing">
            <p className={`cardPlayerPassingNumber ${getText(player.rarity)}`}>
              {player.passing}
            </p>
            <p className={`cardPlayerPassingText ${getText(player.rarity)}`}>
              PAS
            </p>
          </div>
          <div className="cardPlayerDefending">
            <p
              className={`cardPlayerDefendingNumber ${getText(player.rarity)}`}
            >
              {player.defending}
            </p>
            <p className={`cardPlayerDefendingText ${getText(player.rarity)}`}>
              DEF
            </p>
          </div>
          <div className="cardPlayerPhysic">
            <p className={`cardPlayerPhysicNumber ${getText(player.rarity)}`}>
              {player.physic}
            </p>
            <p className={`cardPlayerPhysicText ${getText(player.rarity)}`}>
              PHY
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(PlayerCard);
