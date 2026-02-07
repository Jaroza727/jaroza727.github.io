import { useState } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import GameSettingsContent, { GameSetupData } from './components/GameSettingsContent';
import ScoreSlider from './components/ScoreSlider';
import { useScores } from './hooks/useScores';
import './App.css';
import "keen-slider/keen-slider.min.css";

export default function App() {
  const [gameSetup, setGameSetup] = useState<GameSetupData | null>(null);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState(false);
  const [currentHole, setCurrentHole] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  const { scores, startNewGame, updateGame, changeScore, resetGame } = useScores();

  const handleStartNewGame = (data: GameSetupData) => {
    setGameSetup(data);
    startNewGame(data.holes, data.players);
    setIsGameActive(true);
    setIsGameSettingsOpen(false);
  };

  const handleUpdateGame = (data: GameSetupData) => {
    setGameSetup(data);
    updateGame(data.holes, data.players);
    setIsGameActive(true);
    setIsGameSettingsOpen(false);
  };

  const handleFinishRound = () => {
    resetGame();
    setCurrentHole(0);
    setIsGameActive(false);
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

      {!isGameActive && (
        <main className="start-screen">
          <div className="start-card">
            <p className="start-kicker">Welcome to Disc Golf Dots</p>
            <h2 className="start-title">Ready to chase some dots?</h2>
            <p className="start-text">
              Dots available while supplies last...
            </p>
            <button
              className="primary-button start-button"
              onClick={() => setIsGameSettingsOpen(true)}
            >
              Start a Game
            </button>
          </div>
        </main>
      )}

      {gameSetup && isGameActive && scores.length > 0 && (
        <main>
          <ScoreSlider
            key={gameSetup.players.join("|")}
            players={gameSetup.players}
            scores={scores}
            currentHole={currentHole}
            onHoleChange={setCurrentHole}
            onScoreChange={changeScore}
            onFinishRound={handleFinishRound}
          />
        </main>
      )}
    </>
  );
}
