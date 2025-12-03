"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";

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

  /* -----------------------------------------
     Load quiz details + my last attempt
  --------------------------------------------*/
  const loadData = async () => {
    const quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(quiz));

    if (currentUser?.role === "STUDENT") {
      const attempt = await client.findMyLastAttempt(qid);
      dispatch(setMyAttempt({ quizId: qid, attempt }));
    }
  };

  useEffect(() => {
    loadData();
  }, [qid]);


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
          <strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes
        </div>
        <div>
          <strong>Multiple Attempts:</strong>{" "}
          {currentQuiz.multipleAttempts ? "Yes" : "No"}
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

      {/* Start / Retake button */}
      <div className="mt-4">
        <Button
          variant="danger"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)
          }
        >
          {lastAttempt ? "Retake Quiz" : "Take Quiz"}
        </Button>
      </div>
    </div>
  );
}