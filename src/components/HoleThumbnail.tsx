import { HoleScores } from "../types/game";

type HoleThumbnailProps = {
  index: number;
  hole: HoleScores;
  isActive: boolean;
  isComplete: boolean;
  onClick: (index: number) => void;
};

export default function HoleThumbnail({
  index,
  hole,
  isActive,
  isComplete,
  onClick,
}: HoleThumbnailProps) {
  const className = [
    "hole-thumb",
    isActive && "active",
    isComplete && "complete",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={className}
      onClick={() => onClick(index)}
    >
      {index + 1}
    </button>
  );
}
