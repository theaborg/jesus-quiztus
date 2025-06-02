import { useUser } from "../context/UserContext";
import { createGame } from "../api/createGame";
import GameSetupForm from "../components/GameSetupForm";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";

import { createCustomGame } from "../api/game/createCustomGame";
//import { createCustomGame } from "../CRUD/games";
import { UpdatePassword } from "@supabase/auth-ui-react";

/**
 * Game.js
 */

export default function Game() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, userId } = useUser();

  const fromCustom = location.state?.setId || null;

  useEffect(() => {
    const startCustomGame = async () => {
      const name = "unnamed";
      const resultData = await createCustomGame(
        fromCustom,
        userId,
        name,
        session.access_token
      );
      const result = JSON.parse(resultData.data);
      //console.log("Custom game created:", result.id);
      navigate(`/lobby/${result.id}`);
    };

    if (fromCustom != null) {
      startCustomGame();
    }
  });

  // Handling the form for setting up a new game
  const handleStart = async (formData) => {
    if (!session) {
      alert("User session missing or expired.");
      return;
    }

    try {
      // awaiting results from the API-req startGame.
      // Then navigating the user to the game lobby for that game.
      // TODO:
      // Should maybe check that this is a valid gameID?

      const result = await createGame(formData, session.access_token);
      navigate(`/lobby/${result.gameId}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!session) {
    return <h1>Please log in to play the game.</h1>;
  }

  return (
    <div className="game-page">
      <h1 className="second-header-text">New Game</h1>
      <button className="in-app-button" onClick={() => setShowModal(true)}>
        Setup New Game
      </button>
      {showModal && (
        <GameSetupForm
          onStart={(data) => {
            handleStart(data);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
