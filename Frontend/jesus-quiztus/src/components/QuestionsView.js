const QuestionView = ({ question, questionNumber, onAnswer }) => {
    return (
      <div className="p-4">
        <h2 className="text-2xl mb-4">Fråga {questionNumber}</h2>
        <p className="mb-6 text-lg" dangerouslySetInnerHTML={{ __html: question.text }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.alternatives.map((alt, index) => (
            <button
              key={index}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
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