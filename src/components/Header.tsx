import "../styles/Header.css";
import KebabMenu from "./KebabMenu";

type HeaderProps = {
  onHowToPlay: () => void;
  onGameSettings: () => void;
};

export default function Header(props: HeaderProps) {
  const { onHowToPlay, onGameSettings } = props;
  
  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__icon">🥏</span>
        <div>
          <h1 className="app-header__title">Disc Golf Dots</h1>
          <span className="app-header__subtitle">Score • Steal • Win</span>
        </div>
      </div>

      <KebabMenu
        items={[
          { label: "How to Play", onClick: onHowToPlay },
          { label: "Game Settings", onClick: onGameSettings },
        ]}
      />
    </header>
  );
}
