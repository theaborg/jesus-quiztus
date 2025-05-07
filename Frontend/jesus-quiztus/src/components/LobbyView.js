import { QRCode } from "react-qrcode-logo";
import { useLocation } from "react-router-dom";

const LobbyView = ({ isHost, onStart, displayName }) => {
  const location = useLocation();
  const gameUrl = `${window.location.origin}${location.pathname}` //location.pathname;
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
    </div>
  );
};

export default LobbyView;
