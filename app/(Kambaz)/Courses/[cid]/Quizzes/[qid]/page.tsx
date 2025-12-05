"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import type { Quiz } from "../reducer";

import {
  setCurrentQuiz,
  setMyAttempt,
} from "../reducer";

import * as client from "../../../client"; // API client

import { Button } from "react-bootstrap";

export default function QuizDetails() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const currentQuiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );
  const myAttempts = useSelector(
    (state: RootState) => state.quizzesReducer.myAttempts
  );
  const currentUser = useSelector(
    (state: RootState) => state.accountReducer.currentUser as
      | { role: string }
      | null
  );  

  const isFaculty = currentUser?.role === "FACULTY";

  function getAvailability(quiz: Quiz) {
    const now = new Date();
    const from = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
    const until = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
  
    if (from && now < from) return `Not available until ${from.toLocaleDateString()}`;
    if (until && now > until) return "Closed";
    return "Available";
  }   

  /* -----------------------------------------
     Load quiz details + my last attempt
  --------------------------------------------*/
  const loadData = useCallback(async () => {
    const quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(quiz));
  
    if (currentUser?.role === "STUDENT") {
      const attempt = await client.findMyLastAttempt(qid);
      dispatch(setMyAttempt({ quizId: qid, attempt }));
    }
  }, [qid, dispatch, currentUser?.role]);
  

  useEffect(() => {
    loadData();
  }, [loadData]);
  


  if (!currentQuiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const lastAttempt = myAttempts[qid];


  /* -----------------------------------------
     Render for Faculty
  --------------------------------------------*/
  if (isFaculty) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>{currentQuiz.title}</h3>

        <p className="text-muted">{currentQuiz.description}</p>

<div className="text-muted mb-3">
  <strong>Status: </strong>
  {currentQuiz.published ? "Published ✅" : "Unpublished 🚫"}  
  <br />
  <strong>Availability: </strong> {getAvailability(currentQuiz)}
</div>


<div className="mt-4">
  <strong>Quiz Type:</strong> {currentQuiz.quizType}
</div>

<div>
  <strong>Points:</strong> {currentQuiz.points}
</div>

<div>
  <strong>Assignment Group:</strong> {currentQuiz.assignmentGroup}
</div>

<div>
  <strong>Shuffle Answers:</strong> {currentQuiz.shuffleAnswers ? "Yes" : "No"}
</div>

<div>
  <strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes
</div>

<div>
  <strong>Multiple Attempts:</strong> {currentQuiz.multipleAttempts ? "Yes" : "No"}
</div>

{currentQuiz.multipleAttempts && (
  <div>
    <strong>How Many Attempts:</strong> {currentQuiz.howManyAttempts}
  </div>
)}

<div>
  <strong>Show Correct Answers:</strong>{" "}
  {currentQuiz.showCorrectAnswers ? "Yes" : "No"}
</div>

<div>
  <strong>Access Code:</strong> {currentQuiz.accessCode || "—"}
</div>

<div>
  <strong>One Question at a Time:</strong>{" "}
  {currentQuiz.oneQuestionAtATime ? "Yes" : "No"}
</div>

<div>
  <strong>Webcam Required:</strong>{" "}
  {currentQuiz.webcamRequired ? "Yes" : "No"}
</div>

<div>
  <strong>Lock Questions After Answering:</strong>{" "}
  {currentQuiz.lockAfterAnswering ? "Yes" : "No"}
</div>


        {/* Dates */}
        <div className="mt-3">
          <strong>Available From:</strong>{" "}
          {currentQuiz.availableFrom || "—"}
        </div>
        <div>
          <strong>Available Until:</strong>{" "}
          {currentQuiz.availableUntil || "—"}
        </div>
        <div>
          <strong>Due Date:</strong> {currentQuiz.dueDate || "—"}
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)
            }
          >
            Preview
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)
            }
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }


  /* -----------------------------------------
     Render for Students
  --------------------------------------------*/
  /* -----------------------------------------
   Render for Students
--------------------------------------------*/
return (
  <div style={{ padding: "20px" }}>
    <h3>{currentQuiz.title}</h3>
    <p className="text-muted">{currentQuiz.description}</p>

    {/* Availability / Score info */}
    <div className="mt-3">
      <div>
        <strong>Points:</strong> {currentQuiz.points}
      </div>
      <div>
        <strong>Questions:</strong> {currentQuiz.questions?.length || 0}
      </div>

      {lastAttempt && (
        <div className="mt-2">
          <strong>Your Last Score:</strong> {lastAttempt.score} /{" "}
          {currentQuiz.points}
        </div>
      )}
    </div>

    {/* Unpublished warning */}
    {!currentQuiz.published && (
      <div className="alert alert-warning mt-3">
        This quiz is not yet available.
      </div>
    )}

    {/* Access Code message (always shown if needed) */}
    {currentQuiz.accessCode && (
      <div className="alert alert-info mt-3">
        This quiz requires an access code before starting.
      </div>
    )}

    {/* Start / Retake button */}
    <div className="mt-4">
      {currentQuiz.published && (
        <Button
          variant="danger"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)
          }
          disabled={
            currentQuiz.multipleAttempts &&
            lastAttempt &&
            lastAttempt.attemptNumber >= currentQuiz.howManyAttempts
          }
        >
          {lastAttempt ? "Retake Quiz" : "Take Quiz"}
        </Button>
      )}

      {/* Out-of-attempts message */}
      {currentQuiz.multipleAttempts &&
        lastAttempt &&
        lastAttempt.attemptNumber >= currentQuiz.howManyAttempts && (
          <div className="text-danger mt-2">
            You have used all allowed attempts for this quiz.
          </div>
        )}
    </div>
  </div>
);

}