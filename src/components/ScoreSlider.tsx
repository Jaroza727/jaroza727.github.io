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
    onFinishRound: () => void;
};

export default function ScoreSlider({
    players,
    scores,
    currentHole,
    onHoleChange,
    onScoreChange,
    onFinishRound,
}: ScoreSliderProps) {
    const totalScores = players.reduce<Record<string, number>>(
        (acc, player) => {
            acc[player] = scores.reduce(
                (sum, hole) => sum + (hole[player] ?? 0),
                0
            );
            return acc;
        },
        {}
    );

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
            Math.min(currentHole, scores.length);

        slider.current?.moveToIdx(clamped);
    }, [slider, currentHole, scores.length]);

    const handleJumpToHole = (index: number) => {
        slider.current?.moveToIdx(index, true, { duration: 0 });
    };

    const sortedTotals = [...players].sort((a, b) => {
        const diff =
            (totalScores[b] ?? 0) - (totalScores[a] ?? 0);
        if (diff !== 0) return diff;
        return a.localeCompare(b);
    });

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
                        totalScores={totalScores}
                        onScoreChange={onScoreChange}
                    />
                ))}
                <div className="keen-slider__slide score-slide scoreboard-slide">
                    <h2>Scoreboard</h2>
                    <p className="scoreboard-subtitle">
                        Final totals across all holes
                    </p>
                    <ul className="scoreboard-list">
                        {sortedTotals.map((player, index) => (
                            <li
                                key={player}
                                className={`scoreboard-row scoreboard-row--rank-${index + 1}`}
                            >
                                <span className="scoreboard-rank">
                                    {index + 1}
                                </span>
                                <span className="scoreboard-name">
                                    {player}
                                </span>
                                <span className="scoreboard-value">
                                    {totalScores[player] ?? 0}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {currentHole === scores.length && (
                <div className="score-slider-actions">
                    <button
                        className="finish-round-button"
                        onClick={onFinishRound}
                    >
                        Finish Round
                    </button>
                </div>
            )}

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
                    <button
                        className={`hole-thumb hole-thumb--final ${currentHole === scores.length ? "active" : ""}`}
                        onClick={() => handleJumpToHole(scores.length)}
                        data-keen-slider-clickable="true"
                    >
                        Final
                    </button>
                </div>
            </div>
        </div>
    );
}
