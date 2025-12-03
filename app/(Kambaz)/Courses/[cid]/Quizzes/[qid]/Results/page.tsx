"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz, setMyAttempt } from "../../reducer";
import * as client from "../../../../client";
import type { Quiz, Attempt } from "../../reducer";

import { Button } from "react-bootstrap";

/* -------------------------------------------------
   Strong Types (No any)
--------------------------------------------------- */

interface MCQChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  text: string;
  choices?: MCQChoice[];
  correctBoolean?: boolean;
  acceptableAnswers?: string[];
}

interface Answer {
  questionId: string;
  answerText: string;
}

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

  if (!quiz || !lastAttempt) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const questions = quiz.questions || [];
  const answerList = lastAttempt.answers || [];

  /* -------------------------------------------------
     Is Correct?
  --------------------------------------------------- */
  const isCorrect = (q: Question, studentAnswer: string): boolean => {
    if (q.type === "MCQ") {
      const choice = q.choices?.find((c) => c._id === studentAnswer);
      return Boolean(choice?.isCorrect);
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
          background: correct ? "#e6ffed" : "#ffe6e6",
          border: correct ? "1px solid #28a745" : "1px solid #dc3545",
        }}
      >
        {/* CORRECT / INCORRECT TEXT */}
        <strong style={{ color: correct ? "#28a745" : "#dc3545" }}>
          {correct ? "✔ Correct" : "✘ Incorrect"}
        </strong>

        {/* MCQ */}
        {q.type === "MCQ" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b>{" "}
            {q.choices?.find((c) => c._id === studentAnswer)?.text ||
              "(No answer)"}
            <br />
            <b>Correct answer:</b>{" "}
            {q.choices?.find((c) => c.isCorrect)?.text}
          </div>
        )}

        {/* TRUE / FALSE */}
        {q.type === "TRUE_FALSE" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b> {studentAnswer}
            <br />
            <b>Correct answer:</b> {String(q.correctBoolean)}
          </div>
        )}

        {/* FILL IN THE BLANK */}
        {q.type === "FILL_IN_BLANK" && (
          <div style={{ marginTop: "5px" }}>
            <b>Your answer:</b> {studentAnswer || "(No answer)"}
            <br />
            <b>Acceptable answers:</b> {q.acceptableAnswers?.join(", ")}
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
