import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { initGame } from "../api/initGame";
import { supabase } from "../supabaseClient";
import Modal from "../components/Modal";
import LobbyView from "../components/LobbyView";
import ResultView from "../components/ResultView";
import QuestionView from "../components/QuestionsView";
import TimerBar from "../components/TimerBar";
import { setGame } from "../CRUD/users";

import { fetchGameDetails } from "../CRUD/games";
import { setGameStartTime } from "../CRUD/games";
import { fetchQuestions as fetchQuestionsFromDb } from "../CRUD/questions";
import { getGameStartTime } from "../CRUD/games";
import { getActivePlayers } from "../CRUD/games";

/**
 *
 * TODO:
 * - Highlighta svaren som är valda av spelaren.
 * - Se till att om spelaren inte väljer ett svar så defaultas ett felaktigt svar.
 * - spara DB osv..
 *
 */

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const prevGameStateRef = useRef();
  const { userId, displayName } = useUser();

  const [hostId, setHostId] = useState("");
  const [gameState, setGameState] = useState("waiting");
  const [questionSetId, setQuestionSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5000);
  const [streak, setStreak] = useState(0);
  const [players, setPlayers] = useState([]);

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

  /*
  Fetching players every second waiting for game to start
  */
  useEffect(() => {
    if (gameState !== "pending") return;

    const interval = setInterval(async () => {
      const activePlayers = await getActivePlayers(gameId);
      setPlayers(activePlayers || []);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, gameId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      let players = await getActivePlayers(gameId);
      setPlayers(players);
      console.log("Players in game:", players);
    };

    console.log("Streak useeffect:", streak);
    if (streak >= 3) {
      fetchPlayers();
      handleOpen();
      // Do something here: trigger bonus, sound, UI effect, etc.
    }
  }, [streak]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
          const isHost = userId === payload.new.host;

          if (newState === "active" && prevGameStateRef.current !== "active") {
            const formatted = await fetchQuestionsFromDb(
              payload.new.question_set
            );
            setQuestions(formatted);
            setCurrentQuestionIndex(0);

            if (isHost) {
              console.log("Host, starta spelet!");
              handleFirstQuestion();
            } else {
              console.log("Inte host, vänta på start!");
            }
          }

          setGameState(newState);
          prevGameStateRef.current = newState;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, userId]);

  function timeStringToSeconds(str) {
    const [hh, mm, ss] = str.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  }

  const QUESTION_DURATION = 5;
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) return;

    let interval;

    const setupTimer = async () => {
      // Host sets start time and saves to DB
      const isHost = userId === hostId;

      let start;

      if (isHost) {
        const newStartDate = new Date();
        const formatted = newStartDate.toTimeString().split(" ")[0];
        setStartTime(formatted);
        await setGameStartTime(gameId, formatted);
        start = formatted;
      } else {
        // Non-host fetches start time from DB
        let response = await getGameStartTime(gameId);
        while (!response || response.length === 0 || !response[0].start_time) {
          response = await getGameStartTime(gameId);
        }
        start = response[0].start_time;
        setStartTime(start);
      }

      // Begin countdown
      interval = setInterval(() => {
        const currTime = new Date().toTimeString().split(" ")[0];
        const elapsed =
          timeStringToSeconds(currTime) - timeStringToSeconds(start);
        const remaining = QUESTION_DURATION - elapsed;

        setTimeLeft(Math.max(remaining, 0));

        if (remaining <= 0) {
          clearInterval(interval);
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 100);
    };

    setupTimer();

    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions.length, userId, hostId, gameId]);

  const handleFirstQuestion = async () => {
    const currTime = new Date();
    const formattedTime = currTime.toTimeString().split(" ")[0];

    console.log("formattedTime", formattedTime);
    setStartTime(formattedTime);
    await setGameStartTime(gameId, formattedTime);
  };

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
    console.log("Selected answer:", selected);
    console.log("correct answer:", questions[currentQuestionIndex].correct);

    const correct = questions[currentQuestionIndex].correct;
    // TODO: bring back the correct streak logic (the comment below)
    // let newStreak = selected === correct ? streak + 1 : 0;
    let newStreak = streak + 1;
    setStreak(newStreak);

    console.log("Selected answer:", selected);
    console.log("Correct answer:", correct);
    console.log("New streak:", newStreak);

    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selected,
        correct: questions[currentQuestionIndex].correct,
      },
    ]);
  };

  if (loading) return <div>Laddar spel...</div>;

  if (gameState !== "active") {
    setGame(gameId, userId);
    return (
      <LobbyView
        isHost={userId === hostId}
        onStart={handleStartGame}
        displayName={displayName}
        players={players}
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

  if (open) {
    const nicknames = Array.isArray(players)
      ? players.map((p) => p.nickname)
      : "";

    return (
      <Modal
        open={open}
        onClose={handleClose}
        title="🔥 3 in a row!"
        player_nicknames={nicknames}
        onConfirm={handleClose}
      />
    );
  }

  return (
    <div>
      <QuestionView
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        onAnswer={handleAnswer}
      />
      <TimerBar timeLeft={timeLeft} />
    </div>
  );
};

export default GameLobby;
