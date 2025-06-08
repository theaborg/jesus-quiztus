import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../supabaseClient";
import Modal from "../components/Modal";
import LobbyView from "../components/LobbyView";
import ResultView from "../components/ResultView";
import QuestionView from "../components/QuestionsView";
import { setGameForUser, getUser } from "../api/userApi";

import { fetchGameDetails } from "../api/game/getGameDetails";
import { getActivePlayers } from "../api/game/getActivePlayers";
import { setGameStartTime } from "../api/game/setGameStartTime";
import { getGameStartTime } from "../api/game/getGameStartTime";
import { initGame } from "../api/initGame";
import { setState } from "../api/game/setGameState";

import { getQuestions as fetchQuestionsFromDb } from "../api/questions/getQuestions";

//import { fetchGameDetails } from "../CRUD/games";
//import { setState } from "../CRUD/games";
//import { setGameStartTime } from "../CRUD/games";
//import { fetchQuestions as fetchQuestionsFromDb } from "../CRUD/questions";
//import { getGameStartTime } from "../CRUD/games";
//import { getActivePlayers } from "../CRUD/games";

import { getRandomPowerup } from "../components/Powerup";
import powerups from "../components/Powerup";

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const prevGameStateRef = useRef();
  const { userId, displayName, session } = useUser();

  const [hostId, setHostId] = useState("");
  const [gameState, setGameState] = useState("waiting");
  const [questionSetId, setQuestionSetId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivedPowerUps, setreceivedPowerUps] = useState([]);
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5000);
  const [streak, setStreak] = useState(0);
  const [players, setPlayers] = useState([]);
  const [activePowerup, setActivePowerup] = useState();
  const [selectedAlternative, setSelectedAlternative] = useState(null);

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
        // TODO: Figure out why we can't use session directly here
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Raw gameId:", gameId);

        const resp = await fetchGameDetails(
          gameId.id ?? gameId,
          session.access_token
        );
        const data = JSON.parse(resp.data);
        console.log("Game data:", data);
        setHostId(data.host);
        setGameState(data.state);
        setQuestionSetId(data.question_set);

        if (data.state === "active") {
          const formattedData = await fetchQuestionsFromDb(
            data.question_set,
            session.access_token
          );
          const formatted = JSON.parse(formattedData.data);
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
      const resp = await getActivePlayers(gameId, session.access_token);
      const activePlayers = JSON.parse(resp.data);
      // For each player, fetch their profile image
      const playersWithAvatars = await Promise.all(
        (activePlayers.data || []).map(async (p) => {
          return getUser(p.id, session.access_token);
        })
      );

      setPlayers(playersWithAvatars);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, gameId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      let resp = await getActivePlayers(gameId, session.access_token);
      let players = JSON.parse(resp.data);
      setPlayers(players);
    };

    if (streak >= 3) {
      fetchPlayers();
      var activePowerup = getRandomPowerup();
      setActivePowerup(activePowerup);
      handleOpen();
      // Do something here: trigger bonus, sound, UI effect, etc.
    }
  }, [streak]);

  const handleClose = () => {
    setStreak(0);
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
            const formattedData = await fetchQuestionsFromDb(
              payload.new.question_set,
              session.access_token
            );
            const formatted = JSON.parse(formattedData.data);
            setQuestions(formatted);
            setCurrentQuestionIndex(0);

            if (isHost) {
              handleFirstQuestion();
            } else {
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

  // listener for powerups
  useEffect(() => {
    if (!userId || !gameId) return;

    const channel = supabase
      .channel("powerups_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Powerups",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          let newPowerUp = powerups.find(
            (pow) => pow.type === payload.new.type
          );
          setreceivedPowerUps((prevStateArray) => [
            ...prevStateArray,
            newPowerUp,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, gameId]);

  function timeStringToSeconds(str) {
    const [hh, mm, ss] = str.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  }

  const QUESTION_DURATION = 10;
  useEffect(() => {
    if (currentQuestionIndex >= questions.length) return;

    let interval;

    const setupTimer = async () => {
      // Host sets start time and saves to DB
      const isHost = userId === hostId;

      let start;
      const now = new Date().toTimeString().split(" ")[0];

      if (isHost) {
        start = now;
        setStartTime(start);
        await setGameStartTime(gameId, start, session.access_token);
        start = now;
        setStartTime(start);
        await setGameStartTime(gameId, start, session.access_token);
      } else {
        start = now;
        start = now;
        setStartTime(start);
      }

      interval = setInterval(async () => {
        const currTime = new Date().toTimeString().split(" ")[0];
        const elapsed =
          timeStringToSeconds(currTime) - timeStringToSeconds(start);
        const remaining = QUESTION_DURATION - elapsed;

        setTimeLeft(Math.max(remaining, 0));

        if (remaining <= 0) {
          clearInterval(interval);

          const nextIndex = currentQuestionIndex + 1;

          if (nextIndex >= questions.length) {
            setGameState("over");

            if (userId === hostId) {
              await setState(gameId, "over", session.access_token);
            }
          } else {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAlternative(null);
          }
        }
      }, 100);
    };

    setupTimer();
    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions.length, userId, hostId, gameId]);

  const handleFirstQuestion = async () => {
    const currTime = new Date();
    const formattedTime = currTime.toTimeString().split(" ")[0];

    setStartTime(formattedTime);
    await setGameStartTime(gameId, formattedTime, session.access_token);
  };

  const handleStartGame = async () => {
    if (!session) {
      console.error("Ingen session hittades.");
      return;
    }

    await initGame(gameId, questionSetId, session.access_token);
  };

  const handleAnswer = (selected) => {
    // kanske lite brute men det funkar atm :)
    if (selectedAlternative !== null) {
      return;
    }

    setSelectedAlternative(selected);

    const correct = questions[currentQuestionIndex].correct;
    let newStreak = selected === correct ? streak + 1 : 0;
    setStreak(newStreak);

    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selected,
        correct,
      },
    ]);
  };

  if (loading) return <div>Laddar spel...</div>;

  if (gameState === "over") {
    return (
      <ResultView
        answers={answers}
        questions={questions}
        navigateHome={() => navigate("/")}
      />
    );
  } else if (gameState !== "active") {
    if (userId != null) {
      setGameForUser(gameId, userId, session.access_token);
    }
    //setGameForUser(gameId, userId);
    return (
      <LobbyView
        isHost={userId === hostId}
        onStart={handleStartGame}
        displayName={displayName}
        players={players}
      />
    );
  }

  if (open) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        title={`🔥 3 in a row! Powerup: ${activePowerup.type}`}
        players={players}
        onConfirm={handleClose}
        activePowerUp={activePowerup}
      />
    );
  }

  return (
    <div>
      <QuestionView
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        onAnswer={handleAnswer}
        selectedAlternative={selectedAlternative}
        receivedPowerUps={receivedPowerUps}
        timeLeft={timeLeft}
      />
      {/* <TimerBar timeLeft={timeLeft} /> */}
    </div>
  );
};

export default GameLobby;
