const QuestionView = ({
  question,
  questionNumber,
  onAnswer,
  selectedAlternative,
}) => {
  if (!question) {
    return <div>Laddar fråga...</div>; // or just return null if you want to hide it
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Fråga {questionNumber}</h2>
      <p
        className="mb-6 text-lg"
        dangerouslySetInnerHTML={{ __html: question.text }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.alternatives.map((alt, index) => (
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
