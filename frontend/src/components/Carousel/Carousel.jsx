import { useState, useEffect } from "react";
import "./Carousel.css";
import TotyCarousel from "../../assets/totycarousel.png";
import IconCarousel from "../../assets/iconcarousel.png";
import HeroCarousel from "../../assets/herocarousel.png";
import FlashbackCarousel from "../../assets/flashbackcarousel.png";
import ScreamCarousel from "../../assets/screamcarousel.png";

const slides = [
  {
    image: TotyCarousel,
    title: "TOTY IS OUT NOW",
    text: "The Best of '25 are in packs!",
  },
  {
    image: IconCarousel,
    title: "LEGENDS NEVER DIE",
    text: "Football’s greatest icons return to the pitch.",
  },
  {
    image: HeroCarousel,
    title: "HEROES ARE IN PACKS",
    text: "Celebrate unforgettable moments with heroes.",
  },
  {
    image: FlashbackCarousel,
    title: "FLASHBACK TEAM IS OUT NOW",
    text: "Think back to their prime.",
  },
  {
    image: ScreamCarousel,
    title: "SCREAM TEAM IS OUT NOW",
    text: "They are really scary!",
  },
];

function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <div className="carousel-slide">
        <h2>{slides[index].title}</h2>
        <p>{slides[index].text}</p>
        <img src={slides[index].image} alt={slides[index].title} />
      </div>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
