import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useUser } from "../context/UserContext";

const GameLobby = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { userId } = useUser();

  const [hostId, setHostId] = useState(null);
  const [gameState, setGameState] = useState("waiting");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 1. Navigera bort om gameId är ogiltigt
  useEffect(() => {
    if (!gameId || gameId === "undefined") {
      console.warn("Ingen gameId angiven i URL.");
      navigate("/");
    }
  }, [gameId, navigate]);

  // ✅ 2. Hämta game-info inkl. host och state
  useEffect(() => {
    if (!gameId || gameId === "undefined") return;

    const fetchGameDetails = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("host, state, question_set")
        .eq("id", gameId)
        .single();

      if (error) {
        console.error("Kunde inte hämta game-data:", error);
        return;
      }

      setHostId(data.host);
      setGameState(data.state);

      if (data.state === "active") {
        await fetchQuestions(data.question_set);
      }

      setLoading(false);
    };

    fetchGameDetails();
  }, [gameId]);

  // ✅ 3. Lyssna i realtid på ändringar i game.state
  useEffect(() => {
    if (!gameId || gameId === "undefined") return;

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
          console.log("Game state updated:", newState);
          setGameState(newState);

          if (newState === "active") {
            await fetchQuestions(payload.new.question_set);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const fetchQuestions = async (questionSetId) => {
    const { data, error } = await supabase
      .from("Questions")
      .select("*")
      .eq("set", questionSetId)
      .order("id", { ascending: true });

    if (error) {
      console.error("Kunde inte hämta frågor:", error);
      return;
    }

    const formatted = data.map((q) => ({
      text: q.question,
      alternatives: shuffle([q.answer, q.alt_1, q.alt_2, q.alt_3]),
      correct: q.answer,
    }));

    setQuestions(formatted);
  };

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  if (loading) return <div>Laddar spel...</div>;

  // 🔹 4. Lobby-vy innan start
  if (gameState !== "active") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Välkommen till spelet!</h2>
        <p className="mb-6">Väntar på att host ska starta...</p>

        {userId === hostId && (
          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={async () => {
              const { error } = await supabase
                .from("games")
                .update({ state: "active" })
                .eq("id", gameId);
              if (error) {
                console.error("Kunde inte starta spelet:", error);
              } else {
                console.log("Game state updated: active");
              }
            }}
          >
            Starta spelet
          </button>
        )}
      </div>
    );
  }

  // 🔹 5. Resultat-vy
  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Resultat 🎉</h2>
        <ul className="space-y-4">
          {answers.map((answer, index) => {
            const question = questions[answer.questionIndex];
            const isCorrect = answer.selected === answer.correct;
            return (
              <li key={index} className="border rounded-lg p-4">
                <p
                  className="font-semibold mb-1"
                  dangerouslySetInnerHTML={{
                    __html: `Q${index + 1}: ${question.text}`,
                  }}
                />
                <p>
                  ✅ Rätt svar:{" "}
                  <span
                    className="font-medium"
                    dangerouslySetInnerHTML={{ __html: answer.correct }}
                  />
                </p>
                <p>
                  🧍 Ditt svar:{" "}
                  <span
                    className={`font-medium ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                    dangerouslySetInnerHTML={{ __html: answer.selected }}
                  />{" "}
                  {isCorrect ? "✔️" : "❌"}
                </p>
              </li>
            );
          })}
        </ul>
        <button onClick={() => navigate("/")}>Till startsidan</button>
      </div>
    );
  }

  // 🔹 6. Spelvy med fråga
  const question = questions[currentQuestionIndex];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Fråga {currentQuestionIndex + 1}</h2>
      <p
        className="mb-6 text-lg"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.alternatives.map((alt, index) => (
          <button
            key={index}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            onClick={() => {
              setAnswers((prev) => [
                ...prev,
                {
                  questionIndex: currentQuestionIndex,
                  selected: alt,
                  correct: question.correct,
                },
              ]);
              setCurrentQuestionIndex((prev) => prev + 1);
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: alt }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameLobby;
