import { useState } from "react";
import { GameScores } from "../types/game";

const createEmptyScores = (
  holes: number,
  players: string[]
): GameScores =>
  Array.from({ length: holes }, () =>
    Object.fromEntries(players.map((p) => [p, 0]))
  );

const reconcileScores = (
  prevScores: GameScores,
  holes: number,
  players: string[]
): GameScores =>
  Array.from({ length: holes }, (_, holeIndex) => {
    const prevHole = prevScores[holeIndex];

    const nextHole: Record<string, number> = {};

    for (const player of players) {
      nextHole[player] =
        prevHole && typeof prevHole[player] === "number"
          ? prevHole[player]
          : 0;
    }

    return nextHole;
  });

export function useScores() {
  const [scores, setScores] = useState<GameScores>([]);

  const startNewGame = (holes: number, players: string[]) => {
    setScores(createEmptyScores(holes, players));
  };

  const updateGame = (holes: number, players: string[]) => {
    setScores((prev) =>
      reconcileScores(prev, holes, players)
    );
  };

  const changeScore = (
    holeIndex: number,
    player: string,
    delta: number
  ) => {
    setScores((prev) =>
      prev.map((hole, i) =>
        i === holeIndex
          ? {
            ...hole,
            [player]: (hole[player] ?? 0) + delta,
          }
          : hole
      )
    );
  };

  const resetGame = () => {
    setScores([]);
  };

  return {
    scores,
    startNewGame,
    updateGame,
    changeScore,
    resetGame,
  };
}
