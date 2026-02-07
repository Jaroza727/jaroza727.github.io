import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { GameScores } from "../types/game";
import HoleSlide from "./HoleSlide";
import HoleThumbnail from "./HoleThumbnail";
import { isHoleComplete } from "../rules/dots";
import "../styles/ScoreSlider.css";

type ScoreSliderProps = {
  players: string[];
  scores: GameScores;
  onScoreChange: (
    holeIndex: number,
    player: string,
    delta: number
  ) => void;
};

export default function ScoreSlider({
  players,
  scores,
  onScoreChange,
}: ScoreSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 1 },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  useEffect(() => {
    slider.current?.update();
  }, [scores.length]);

  useEffect(() => {
    if (currentSlide >= scores.length) {
      slider.current?.moveToIdx(scores.length - 1);
    }
  }, [scores.length, currentSlide]);

  return (
    <div className="score-slider-wrapper">
      <div ref={sliderRef} className="keen-slider">
        {scores.map((hole, index) => (
          <HoleSlide
            key={index}
            holeIndex={index}
            totalHoles={scores.length}
            hole={hole}
            players={players}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>

      <div className="hole-thumbnails-outer">
        <div className="hole-thumbnails">
          {scores.map((hole, index) => (
            <HoleThumbnail
              key={index}
              index={index}
              hole={hole}
              isActive={currentSlide === index}
              isComplete={isHoleComplete(hole)}
              onClick={(i) =>
                slider.current?.moveToIdx(i)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
