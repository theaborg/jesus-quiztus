import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { startGame } from "../api/startGame";
import GameSetupForm from "../components/GameSetup";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // adjust to your client import

/**
 *
 * Setting up a new game by making API-req to opentdb.com
 * Parameters set by user from the gamesetup form in components
 * TODO:
 *  1. Fetch questions from the API based on user input, each question should be a question in Supabase
 *  2. The questions created should be stored as a questionsset in Supabase
 *  3.
 *
 */

export default function Game() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { displayName, session } = useUser();

  const handleStart = async (formData) => {
    const {
      data: { session: authSession },
      error,
    } = await supabase.auth.getSession();

    if (error || !authSession) {
      alert("User session missing or expired.");
      return;
    }

    //console.log("Frontend session from context:", session);
    //console.log("Frontend session from auth:", authSession);
    //console.log("Token:", authSession?.access_token);


    try {
      const result = await startGame(formData, authSession.access_token);
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
      <h1>New Game</h1>
      <p>Please setup your choices or stuffs, {displayName}!</p>

      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && <GameSetupForm onStart={handleStart} />}
    </div>
  );
}
