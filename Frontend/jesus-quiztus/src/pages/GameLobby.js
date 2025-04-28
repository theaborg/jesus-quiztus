import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const GameLobby = () => {
  const { gameId } = useParams(); // Hämtar gameId från URL:en
  const [questions, setQuestions] = useState([]); // Frågor
  const [loading, setLoading] = useState(true); // Kanske onödig? Visar laddskärm
  const [isReady, setIsReady] = useState(false); // Kollar att user är redo att köra igång spelet
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Håller koll på vilken fråga vi är på
  const navigate = useNavigate(); // Så vi kan komma tillbaka till start

  const [answers, setAnswers] = useState([]); // Sparar användarens svar på varje fråga

  // När komponenten laddas, hämta frågorna som hör till spelet
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Steg 1: Hämta question_set ID från games-tabellen
        const { data: gameData, error: gameError } = await supabase
          .from("games")
          .select("question_set")
          .eq("id", gameId)
          .single(); // Förväntar oss bara en rad

        if (gameError) throw gameError;

        const questionSetId = gameData.question_set;

        // Steg 2: Hämta alla frågor till settet
        const { data: questionsData, error: questionsError } = await supabase
          .from("Questions")
          .select("*")
          .eq("set", questionSetId)
          .order("id", { ascending: true }); // Sorterar frågorna, kanske onödigt?

        if (questionsError) throw questionsError;

        // Steg 3: Formatera frågorna så att de passar vår UI
        const formattedQuestions = questionsData.map((q) => ({
          text: q.question,
          alternatives: shuffle([q.answer, q.alt_1, q.alt_2, q.alt_3]), // Blanda alternativen, annars är alltid svar 1 rätt
          correct: q.answer,
        }));

        //console.log("Loaded formatted questions:", formattedQuestions);
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error loading game questions:", error);
      }

      setLoading(false); // Sluta visa laddningsskärm
    };

    fetchQuestions();
  }, [gameId]);

  // kastar om svaren
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // Visa laddningsskärm om frågorna inte hunnit hämtas än
  if (loading) {
    return <div>Loading game data...</div>;
  }

  // Visa "I'm Ready!"-knapp innan spelet startar
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl mb-4">LE'Z GO!</h2>
        <button
          onClick={() => setIsReady(true)} // När användaren är redo, börja spelet
        >
          I'm Ready!
        </button>
      </div>
    );
  }

  // Om alla frågor är avklarade, visa resultat
  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Results 🎉</h2>
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

  // Visa aktuell fråga och svarsalternativ
  const question = questions[currentQuestionIndex];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Fråga {currentQuestionIndex + 1}</h2>
      {/*<p className="mb-6 text-lg">{question.text}</p> */}
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
              // Spara svaret
              setAnswers((prev) => [
                ...prev,
                {
                  questionIndex: currentQuestionIndex,
                  selected: alt,
                  correct: question.correct,
                },
              ]);
              // Gå vidare till nästa fråga direkt
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
