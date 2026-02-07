import { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { GameScores } from "../types/game";
import HoleSlide from "./HoleSlide";
import HoleThumbnail from "./HoleThumbnail";
import { isHoleComplete } from "../rules/dots";
import "../styles/ScoreSlider.css";

type ScoreSliderProps = {
    players: string[];
    scores: GameScores;
    currentHole: number;
    onHoleChange: (index: number) => void;
    onScoreChange: (
        holeIndex: number,
        player: string,
        delta: number
    ) => void;
};

export default function ScoreSlider({
    players,
    scores,
    currentHole,
    onHoleChange,
    onScoreChange,
}: ScoreSliderProps) {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        initial: currentHole,
        slides: { perView: 1 },
        slideChanged(s) {
            onHoleChange(s.track.details.rel);
        },
    });

    useEffect(() => {
        if (!slider) return;
        slider.current?.update();
    }, [slider, scores.length]);

    useEffect(() => {
        if (!slider) return;

        const clamped =
            Math.min(currentHole, scores.length - 1);

        slider.current?.moveToIdx(clamped);
    }, [slider, currentHole, scores.length]);

    const handleJumpToHole = (index: number) => {
        slider.current?.moveToIdx(index, true, { duration: 0 });
    };

    return (
        <div className="score-slider-wrapper">
            <div
                ref={sliderRef}
                className="keen-slider"
            >
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
                            isActive={currentHole === index}
                            isComplete={isHoleComplete(hole)}
                            onClick={handleJumpToHole}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
