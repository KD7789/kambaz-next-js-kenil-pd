"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz, setMyAttempt } from "../../reducer";
import * as client from "../../../../client";

import type { Quiz, Attempt } from "../../reducer";
import type { Question } from "../../types";

import { Button } from "react-bootstrap";

/* -------------------------------------------------
   Helper Types
--------------------------------------------------- */

interface MCQChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

/* -------------------------------------------------
   Component
--------------------------------------------------- */

export default function QuizResults() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  const attempts = useSelector(
    (state: RootState) => state.quizzesReducer.myAttempts
  );

  const user = useSelector(
    (state: RootState) => state.accountReducer.currentUser
  ) as { role: string } | null;

  const lastAttempt: Attempt | undefined = attempts[qid];

  /* -------------------------------------------------
     Load quiz + last attempt
  --------------------------------------------------- */
  const loadData = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));

    const attempt: Attempt = await client.findMyLastAttempt(qid);
    dispatch(setMyAttempt({ quizId: qid, attempt }));
  }, [dispatch, qid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* -------------------------------------------------
     Faculty should not access results screen
  --------------------------------------------------- */
  if (user?.role === "FACULTY") {
    return (
      <div style={{ padding: "20px" }}>
        <h4>Faculty cannot view student results. Use Preview mode instead.</h4>
        <Button
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
        >
          Go to Preview
        </Button>
      </div>
    );
  }

  if (!quiz || !lastAttempt) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const questions = quiz.questions || [];
  const answerList = lastAttempt.answers || [];

  /* -------------------------------------------------
     Determine if student is allowed to see correct answers
  --------------------------------------------------- */
  function canShowCorrectAnswers(): boolean {
    if (!quiz) return false;
  
    const mode = quiz.showCorrectAnswers || "IMMEDIATELY";
  
    if (mode === "NEVER") return false;
  
    if (mode === "AFTER_DUE_DATE") {
      if (!quiz.dueDate) return false;
      return new Date() > new Date(quiz.dueDate);
    }
  
    // IMMEDIATELY or any other value → show
    return true;
  }  
  

  const allowCorrectAnswers = canShowCorrectAnswers();

  /* -------------------------------------------------
     Is the answer correct?
  --------------------------------------------------- */
  const isCorrect = (q: Question, studentAnswer: string): boolean => {
    if (!allowCorrectAnswers) return false;

    if (q.type === "MCQ") {
      return Boolean(q.choices?.find((c) => c._id === studentAnswer)?.isCorrect);
    }

    if (q.type === "TRUE_FALSE") {
      return String(q.correctBoolean) === String(studentAnswer);
    }

    if (q.type === "FILL_IN_BLANK") {
      return (
        q.acceptableAnswers?.some(
          (ans) =>
            ans.trim().toLowerCase() === studentAnswer.trim().toLowerCase()
        ) ?? false
      );
    }

    return false;
  };

  /* -------------------------------------------------
     Render Feedback Block
  --------------------------------------------------- */
  const renderFeedback = (q: Question, studentAnswer: string) => {
    const correct = isCorrect(q, studentAnswer);

    return (
      <div
        className="p-2 mt-3"
        style={{
          borderRadius: "5px",
          background: allowCorrectAnswers
            ? correct
              ? "#e6ffed"
              : "#ffe6e6"
            : "#f2f2f2",
          border: allowCorrectAnswers
            ? correct
              ? "1px solid #28a745"
              : "1px solid #dc3545"
            : "1px solid #bbb",
        }}
      >
        {/* Correctness title */}
        <strong
          style={{
            color: allowCorrectAnswers
              ? correct
                ? "#28a745"
                : "#dc3545"
              : "#888",
          }}
        >
          {allowCorrectAnswers
            ? correct
              ? "✔ Correct"
              : "✘ Incorrect"
            : "Answer Submitted"}
        </strong>

        {/* Always show student's answer */}
        {q.type === "MCQ" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b>{" "}
            {q.choices?.find((c) => c._id === studentAnswer)?.text ||
              "(No answer)"}
            {allowCorrectAnswers && (
              <>
                <br />
                <b>Correct answer:</b>{" "}
                {q.choices?.find((c) => c.isCorrect)?.text}
              </>
            )}
          </div>
        )}

        {q.type === "TRUE_FALSE" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b> {studentAnswer}
            {allowCorrectAnswers && (
              <>
                <br />
                <b>Correct answer:</b> {String(q.correctBoolean)}
              </>
            )}
          </div>
        )}

        {q.type === "FILL_IN_BLANK" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b> {studentAnswer || "(No answer)"}
            {allowCorrectAnswers && (
              <>
                <br />
                <b>Acceptable answers:</b>{" "}
                {q.acceptableAnswers?.join(", ")}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  /* -------------------------------------------------
     MAIN RENDER
  --------------------------------------------------- */
  return (
    <div style={{ padding: "20px" }}>
      <h3>{quiz.title} — Results</h3>

      <h5 className="mt-3">
        Score: <strong>{lastAttempt.score}</strong> / {quiz.points}
      </h5>

      <p className="text-muted">
        Attempt {lastAttempt.attemptNumber}{" "}
        {quiz.multipleAttempts &&
          `of ${quiz.howManyAttempts} allowed attempts`}
      </p>

      {questions.map((q, idx) => {
        const answerObj = answerList.find(
          (a) => a.questionId === q._id
        );
        const studentAnswer = answerObj?.answerText || "";

        return (
          <div
            key={q._id}
            className="border rounded p-3 mb-4"
            style={{ background: "#fafafa" }}
          >
            <h5>
              Question {idx + 1} ({q.points} pts)
            </h5>

            <div dangerouslySetInnerHTML={{ __html: q.text }} />

            {renderFeedback(q, studentAnswer)}
          </div>
        );
      })}

      <Button
        variant="danger"
        className="mt-2"
        onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
      >
        Back to Quizzes
      </Button>

      <Button
        variant="secondary"
        className="mt-2 ms-2"
        onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
      >
        View Quiz Details
      </Button>
    </div>
  );
}
