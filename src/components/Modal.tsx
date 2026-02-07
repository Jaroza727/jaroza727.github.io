import React from "react";
import "../styles/GameSetupModal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, title, children } = props;
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">{title}</h2>

        <div className="modal-content">{children}</div>

        <div className="modal-actions">
          <button onClick={onClose} className="secondary-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
