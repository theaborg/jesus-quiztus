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
    // if (latestPowerup.type == "Remove Words") {
    //   modfiedQuestion = latestPowerup.effect(modfiedQuestion);
    // }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Fråga {questionNumber}</h2>
      <p
        className="mb-6 text-lg"
        dangerouslySetInnerHTML={{ __html: modfiedQuestion }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modfiedAlternatives.map((alt, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-gray-300 rounded-lg 
            hover:bg-gray-100
            ${
              selectedAlternative === alt ? "bg-green-200 border-green-400" : ""
            }
          `}
            onClick={() => onAnswer(alt)}
          >
            <span dangerouslySetInnerHTML={{ __html: alt }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionView;
