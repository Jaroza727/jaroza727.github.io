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
type ActionType = DotType | "bonus" | "penalty";

export default function HoleSlide({
  holeIndex,
  totalHoles,
  hole,
  players,
  totalScores,
  onScoreChange,
}: HoleSlideProps) {
  const [activeAction, setActiveAction] =
    useState<ActionType | null>(null);
  const [dotAssignments, setDotAssignments] = useState<
    Record<DotType, string | null>
  >({
    drive: null,
    on: null,
    in: null,
  });
  const [bonusAssignees, setBonusAssignees] = useState<
    Record<string, number>
  >({});
  const [penaltyAssignees, setPenaltyAssignees] = useState<
    Record<string, number>
  >({});

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
    setBonusAssignees((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((name) => {
        if (!players.includes(name)) {
          delete next[name];
        }
      });
      return next;
    });
    setPenaltyAssignees((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((name) => {
        if (!players.includes(name)) {
          delete next[name];
        }
      });
      return next;
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
      setBonusAssignees({});
      setPenaltyAssignees({});
    }
  }, [hole, players]);

  const openPicker = (action: ActionType) => {
    setActiveAction(action);
  };

  const closePicker = () => {
    setActiveAction(null);
  };

  const handleSelectPlayer = (player: string) => {
    if (!activeAction) return;

    if (activeAction === "bonus") {
      const current = bonusAssignees[player] ?? 0;
      if (current > 0) {
        onScoreChange(holeIndex, player, -1);
        setBonusAssignees((prev) => {
          const next = { ...prev };
          const updated = (next[player] ?? 0) - 1;
          if (updated <= 0) {
            delete next[player];
          } else {
            next[player] = updated;
          }
          return next;
        });
      } else {
        onScoreChange(holeIndex, player, 1);
        setBonusAssignees((prev) => ({
          ...prev,
          [player]: 1,
        }));
      }
      setActiveAction(null);
      return;
    }

    if (activeAction === "penalty") {
      const current = penaltyAssignees[player] ?? 0;
      if (current > 0) {
        onScoreChange(holeIndex, player, 1);
        setPenaltyAssignees((prev) => {
          const next = { ...prev };
          const updated = (next[player] ?? 0) - 1;
          if (updated <= 0) {
            delete next[player];
          } else {
            next[player] = updated;
          }
          return next;
        });
      } else {
        onScoreChange(holeIndex, player, -1);
        setPenaltyAssignees((prev) => ({
          ...prev,
          [player]: 1,
        }));
      }
      setActiveAction(null);
      return;
    }

    const previousPlayer = dotAssignments[activeAction];
    if (previousPlayer && previousPlayer !== player) {
      onScoreChange(holeIndex, previousPlayer, -1);
    }

    if (previousPlayer !== player) {
      onScoreChange(holeIndex, player, 1);
    }

    setDotAssignments((prev) => ({
      ...prev,
      [activeAction]: player,
    }));

    setActiveAction(null);
  };

  const getDotLabel = (dot: DotType) => {
    if (dot === "drive") return "Who got drive?";
    if (dot === "on") return "Who was first on?";
    return "Who was first in?";
  };

  const getActionLabel = (action: ActionType) => {
    if (action === "bonus")
      return "Who got V dot? (tap again to remove)";
    if (action === "penalty")
      return "Who took a penalty? (tap again to remove)";
    return getDotLabel(action);
  };

  const getDotValue = (dot: DotType) =>
    dotAssignments[dot] ?? "Unassigned";

  const sortedPlayers = [...players].sort((a, b) => {
    const diff =
      (totalScores[b] ?? 0) - (totalScores[a] ?? 0);
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });

  const renderAssignees = (assignees: Record<string, number>) => {
    const entries = Object.entries(assignees);
    if (entries.length === 0) {
      return (
        <span className="dot-button__value dot-button__value--small">
          Unassigned
        </span>
      );
    }
    return (
      <span className="dot-assignee-list">
        {entries.map(([name, count]) => (
          <span key={name} className="dot-assignee-chip">
            {name}
            {count > 1 ? ` x${count}` : ""}
          </span>
        ))}
      </span>
    );
  };

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

      <div className="dot-button-row">
        <button
          className="dot-button dot-button--bonus dot-button--small"
          onClick={() => openPicker("bonus")}
        >
          + V Dot
          {renderAssignees(bonusAssignees)}
        </button>
        <button
          className="dot-button dot-button--penalty dot-button--small"
          onClick={() => openPicker("penalty")}
        >
          - Penalty
          {renderAssignees(penaltyAssignees)}
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
        isOpen={activeAction !== null}
        onClose={closePicker}
        title="Select Player"
      >
        <p className="dot-modal-prompt">
          {activeAction ? getActionLabel(activeAction) : ""}
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
