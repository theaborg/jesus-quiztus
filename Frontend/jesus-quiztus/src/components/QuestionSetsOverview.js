import { useUser } from "../context/UserContext";
import React, { useEffect, useState } from "react";
import { getQuestionSets } from "../CRUD/questions";
import CustomQuestionForm from "../components/CustomQuestionForm";

import "../styles/QuestionSetsOverview.scss";

export default function QuestionSetsOverview() {
  const { userId } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editableQuestionSet, setEditableQuestionSet] = useState(null);
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
        edit={editMode}
        editableQuestionSet={editableQuestionSet}
        onSubmit={(questions) => {
          console.log("Submitted questions:", questions);
          setShowModal(false);
          setEditMode(false);
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
              onClick={() => {
                console.log("Edit existing question set.");
                setEditMode(true);
                setEditableQuestionSet(set.id);
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
