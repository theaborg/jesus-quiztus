import { QRCode } from "react-qrcode-logo";
import { useLocation } from "react-router-dom";
import "../styles/LobbyView.scss";

const LobbyView = ({ isHost, onStart, displayName, players }) => {
  const location = useLocation();
  const gameUrl = `${window.location.origin}${location.pathname}`; //location.pathname;

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1>
          GAME LOBBY! <br />
          WELCOME {displayName.toUpperCase()}
        </h1>

        <div className="qr-wrapper">
          <QRCode value={gameUrl} size={160} />
        </div>

        <div className="players-header">PLAYERS</div>
        <div className="players-list">
          {players && players.length > 0 ? (
            players.map((p, i) => (
              <div key={i} className="player-item">
                <img
                  className="avatar"
                  src={
                    p.data.profilePictureUrl || "/images/profile_picture.jpg"
                  }
                  alt={p.data.nickname}
                  referrerPolicy="no-referrer"
                />
                <div className="nickname">{p.data.nickname}</div>
              </div>
            ))
          ) : (
            <div>Inga spelare ännu...</div>
          )}
        </div>

        {isHost && (
          <button className="start-button" onClick={onStart}>
            Starta spelet
          </button>
        )}
      </div>
    </div>
  );
};

export default LobbyView;
