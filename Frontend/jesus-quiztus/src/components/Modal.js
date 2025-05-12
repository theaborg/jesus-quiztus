import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/Modal.scss";
import { sendPowerup } from "../CRUD/powerups";

/**
 * TODO:
 * - Lyfta ut CSS till egen fil där all annan css ligger
 * - Fortsätta snygga till och anpassa för eventuellt andra invites som friends reqs osv.
 *
 */

const Modal = ({ open, onClose, title, players = [], onConfirm }) => {
  const { gameId } = useParams();
  const { userId } = useUser();

  if (!open) return null;

  const player_nicknames = Array.isArray(players)
    ? players.reduce((users, player) => {
        users[player.id] = player.nickname;
        return users;
      }, {})
    : {};

  //console.log("print från modalen, nicknames: ", player_nicknames);

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const sendPowerUpToUser = async (receiver_id) => {
    //console.log("id ", receiver_id);
    await sendPowerup(gameId, userId, receiver_id, "temp_powerup");
    onClose();
  };

  //console.log("Modal open:", open);

  return (
    <div onClick={handleBackdropClick} className="modal-backdrop">
      <div
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
        className="modal-content"
      >
        {title && <h2 style={{ marginBottom: "1rem" }}>{title}</h2>}

        {Object.keys(player_nicknames).length > 0
          ? Object.entries(player_nicknames).map(([id, nickname]) => (
              <button
                key={id}
                onClick={() => sendPowerUpToUser(id)}
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
