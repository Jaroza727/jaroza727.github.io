import { HoleScores } from "../types/game";

export const DOTS_PER_HOLE = 3;

export const getTotalDots = (holeScores: HoleScores) =>
  Object.values(holeScores).reduce(
    (sum, dots) => sum + dots,
    0
  );

export const isHoleComplete = (
  holeScores: HoleScores
) => getTotalDots(holeScores) >= DOTS_PER_HOLE;
