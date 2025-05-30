import QuestionSetsOverview from "../components/QuestionSetsOverview";
import CustomQuestionForm from "../components/CustomQuestionForm";
import { useState } from "react";

export default function CustomQuestions() {
  //const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showModal, setshowModal] = useState(false);

  if (showModal) {
    return (
      <CustomQuestionForm
        open={showModal}
        onClose={() => setshowModal(false)}
        //numberQuestions={0}
        onSubmit={(questions) => {
          console.log("Submitted questions:", questions);
          setshowModal(false);
        }}
      />
    );
  }

  return (
    <div className="custom-questions">
      <QuestionSetsOverview />
      <button
        className="in-app-button"
        onClick={() => {
          console.log("Create new question set");
          setshowModal(true);
        }}
      >
        Create New Question Set
      </button>
    </div>
  );
}
