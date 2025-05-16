import { useUser } from "../context/UserContext";
import React, { useEffect, useState } from "react";
import { getQuestionSets } from "../CRUD/questions";

import "../styles/QuestionSetsOverview.scss";

export default function QuestionSetsOverview() {
  const { userId } = useUser();

  const [questionSets, setQuestionSets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [questionSetName, setQuestionSetName] = useState("");
  const [setCategory, setSetCategory] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchQuestionSets = async () => {
      const questionSets = await getQuestionSets(userId);
      setQuestionSets(questionSets);
    };

    fetchQuestionSets();
  }, [userId]);

  return (
    <div className="question-sets">
      {questionSets.map((set) => (
        <div key={set.id} className="question-set-card">
          <h2 className="question-set-name">{set.name}</h2>
          <p>{set.description}</p>
          <p>Questions: {set.amount}</p>
          <button
            className="edit-set-button"
            onClick={() => {
              console.log("Edit set", set.id);
              
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
  // display existing question sets
  /// should also be a button to create a new question set
}
