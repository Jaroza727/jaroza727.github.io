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
    const prevHole = prevScores[holeIndex] ?? {};
    return Object.fromEntries(
      players.map((p) => [p, prevHole[p] ?? 0])
    );
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
              [player]: Math.max(
                0,
                hole[player] + delta
              ),
            }
          : hole
      )
    );
  };

  return {
    scores,
    startNewGame,
    updateGame,
    changeScore,
  };
}
