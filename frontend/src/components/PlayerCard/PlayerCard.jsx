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

import { getRarityClass } from "../../utilities/utilities";

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

  //! Ellenőrzések
  const isGK = player.player_positions === "GK";
  const textClass = getRarityClass(player.rarity);
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
        src={player.card_design_url || rarityImgs[player.rarity]}
        className={"cardDesign " + player.rarity}
        alt="Card"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = rarityImgs[player.rarity] || Gold;
        }}
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
            <p
              className={`cardPlayerDivingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_diving}
            </p>
            <p
              className={`cardPlayerDivingText ${getRarityClass(player.rarity)}`}
            >
              DIV
            </p>
          </div>
          <div className="cardPlayerHandling">
            <p
              className={`cardPlayerHandlingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_handling}
            </p>
            <p
              className={`cardPlayerHandlingText ${getRarityClass(player.rarity)}`}
            >
              HAN
            </p>
          </div>
          <div className="cardPlayerKicking">
            <p
              className={`cardPlayerKickingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_kicking}
            </p>
            <p
              className={`cardPlayerKickingText ${getRarityClass(player.rarity)}`}
            >
              KIC
            </p>
          </div>
          <div className="cardPlayerReflexes">
            <p
              className={`cardPlayerReflexesNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_reflexes}
            </p>
            <p
              className={`cardPlayerReflexesText ${getRarityClass(player.rarity)}`}
            >
              REF
            </p>
          </div>
          <div className="cardPlayerSpeed">
            <p
              className={`cardPlayerSpeedNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_speed}
            </p>
            <p
              className={`cardPlayerSpeedText ${getRarityClass(player.rarity)}`}
            >
              SPD
            </p>
          </div>
          <div className="cardPlayerPositioning">
            <p
              className={`cardPlayerPositioningNumber ${getRarityClass(player.rarity)}`}
            >
              {player.goalkeeping_positioning}
            </p>
            <p
              className={`cardPlayerPositioningText ${getRarityClass(player.rarity)}`}
            >
              POS
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="cardPlayerPace">
            <p
              className={`cardPlayerPaceNumber ${getRarityClass(player.rarity)}`}
            >
              {player.pace}
            </p>
            <p
              className={`cardPlayerPaceText ${getRarityClass(player.rarity)}`}
            >
              PAC
            </p>
          </div>
          <div className="cardPlayerShooting">
            <p
              className={`cardPlayerShootingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.shooting}
            </p>
            <p
              className={`cardPlayerShootingText ${getRarityClass(player.rarity)}`}
            >
              SHO
            </p>
          </div>
          <div className="cardPlayerDribbling">
            <p
              className={`cardPlayerDribblingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.dribbling}
            </p>
            <p
              className={`cardPlayerDribblingText ${getRarityClass(player.rarity)}`}
            >
              DRI
            </p>
          </div>
          <div className="cardPlayerPassing">
            <p
              className={`cardPlayerPassingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.passing}
            </p>
            <p
              className={`cardPlayerPassingText ${getRarityClass(player.rarity)}`}
            >
              PAS
            </p>
          </div>
          <div className="cardPlayerDefending">
            <p
              className={`cardPlayerDefendingNumber ${getRarityClass(player.rarity)}`}
            >
              {player.defending}
            </p>
            <p
              className={`cardPlayerDefendingText ${getRarityClass(player.rarity)}`}
            >
              DEF
            </p>
          </div>
          <div className="cardPlayerPhysic">
            <p
              className={`cardPlayerPhysicNumber ${getRarityClass(player.rarity)}`}
            >
              {player.physic}
            </p>
            <p
              className={`cardPlayerPhysicText ${getRarityClass(player.rarity)}`}
            >
              PHY
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(PlayerCard);
