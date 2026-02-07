import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { GameScores } from "../types/game";
import "keen-slider/keen-slider.min.css";
import "../styles/ScoreSlider.css"

const DOTS_PER_HOLE = 3;

type ScoreSliderProps = {
    players: string[];
    scores: GameScores;
    onScoreChange: (
        holeIndex: number,
        player: string,
        delta: number
    ) => void;
};

const isHoleComplete = (
    holeScores: Record<string, number>
): boolean => {
    const totalDots = Object.values(holeScores).reduce(
        (sum, dots) => sum + dots,
        0
    );

    return totalDots >= 3;
};

export default function ScoreSlider(props: ScoreSliderProps) {
    const { players, scores, onScoreChange} = props;

    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        slides: { perView: 1 },
        slideChanged(s) {
            setCurrentSlide(s.track.details.rel);
        },
    });

    useEffect(() => {
        if (currentSlide >= scores.length) {
            slider.current?.moveToIdx(scores.length - 1);
        }
    }, [scores.length, currentSlide]);

    return (
        <div className="score-slider-wrapper">
            <div ref={sliderRef} className="keen-slider">
                {scores.map((hole, holeIndex) => (
                    <div
                        key={holeIndex}
                        className="keen-slider__slide score-slide"
                    >
                        <h2>
                            Hole {holeIndex + 1} / {scores.length}
                        </h2>

                        <ul className="score-list">
                            {players.map((player) => (
                                <li key={player} className="score-row">
                                    <span>{player}</span>

                                    <div className="score-controls">
                                        <button
                                            onClick={() =>
                                                onScoreChange(holeIndex, player, -1)
                                            }
                                        >
                                            −
                                        </button>

                                        <span className="score-value">
                                            {hole[player]}
                                        </span>

                                        <button
                                            onClick={() =>
                                                onScoreChange(holeIndex, player, 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Thumbnail navigation */}
            <div className="hole-thumbnails-outer">
                <div className="hole-thumbnails">
                    {scores.map((hole, index) => {
                    const complete = isHoleComplete(hole);

                    return (
                        <button
                        key={index}
                        className={`hole-thumb
                            ${currentSlide === index ? "active" : ""}
                            ${complete ? "complete" : ""}
                        `}
                        onClick={() => slider.current?.moveToIdx(index)}
                        >
                        {index + 1}
                        </button>
                    );
                    })}
                </div>
            </div>
        </div>
    );
}
