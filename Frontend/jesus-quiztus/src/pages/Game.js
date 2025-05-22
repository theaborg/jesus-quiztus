import { useUser } from "../context/UserContext";
import { createGame } from "../api/createGame";
import GameSetupForm from "../components/GameSetupForm";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import { createCustomGame } from "../CRUD/games";
import { UpdatePassword } from "@supabase/auth-ui-react";

/**
 *
 */

export default function Game() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, userId } = useUser();

  const fromCustom = location.state?.setId || null;

  useEffect(() => {
    const startCustomGame = async () => {
      const result = await createCustomGame(fromCustom, userId);
      navigate(`/lobby/${result}`);
    };

    if (fromCustom != null) {
      startCustomGame();
    }
  });

  // Handling the form for setting up a new game
  const handleStart = async (formData) => {
    const {
      data: { session: authSession },
      error,
    } = await supabase.auth.getSession();

    if (error || !authSession) {
      alert("User session missing or expired.");
      return;
    }

    try {
      // awaiting results from the API-req startGame.
      // Then navigating the user to the game lobby for that game.
      // TODO:
      // Should maybe check that this is a valid gameID?

      const result = await createGame(formData, authSession.access_token);
      navigate(`/lobby/${result.gameId}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!session) {
    return <h1>Please log in to play the game.</h1>;
  }

  return (
    <div>
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
