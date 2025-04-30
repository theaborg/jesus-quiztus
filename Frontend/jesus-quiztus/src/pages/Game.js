import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { createGame } from "../api/createGame";
import GameSetupForm from "../components/GameSetup";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; 

/**
 *
 */

export default function Game() {
  const navigate = useNavigate();
  const { displayName, session } = useUser();


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

    //console.log("Frontend session from context:", session);
    //console.log("Frontend session from auth:", authSession);
    //console.log("Token:", authSession?.access_token);


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
      <h1>New Game</h1>
      <p>Please setup your choices or stuffs, {displayName}!</p>
      <GameSetupForm onStart={handleStart} />
    </div>
  );
}
