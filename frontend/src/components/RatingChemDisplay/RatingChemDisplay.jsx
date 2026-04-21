import { createPortal } from "react-dom";

function RatingChemDisplay({ teamRating, teamChemistry, ratingStars, title }) {
  return createPortal(
    <div className="chemRatingDisplay">
      <h4 className="draftSquadText">{title.toLowerCase()}</h4>

      <div className="ratingStars">{ratingStars(teamRating)}</div>

      <h5 className="ratingText">
        Rating{" "}
        <span id="ratingNum" className="ratingNum">
          {teamRating}
        </span>
      </h5>

      <h5 className="chemText">
        Chemistry{" "}
        <span id="chemNum" className="chemNum">
          {teamChemistry}
        </span>
      </h5>
    </div>,
    document.body,
  );
}

export default RatingChemDisplay;
