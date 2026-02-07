import { useEffect, useState } from "react";
import { HoleScores } from "../types/game";
import Modal from "./Modal";

type HoleSlideProps = {
  holeIndex: number;
  totalHoles: number;
  hole: HoleScores;
  players: string[];
  totalScores: Record<string, number>;
  onScoreChange: (
    holeIndex: number,
    player: string,
    delta: number
  ) => void;
};

type DotType = "drive" | "on" | "in";

export default function HoleSlide({
  holeIndex,
  totalHoles,
  hole,
  players,
  totalScores,
  onScoreChange,
}: HoleSlideProps) {
  const [activeDot, setActiveDot] = useState<DotType | null>(
    null
  );
  const [dotAssignments, setDotAssignments] = useState<
    Record<DotType, string | null>
  >({
    drive: null,
    on: null,
    in: null,
  });

  useEffect(() => {
    setDotAssignments((prev) => {
      let changed = false;
      const next = { ...prev };
      (["drive", "on", "in"] as DotType[]).forEach(
        (key) => {
          if (
            next[key] &&
            !players.includes(next[key] as string)
          ) {
            next[key] = null;
            changed = true;
          }
        }
      );
      return changed ? next : prev;
    });
  }, [players]);

  useEffect(() => {
    const totalDots = players.reduce(
      (sum, player) => sum + (hole[player] ?? 0),
      0
    );
    if (totalDots === 0) {
      setDotAssignments({
        drive: null,
        on: null,
        in: null,
      });
    }
  }, [hole, players]);

  const openPicker = (dot: DotType) => {
    setActiveDot(dot);
  };

  const closePicker = () => {
    setActiveDot(null);
  };

  const handleSelectPlayer = (player: string) => {
    if (!activeDot) return;

    const previousPlayer = dotAssignments[activeDot];
    if (previousPlayer && previousPlayer !== player) {
      onScoreChange(holeIndex, previousPlayer, -1);
    }

    if (previousPlayer !== player) {
      onScoreChange(holeIndex, player, 1);
    }

    setDotAssignments((prev) => ({
      ...prev,
      [activeDot]: player,
    }));

    setActiveDot(null);
  };

  const getDotLabel = (dot: DotType) => {
    if (dot === "drive") return "Who got drive?";
    if (dot === "on") return "Who was first on?";
    return "Who was first in?";
  };

  const getDotValue = (dot: DotType) =>
    dotAssignments[dot] ?? "Unassigned";

  const sortedPlayers = [...players].sort((a, b) => {
    const diff =
      (totalScores[b] ?? 0) - (totalScores[a] ?? 0);
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });

  return (
    <div className="keen-slider__slide score-slide">
      <h2>
        Hole {holeIndex + 1} / {totalHoles}
      </h2>

      <div className="dot-button-grid">
        <button
          className="dot-button dot-button--drive"
          onClick={() => openPicker("drive")}
        >
          <span className="dot-button__label">
            {getDotLabel("drive")}
          </span>
          <span className="dot-button__value">
            {getDotValue("drive")}
          </span>
        </button>

        <button
          className="dot-button dot-button--on"
          onClick={() => openPicker("on")}
        >
          <span className="dot-button__label">
            {getDotLabel("on")}
          </span>
          <span className="dot-button__value">
            {getDotValue("on")}
          </span>
        </button>

        <button
          className="dot-button dot-button--in"
          onClick={() => openPicker("in")}
        >
          <span className="dot-button__label">
            {getDotLabel("in")}
          </span>
          <span className="dot-button__value">
            {getDotValue("in")}
          </span>
        </button>
      </div>

      <div className="hole-scoreboard">
        <div className="hole-scoreboard__title">
          Total scores
        </div>
        <ul className="hole-scoreboard__list">
          {sortedPlayers.map((player, index) => (
            <li
              key={player}
              className={`hole-scoreboard__row hole-scoreboard__row--rank-${index + 1}`}
            >
              <span className="hole-scoreboard__rank">
                {index + 1}
              </span>
              <span className="hole-scoreboard__name">
                {player}
              </span>
              <span className="hole-scoreboard__value">
                {totalScores[player] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={activeDot !== null}
        onClose={closePicker}
        title="Select Player"
      >
        <p className="dot-modal-prompt">
          {activeDot ? getDotLabel(activeDot) : ""}
        </p>
        <div className="dot-player-list">
          {players.map((player) => (
            <button
              key={player}
              className="dot-player-button"
              onClick={() => handleSelectPlayer(player)}
            >
              {player}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
