import { useUser } from "../context/UserContext";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
//import { getQuestionSets } from "../CRUD/questions";
import { useNavigate } from "react-router-dom";
import CustomQuestionForm from "../components/CustomQuestionForm";

import { getQuestionSets } from "../api/questions/getQuestionSets";

import "../styles/QuestionSetsOverview.scss";

export default function QuestionSetsOverview() {
  const { userId, session } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [editableQuestionSet, setEditableQuestionSet] = useState(null);
  const [questionSets, setQuestionSets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchQuestionSets = async () => {
    console.log("In func update question set");
    const questionSetsData = await getQuestionSets(
      userId,
      session.access_token
    );
    const questionSets = JSON.parse(questionSetsData.data);
    setQuestionSets(questionSets);
  };

  useEffect(() => {
    if (!userId) return;

    // Get the existing question sets initially
    fetchQuestionSets();

    const channel = supabase.channel("question_sets_channel");

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "QuestionsSet",
          filter: `user=eq.${userId}`,
        },
        fetchQuestionSets
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const startGameWithSet = async (gameSetID) => {
    //console.log("start game with set: ", gameSetID);
    navigate("/new-game", { state: { setId: gameSetID } });
  };

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
    <div className="custom-questions">
      <div className="question-sets">
        {questionSets
          .filter((set) => set.name !== "Trivia Game Set")
          .map((set) => (
            <div key={set.id} className="question-set-card">
              <h2 className="question-set-name">{set.name}</h2>
              <p>{set.description}</p>
              {/* <p>Questions: {set.amount}</p> */}
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
              <button
                className="edit-set-button"
                onClick={() => {
                  startGameWithSet(set.id);
                }}
              >
                Start Game
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
