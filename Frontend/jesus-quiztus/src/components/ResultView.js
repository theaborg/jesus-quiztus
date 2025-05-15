import { useNavigate } from "react-router-dom";
import "../styles/ResultView.scss";

const ResultView = ({ answers, questions }) => {
  const correctCount = answers.filter((a) => a.selected === a.correct).length;
  const navigate = useNavigate();

  return (
    <div className="result-container">
      <div className="result-card">
        <h2>Resultat 🎉</h2>
        <p className="summary">
          Du svarade rätt på <strong>{correctCount}</strong> av <strong>{questions.length}</strong> frågor.
        </p>

        <ul className="answer-list">
          {answers.map((answer, index) => {
            const question = questions[answer.questionIndex];
            const isCorrect = answer.selected === answer.correct;
            return (
              <li key={index}>
                <p
                  className="question-text"
                  dangerouslySetInnerHTML={{
                    __html: `Q${index + 1}: ${question.text}`,
                  }}
                />
                <p>
                  ✅ Rätt svar:{" "}
                  <span
                    className="correct"
                    dangerouslySetInnerHTML={{ __html: answer.correct }}
                  />
                </p>
                <p>
                  🧍 Ditt svar:{" "}
                  <span
                    className={isCorrect ? "correct" : "wrong"}
                    dangerouslySetInnerHTML={{ __html: answer.selected }}
                  />{" "}
                  {isCorrect ? "✔️" : "❌"}
                </p>
              </li>
            );
          })}
        </ul>

        <button className="back-button" onClick={() => navigate("/")}>
          Till startsidan
        </button>
      </div>
    </div>
  );
};

export default ResultView;
