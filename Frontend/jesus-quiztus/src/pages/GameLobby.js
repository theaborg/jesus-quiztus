import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { initGame } from "../api/initGame";
import { supabase } from "../supabaseClient";

import LobbyView from "../components/LobbyView";
import ResultView from "../components/ResultView";
import QuestionView from "../components/QuestionsView";

import { fetchGameDetails } from "../CRUD/games";
import { fetchQuestions as fetchQuestionsFromDb } from "../CRUD/questions";

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { userId, displayName } = useUser();

  const [hostId, setHostId] = useState(null);
  const [gameState, setGameState] = useState("waiting");
  const [questionSetId, setQuestionSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
 * Hanterar den enkilde spelarens lobbyvy.
 * 
 * Flöde och funktion:
 * 1. Hämtar `gameId` från URL-parametrar och säkerställer att den är giltig.
 * 2. Laddar speldetaljer från databasen (host, status och frågeset).
 * 3. Om spelet är aktivt ("active"), laddas frågorna från databasen.
 * 4. Lyssnar i realtid på förändringar i spelets status (via Supabase channel).
 * 5. Renderar olika vyer beroende på status:
 *    - "waiting": visar LobbyView med startknapp för host.
 *    - "active": visar frågorna en i taget med QuestionView.
 *    - "over" eller när alla frågor är besvarade: visar ResultView.
 * 6. Användaren svarar på frågor en efter en, och deras svar loggas lokalt.
 * 7. När spelet är slut visas resultat tills spelaren väljer att gå tillbaka till start.
 */

  useEffect(() => {
    if (!gameId || gameId === "undefined") {
      console.warn("Ingen gameId angiven i URL.");
      navigate("/");
    }
  }, [gameId, navigate]);

  useEffect(() => {
    if (!gameId) return;

    const loadGameDetails = async () => {
      try {
        const data = await fetchGameDetails(gameId);

        setHostId(data.host);
        setGameState(data.state);
        setQuestionSetId(data.question_set);

        if (data.state === "active") {
          const formatted = await fetchQuestionsFromDb(data.question_set);
          setQuestions(formatted);
        }

        setLoading(false);
      } catch (error) {
        console.error("Kunde inte hämta game-data:", error);
      }
    };

    loadGameDetails();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel("game_state_channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        async (payload) => {
          const newState = payload.new.state;
          setGameState(newState);

          if (newState === "active") {
            const formatted = await fetchQuestionsFromDb(
              payload.new.question_set
            );
            setQuestions(formatted);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const handleStartGame = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("Ingen session hittades.");
      return;
    }

    await initGame(gameId, questionSetId, session.access_token);
  };

  const handleAnswer = (selected) => {
    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selected,
        correct: questions[currentQuestionIndex].correct,
      },
    ]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (loading) return <div>Laddar spel...</div>;

  if (gameState !== "active") {
    return (
      <LobbyView
        isHost={userId === hostId}
        onStart={handleStartGame}
        displayName={displayName}
      />
    );
  }

  if (gameState === "over" || currentQuestionIndex >= questions.length) {
    return (
      <ResultView
        answers={answers}
        questions={questions}
        navigateHome={() => navigate("/")}
      />
    );
  }

  return (
    <QuestionView
      question={questions[currentQuestionIndex]}
      questionNumber={currentQuestionIndex + 1}
      onAnswer={handleAnswer}
    />
  );
};

export default GameLobby;
