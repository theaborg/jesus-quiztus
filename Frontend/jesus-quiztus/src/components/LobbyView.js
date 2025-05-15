import { QRCode } from "react-qrcode-logo";
import { useLocation } from "react-router-dom";
import "../styles/LobbyView.scss";

const LobbyView = ({ isHost, onStart, displayName, players }) => {
  const location = useLocation();
  const gameUrl = `${window.location.origin}${location.pathname}`; //location.pathname;
  /*
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <h2 className="text-2xl font-bold mb-2">
        Välkommen till spelet {displayName}!
      </h2>
      {!isHost && (
        <p className="mb-6">Väntar på att host ska starta spelet...</p>
      )}
      {isHost && (
        <button
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={onStart}
        >
          Starta spelet
        </button>
      )}
      <QRCode className="share-game-qr" value={gameUrl} size={256} />

      <h3 className="text-xl font-semibold mt-4 mb-2">Spelare i lobbyn:</h3>
      <ul className="text-left">
        {players && players.length > 0 ? (
          players.map((p, i) => (
            <li key={i} className="mb-1">👤 {p.nickname}</li>
          ))
        ) : (
          <li>Inga spelare ännu...</li>
        )}
      </ul>
      
    </div>
  );
  */

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
                  src={p.avatarUrl || "/profile_picture.jpg"}
                  alt={p.nickname}
                  referrerPolicy="no-referrer"
                />
                <div className="nickname">{p.nickname}</div>
              </div>
            ))
          ) : (
            <div>Inga spelare ännu...</div>
          )}
        </div>

        {isHost && (
          <button className="start-button" onClick={onStart}>
            🚀 Starta spelet
          </button>
        )}
      </div>
    </div>
  );
};

export default LobbyView;
