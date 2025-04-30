import { useNavigate } from "react-router-dom";
const ResultView = ({ answers, questions, navigateHome }) => {
    const correctCount = answers.filter((a) => a.selected === a.correct).length;
    const navigate = useNavigate();
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Resultat 🎉</h2>
        <p className="text-lg mb-6">
          Du svarade rätt på <strong>{correctCount}</strong> av <strong>{questions.length}</strong> frågor.
        </p>
  
        <ul className="space-y-4 mb-6 max-w-2xl mx-auto text-left">
          {answers.map((answer, index) => {
            const question = questions[answer.questionIndex];
            const isCorrect = answer.selected === answer.correct;
            return (
              <li key={index} className="border rounded-lg p-4">
                <p className="font-semibold mb-1" dangerouslySetInnerHTML={{ __html: `Q${index + 1}: ${question.text}` }} />
                <p>✅ Rätt svar: <span className="font-medium" dangerouslySetInnerHTML={{ __html: answer.correct }} /></p>
                <p>
                  🧍 Ditt svar: 
                  <span className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`} dangerouslySetInnerHTML={{ __html: answer.selected }} /> 
                  {isCorrect ? "✔️" : "❌"}
                </p>
              </li>
            );
          })}
        </ul>
  
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Till startsidan
        </button>
      </div>
    );
  };
  
  export default ResultView;