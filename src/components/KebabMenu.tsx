import { useEffect, useRef, useState } from "react";
import "../styles/KebabMenu.css"

type MenuItem = {
  label: string;
  onClick: () => void;
};

type KebabMenuProps = {
  items: MenuItem[];
};

export default function KebabMenu(props: KebabMenuProps ) {
  const { items } = props;

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="kebab-menu" ref={menuRef}>
      <button
        className="kebab-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="More options"
      >
        ⋮
      </button>

      {open && (
        <div className="kebab-dropdown">
          {items.map((item, index) => (
            <button
              key={index}
              className="kebab-item"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};