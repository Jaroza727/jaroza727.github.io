import { useState } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import GameSettingsContent, {GameSetupData} from './components/GameSettingsContent';
import ScoreSlider from './components/ScoreSlider';
import { GameScores } from "./types/game";
import './App.css';
import "keen-slider/keen-slider.min.css";

export default function App() {
  const [gameSetup, setGameSetup] = useState<GameSetupData | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState(false);
  const [scores, setScores] = useState<GameScores>([]);

  const handleStartNewGame = (data: GameSetupData) => {
    setGameSetup(data);
    setScores(createEmptyScores(data.holes, data.players));
    setIsGameSettingsOpen(false);
  };

  const handleUpdateGame = (data: GameSetupData) => {
  setGameSetup(data);

  setScores((prevScores) => {
    return Array.from({ length: data.holes }, (_, holeIndex) => {
      const prevHole = prevScores[holeIndex] ?? {};
      return Object.fromEntries(
        data.players.map((p) => [p, prevHole[p] ?? 0])
      );
    });
  });

  setIsGameSettingsOpen(false);
};

  const createEmptyScores = (holes: number, players: string[]) =>
  Array.from({ length: holes }, () =>
    Object.fromEntries(players.map((p) => [p, 0]))
  )

  const handleScoreChange = (
    holeIndex: number,
    player: string,
    delta: number
  ) => {
    setScores((prev) =>
      prev.map((hole, i) =>
        i === holeIndex
          ? { ...hole, [player]: Math.max(0, hole[player] + delta) }
          : hole
      )
    );
  };

  return (
    <>
      <Header
        onHowToPlay={() => setIsHowToPlayOpen(true)}
        onGameSettings={() => setIsGameSettingsOpen(true)}
      />

      <Modal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        title="How to Play"
      >
        <p>Dots is an alternative way to play disc golf where each hole has three available dots.</p>
        <p><strong>Drive dot:</strong> Awarded to the player whose drive lands closest to the pin.</p>
        <p><strong>On dot:</strong> Awarded to the first player to land in the bullseye or within one wingspan of the basket.</p>
        <p><strong>In dot:</strong> Awarded to the first player to make their putt.</p>
        <p>The player farthest from the basket throws next. Throwing out of turn costs one dot.</p>
        <p>Dots may be stolen if, after the current player releases their disc, another player's disc comes to rest first.</p>
        <p>On hole 18, each dot is worth one-third of the point difference between first and last place.</p>
        <p>An optional <strong>V dot</strong> may be awarded if a drive passes through a split tree trunk.</p>
      </Modal>

      <Modal
        isOpen={isGameSettingsOpen}
        onClose={() => setIsGameSettingsOpen(false)}
        title="Game Settings"
      >
        <GameSettingsContent
          initialData={gameSetup ?? undefined}
          hasActiveGame={!!gameSetup}
          onStartNewGame={handleStartNewGame}
          onUpdateGame={handleUpdateGame}
        />
      </Modal>

      {gameSetup && scores.length > 0 && (
        <main>
          <ScoreSlider
            players={gameSetup.players}
            scores={scores}
            onScoreChange={handleScoreChange}
          />
        </main>
      )}
    </>
  );
}
