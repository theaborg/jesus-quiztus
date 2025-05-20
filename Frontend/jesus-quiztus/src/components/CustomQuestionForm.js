import React, { useState } from "react";
import { createSet, createQuestion } from "../CRUD/questions";

const CustomQuestionForm = ({ open, onClose, onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [questionSetName, setQuestionSetName] = useState("");
  const [category, setCategory] = useState("");


  const createQuestionSet = async (name, category, questions, userId) => {
    try {
      const setId = await createSet(name, category, questions.length, userId);
      for (const question of questions) {
        await createQuestion(
          question.question,
          question.options[question.correctIndex],
          question.options[0],
          question.options[1],
          question.options[2],
          category,
          null,
          setId
        );
      }
    }
    catch (error) {
      console.error("Error creating question set:", error);   
      alert("Error creating question set. Please try again.");
    }

  };


  const handleNext = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please fill in the question and all options.");
      return;
    }

    const newQuestion = {
      question,
      options,
      correctIndex,
    };

    setQuestions([...questions, newQuestion]);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleMarkDone = () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please complete the current question before finishing.");
      return;
    }

    const newQuestion = {
      question,
      options,
      correctIndex,
    };

    setQuestions([...questions, newQuestion]);
    setDone(true);
  };

  const handleFinish = () => {
    if (!questionSetName.trim() || !category.trim()) {
      alert("Please enter a set name and category.");
      return;
    }

    onSubmit({
      name: questionSetName,
      category,
      questions,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <h2>Creating Question {currentQuestionIndex + 1}</h2>

            <input
              type="text"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            {options.map((opt, i) => (
              <div key={i}>
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...options];
                    updated[i] = e.target.value;
                    setOptions(updated);
                  }}
                />
                <label>
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                  />
                  Correct
                </label>
              </div>
            ))}

            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleNext}>Add Another Question</button>
              <button onClick={handleMarkDone} style={{ marginLeft: "1rem" }}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Finalize Your Question Set</h2>
            <input
              type="text"
              placeholder="Enter Question Set Name"
              value={questionSetName}
              onChange={(e) => setQuestionSetName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button onClick={handleFinish} style={{ marginTop: "1rem" }}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomQuestionForm;
