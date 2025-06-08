import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/Modal.scss";
import { sendPowerup } from "../api/powerupApi";

/**
 * TODO:
 * - Fortsätta snygga till och anpassa för eventuellt andra invites som friends reqs osv.
 *
 */

const Modal = ({
  open,
  onClose,
  title,
  players = [],
  onConfirm,
  activePowerUp,
}) => {
  const { gameId } = useParams();
  const { userId, session } = useUser();

  if (!open) return null;
  console.log("players", players);
  const player_nicknames = Array.isArray(players?.data)
    ? players.data.reduce((users, player) => {
        users[player.id] = player.nickname;
        return users;
      }, {})
    : {};

  console.log("player_nicknames", player_nicknames);

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const sendPowerUpToUser = async (receiver_id) => {
    await sendPowerup(
      gameId,
      userId,
      receiver_id,
      activePowerUp.type,
      session.access_token
    );
    onClose();
  };

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
