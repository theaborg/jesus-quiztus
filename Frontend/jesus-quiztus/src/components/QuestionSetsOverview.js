import { useUser } from "../context/UserContext";
import React, { useEffect, useState } from "react";
import { getQuestionSets } from "../CRUD/questions";
import CustomQuestionForm from "../components/CustomQuestionForm";

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

  if (showModal) {
    return (
      <CustomQuestionForm
        open={showModal}
        onClose={() => setShowModal(false)}
        //numberQuestions={0}
        onSubmit={(questions) => {
          console.log("Submitted questions:", questions);
          setShowModal(false);
        }}
      />
    );
  }

  return (
    <div className="">
      <div className="question-sets">
        {questionSets.map((set) => (
          <div key={set.id} className="question-set-card">
            <h2 className="question-set-name">{set.name}</h2>
            <p>{set.description}</p>
            <p>Questions: {set.amount}</p>
            <button
              className="edit-set-button"
              // TODO: pass existing questions to modal
              // so they can be shown instead of filled in
              onClick={() => {
                console.log("Create new question set");
                setShowModal(true);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
