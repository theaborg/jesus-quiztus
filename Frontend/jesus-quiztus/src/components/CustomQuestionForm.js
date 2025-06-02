import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

import { getQuestions as fetchQuestions } from "../api/questions/getQuestions";
import { getQuestionSetInfo } from "../api/questions/getQuestionSetInfo";
import { updateQuestionsSet } from "../api/questions/updateQuestionSet";
import { createQuestion } from "../api/questions/createQuestion";
import { updateQuestion } from "../api/questions/updateQuestion";
import { createSet } from "../api/questions/createSet";

import { useUser } from "../context/UserContext";

const CustomQuestionForm = ({
  open,
  onClose,
  onSubmit,
  edit,
  editableQuestionSet,
}) => {
  const { userId, session } = useUser();

  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctIndex: 0, id: null },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [questionSetName, setQuestionSetName] = useState("");
  const [category, setCategory] = useState("");

  // Load existing questions if editing

  useEffect(() => {
    const getQuestionSet = async () => {
      const setData = await getQuestionSetInfo(
        editableQuestionSet,
        userId,
        session.access_token
      );
      const set = JSON.parse(setData.data);
      //console.log("Set: ", set);
      //console.log("set name: ", set[0]?.name);
      setQuestionSetName(set[0]?.name);
      setCategory(set[0]?.category);
    };

    const getExistingQuestions = async () => {
      const existingData = await fetchQuestions(
        editableQuestionSet,
        session.access_token
      );
      const existing = JSON.parse(existingData.data);
      const formatted = existing.map((q) => {
        const correctIndex = [
          q.alternatives[0],
          q.alternatives[1],
          q.alternatives[2],
          q.alternatives[3],
        ].indexOf(q.correct);
        return {
          question: q.text,
          options: q.alternatives,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          id: q.id,
        };
      });
      setQuestions(
        formatted.length > 0
          ? formatted
          : [{ question: "", options: ["", "", "", ""], correctIndex: 0 }]
      );
    };

    if (edit && editableQuestionSet) {
      getQuestionSet();
      getExistingQuestions();
    }
  }, [edit, editableQuestionSet]);

  const updateCurrQuestion = (field, value) => {
    const updated = [...questions];
    updated[currentQuestionIndex][field] = value;
    setQuestions(updated);
  };

  const updateCurrOption = (index, value) => {
    const updated = [...questions];
    updated[currentQuestionIndex].options[index] = value;
    setQuestions(updated);
  };

  const handleNext = () => {
    const current = questions[currentQuestionIndex];
    if (!current.question.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (current.options.filter((opt) => opt.trim()).length < 2) {
      alert("Please provide at least two answer options.");
      return;
    }

    // Add new blank question if at end
    if (currentQuestionIndex === questions.length - 1) {
      setQuestions([
        ...questions,
        { question: "", options: ["", "", "", ""], correctIndex: 0 },
      ]);
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleMarkDone = () => {
    const current = questions[currentQuestionIndex];
    if (!current.question.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (current.options.filter((opt) => opt.trim()).length < 2) {
      alert("Please provide at least two answer options.");
      return;
    }

    setDone(true);
  };

  const handleFinish = async () => {
    if (edit) {
      //console.log("update table");

      if (!session?.access_token) {
        console.error("Missing or invalid session");
        return;
      }

      await updateQuestionsSet(
        editableQuestionSet,
        userId,
        questionSetName,
        category,
        session.access_token
      );

      for (const q of questions) {
        const correctAnswer = q.options[q.correctIndex];
        const wrongOptions = q.options.filter((_, i) => i !== q.correctIndex);
        if (!q.id) {
          console.log("editableQuestionSet:", editableQuestionSet);
          console.log("No Id for question");
          await createQuestion(
            q.question,
            correctAnswer,
            wrongOptions[0] || "",
            wrongOptions[1] || "",
            wrongOptions[2] || "",
            category,
            null,
            editableQuestionSet,
            session.access_token
          );
        } else {
          await updateQuestion(
            q.id,
            q.question,
            correctAnswer,
            wrongOptions[0] || "",
            wrongOptions[1] || "",
            wrongOptions[2] || "",
            category,
            null,
            session.access_token
          );
        }
      }

      onClose();
    } else {
      if (!questionSetName.trim() || !category.trim()) {
        alert("Please enter a set name and category.");
        return;
      }
      onSubmit({ name: questionSetName, category, questions });

      try {
        const setIdData = await createSet(
          questionSetName,
          category,
          questions.length,
          userId,
          session.access_token
        );
        const setId = JSON.parse(setIdData.data);
        //console.log("Set ID:", setId.id);
        for (const q of questions) {
          const correctAnswer = q.options[q.correctIndex];
          const wrongOptions = q.options.filter((_, i) => i !== q.correctIndex);

          await createQuestion(
            q.question,
            correctAnswer,
            wrongOptions[0] || "",
            wrongOptions[1] || "",
            wrongOptions[2] || "",
            category,
            null,
            setId.id,
            session.access_token
          );
        }
      } catch (err) {
        console.error("Error creating question set:", err);
        alert("Error creating question set. Please try again.");
      }

      onClose();
    }
  };

  if (!open) return null;

  // Prevent render crash if data not loaded yet
  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Loading question editor...</p>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestionIndex];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <h2> Question {currentQuestionIndex + 1}</h2>

            <textarea
              className="question-input"
              placeholder="Enter question"
              maxLength={300}
              rows={3}
              value={current.question}
              onChange={(e) => updateCurrQuestion("question", e.target.value)}
            />

            {current.options.map((opt, i) => (
              <div className="option-row" key={i}>
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateCurrOption(i, e.target.value)}
                />
                <input
                  type="radio"
                  name="correct"
                  checked={current.correctIndex === i}
                  onChange={() => updateCurrQuestion("correctIndex", i)}
                  className="radio-right"
                />
              </div>
            ))}

            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button onClick={handleNext} style={{ marginLeft: "1rem" }}>
                Next
              </button>
              <button onClick={handleMarkDone} style={{ marginLeft: "1rem" }}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Finalize Your Question Set</h2>
            <>
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
            </>
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
