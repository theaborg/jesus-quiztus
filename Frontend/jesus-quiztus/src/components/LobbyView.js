import { QRCode } from "react-qrcode-logo";
import { useLocation } from "react-router-dom";
import { getActivePlayers } from "../CRUD/games";

const LobbyView = ({ isHost, onStart, displayName, players }) => {
  const location = useLocation();
  const gameUrl = `${window.location.origin}${location.pathname}`; //location.pathname;
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
};

export default LobbyView;
