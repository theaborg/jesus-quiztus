import React from "react";
import "../styles/Modal.scss";

/**
 * TODO:
 * - Lyfta ut CSS till egen fil där all annan css ligger
 * - Fortsätta snygga till och anpassa för eventuellt andra invites som friends reqs osv.
 *
 */

const Modal = ({ open, onClose, title, player_nicknames = [], onConfirm }) => {
  if (!open) return null;

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  console.log("Modal open:", open);

  return (
    <div onClick={handleBackdropClick} className="modal-backdrop">
      <div
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
        className="modal-content"
      >
        {title && <h2 style={{ marginBottom: "1rem" }}>{title}</h2>}

        {player_nicknames.length > 0
          ? player_nicknames.map((nickname, index) => (
              <button
                key={index}
                onClick={() => onConfirm?.(nickname)}
                className="modal-button"
              >
                {nickname}
              </button>
            ))
          : onConfirm && (
              <button onClick={onConfirm} className="modal-button">
                OK
              </button>
            )}
      </div>
    </div>
  );
};

export default Modal;
