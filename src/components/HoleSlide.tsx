import { HoleScores } from "../types/game";

type HoleSlideProps = {
  holeIndex: number;
  totalHoles: number;
  hole: HoleScores;
  players: string[];
  onScoreChange: (
    holeIndex: number,
    player: string,
    delta: number
  ) => void;
};

export default function HoleSlide({
  holeIndex,
  totalHoles,
  hole,
  players,
  onScoreChange,
}: HoleSlideProps) {
  return (
    <div className="keen-slider__slide score-slide">
      <h2>
        Hole {holeIndex + 1} / {totalHoles}
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
  );
}
