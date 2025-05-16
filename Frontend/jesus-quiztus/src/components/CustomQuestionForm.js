import react, { useState } from "react";

const CustomQuestionForm = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [questionSetName, setQuestionSetName] = useState("");
  const [setCategory, setSetCategory] = useState("");
  //const [onClose, setOnClose] = useState(false);
  //const [onSubmit, setOnSubmit] = useState(false);
  const [numberQuestions, setNumberQuestions] = useState(0);

  const [questions, setQuestions] = useState(
    Array.from({ length: numberQuestions }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "question") {
      updated[index].question = value;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updated = [...questions];
    updated[index].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (index, value) => {
    const updated = [...questions];
    updated[index].correctIndex = parseInt(value);
    setQuestions(updated);
  };

  const handleSubmit = () => {
    onSubmit(questions);
    onClose();
  };

  //if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Questions</h2>
        {questions.map((q, i) => (
          <div key={i} className="question-block">
            <input
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) => handleChange(i, "question", e.target.value)}
            />
            {q.options.map((opt, j) => (
              <div key={j}>
                <input
                  type="text"
                  placeholder={`Option ${j + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(i, j, e.target.value)}
                />
                <label>
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    checked={q.correctIndex === j}
                    onChange={() => handleCorrectChange(i, j)}
                  />
                  Correct
                </label>
              </div>
            ))}
            <hr />
          </div>
        ))}
        <button onClick={handleSubmit} className="modal-button">
          Save Questions
        </button>
      </div>
    </div>
  );
};

export default CustomQuestionForm;
