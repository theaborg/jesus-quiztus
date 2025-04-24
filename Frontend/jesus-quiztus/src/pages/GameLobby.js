import { useParams } from "react-router-dom";

const GameLobby = () => {
  const { gameId } = useParams();
  return <h1>Welcome to Game Lobby! Game ID: {gameId}</h1>;
};

export default GameLobby;
