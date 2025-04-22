import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import GameSetupForm from "../components/GameSetup";

/**
 * 
 * Setting up a new game by making API-req to opentdb.com
 * Parameters set by user from the gamesetup form in components 
 * TODO: 
 *  - Check correctness
 *  - Stuff
 *  
 */

export default function Game() {
  const { displayName, session } = useUser();

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartGame = async (config) => {
    setLoading(true);
    setError("");
    setQuestions(null);

    const url = new URL("https://opentdb.com/api.php");
    url.searchParams.append("amount", config.amount);
    if (config.category) url.searchParams.append("category", config.category);
    if (config.difficulty) url.searchParams.append("difficulty", config.difficulty);
    if (config.type) url.searchParams.append("type", config.type);
    if (config.encoding) url.searchParams.append("encode", config.encoding);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.response_code !== 0) {
        throw new Error("No questions found. Try different settings.");
      }

      setQuestions(data.results);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching questions.");
    } finally {
      setLoading(false);
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

      {!questions && !loading && (
        <GameSetupForm onStart={handleStartGame} />
      )}

      {questions && (
        <div>
          <h2>Game Started!</h2>
          {questions.map((q, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <strong dangerouslySetInnerHTML={{ __html: q.question }} />
              <br />
              <em>Correct answer: {q.correct_answer}</em>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
