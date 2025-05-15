import "../styles/QuestionsView.scss";
const QuestionView = ({
  question,
  questionNumber,
  onAnswer,
  selectedAlternative,
  receivedPowerUps,
}) => {
  if (!question) {
    return <div>Laddar fråga...</div>; // or just return null if you want to hide it
  }
  let modfiedQuestion = question.text;
  let modfiedAlternatives = question.alternatives;
  let latestPowerup = null;

  if (receivedPowerUps && receivedPowerUps.length !== 0) {
    latestPowerup = receivedPowerUps[receivedPowerUps.length - 1];
    console.log("latestPowerup", latestPowerup);

    switch (latestPowerup.type) {
      case "Remove Words":
        modfiedQuestion = latestPowerup.effect(modfiedQuestion);
        break;
      case "Eliminate Two":
        latestPowerup.effect(modfiedAlternatives);
        break;
      case "Shuffle Answers":
        modfiedAlternatives = latestPowerup.effect(modfiedAlternatives);
        break;
      default:
        break;
    }
  }

  return (
    <div className="questions-view">
      <div className="question-card">
        {question.image && <img src={question.image} alt="Question visual" />}
        <div className="category">
          <span
            dangerouslySetInnerHTML={{
              __html: question.category || "Kategori",
            }}
          />
        </div>

        <p
          className="question-text"
          dangerouslySetInnerHTML={{ __html: modfiedQuestion }}
        />
      </div>
      <div className="alternatives-grid">
        {modfiedAlternatives.map((alt, index) => (
          <button
            key={index}
            className={selectedAlternative === alt ? "selected" : ""}
            onClick={() => onAnswer(alt)}
            // Stänger av knapparna om ett alt har
            disabled={selectedAlternative !== null}
          >
            <span dangerouslySetInnerHTML={{ __html: alt }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionView;
