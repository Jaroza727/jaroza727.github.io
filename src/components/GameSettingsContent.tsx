import { useEffect, useState } from "react";

const MAX_PLAYERS = 10;

export type GameSetupData = {
  holes: number;
  players: string[];
};

type GameSettingsContentProps = {
  initialData?: GameSetupData;
  hasActiveGame: boolean;
  onStartNewGame: (data: GameSetupData) => void;
  onUpdateGame: (data: GameSetupData) => void;
};

export default function GameSettingsContent(props : GameSettingsContentProps) {
 const { initialData, hasActiveGame, onStartNewGame, onUpdateGame } = props;

  const [holes, setHoles] = useState(18);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<string[]>([]);

  const buildPayload = (): GameSetupData => ({
    holes,
    players,
  });

  useEffect(() => {
    if (initialData) {
      setHoles(initialData.holes);
      setPlayers(initialData.players);
    }
  }, [initialData]);

  const addPlayer = () => {
    if (!playerName.trim() || players.length >= MAX_PLAYERS) return;
    setPlayers((p) => [...p, playerName.trim()]);
    setPlayerName("");
  };

  const removePlayer = (index: number) => {
    setPlayers((p) => p.filter((_, i) => i !== index));
  };

  return (
    <>
      <label className="modal-label">
        Number of holes
        <input
          type="number"
          min={1}
          max={36}
          value={holes}
          onChange={(e) => setHoles(Number(e.target.value))}
          className="modal-input"
        />
      </label>

      <label className="modal-label">
        <div className="player-label-row">
          <span>Add player</span>
          <span className="player-count">
            {players.length} / {MAX_PLAYERS}
          </span>
        </div>

        <div className="player-input-row">
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="modal-input"
            placeholder="Player name"
            disabled={players.length >= MAX_PLAYERS}
          />
          <button
            onClick={addPlayer}
            className="add-player-button"
            disabled={players.length >= MAX_PLAYERS}
          >
            Add
          </button>
        </div>
      </label>

      {players.length > 0 && (
        <ul className="player-list">
          {players.map((p, i) => (
            <li key={i} className="player-item">
              <span>{p}</span>
              <button
                onClick={() => removePlayer(i)}
                className="remove-player-button"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="modal-actions">
        {hasActiveGame && (
          <button
            className="secondary-button"
            onClick={() => onUpdateGame(buildPayload())}
          >
            Update Current Game
          </button>
        )}

        <button
          className="primary-button"
          disabled={players.length === 0}
          onClick={() => onStartNewGame(buildPayload())}
        >
          Start New Game
        </button>
      </div>
    </>
  );
}
