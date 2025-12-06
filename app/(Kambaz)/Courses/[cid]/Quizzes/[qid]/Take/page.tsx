"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz, setMyAttempt } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form } from "react-bootstrap";

import type { Question } from "../../types";
import type { Quiz, Attempt } from "../../reducer";

/* -----------------------------------------
   Types
--------------------------------------------*/
type AnswerMap = Record<string, string>;

export default function TakeQuiz() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector((state: RootState) => state.quizzesReducer.currentQuiz);
  const myAttempts = useSelector((state: RootState) => state.quizzesReducer.myAttempts[qid]);

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [lockedAnswers, setLockedAnswers] = useState<Record<string, boolean>>({});
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);

  const [index, setIndex] = useState(0); // for one-question-at-a-time

  /* -----------------------------------------
     Load quiz + last attempt
  --------------------------------------------*/
  const loadQuiz = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));

    if (q.multipleAttempts) {
      const attempt = await client.findMyLastAttempt(qid);
      dispatch(setMyAttempt({ quizId: qid, attempt }));
      

    }

    const initial: AnswerMap = {};
    (q.questions || []).forEach((question: Question) => {
      initial[question._id] = "";
    });
    setAnswers(initial);
    setLockedAnswers({}); // reset lock state when loading quiz
  }, [dispatch, qid]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  if (!quiz) return <div style={{ padding: "20px" }}>Loading...</div>;

  const questions = quiz.questions || [];

  /* -----------------------------------------
     1️⃣ Availability Checks
  --------------------------------------------*/
  const now = new Date();
  const from = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
  const until = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

  if (!quiz.published) {
    return <div className="p-4 alert alert-warning">This quiz is not published.</div>;
  }

  if (from && now < from) {
    return <div className="p-4 alert alert-info">Quiz will open on {from.toLocaleString()}.</div>;
  }

  if (until && now > until) {
    return <div className="p-4 alert alert-danger">This quiz is closed.</div>;
  }

  /* -----------------------------------------
     2️⃣ Attempt Limit
  --------------------------------------------*/
  if (quiz.multipleAttempts && myAttempts && myAttempts.attemptNumber >= quiz.howManyAttempts) {
    return (
      <div className="p-4 alert alert-danger">
        You have used all allowed attempts for this quiz.
      </div>
    );
  }

  /* -----------------------------------------
     3️⃣ Access Code
  --------------------------------------------*/
  if (quiz.accessCode && !accessGranted) {
    return (
      <div style={{ padding: "20px" }}>
        <h4>Enter Access Code to Start</h4>
        <Form.Control
          className="mt-3"
          value={accessCodeInput}
          onChange={(e) => setAccessCodeInput(e.target.value)}
          placeholder="Access Code"
        />
        <Button
          className="mt-3"
          onClick={() => {
            if (accessCodeInput.trim() === quiz.accessCode) {
              setAccessGranted(true);
            } else {
              alert("Incorrect access code");
            }
          }}
        >
          Continue
        </Button>
      </div>
    );
  }

  /* -----------------------------------------
     Update per-question answer
  --------------------------------------------*/
  const handleChange = (questionId: string, value: string) => {
    // 🚫 Prevent changing locked questions
    if (quiz.lockQuestionsAfterAnswering && lockedAnswers[questionId]) {
      return;
    }
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /* -----------------------------------------
     Compute score
  --------------------------------------------*/
  const computeScore = () => {
    let score = 0;

    for (const q of questions) {
      const ans = answers[q._id] || "";

      if (q.type === "MCQ") {
        if (q.choices?.find((c) => c._id === ans)?.isCorrect) score += q.points;
      }

      if (q.type === "TRUE_FALSE") {
        if (String(q.correctBoolean) === ans) score += q.points;
      }

      if (q.type === "FILL_IN_BLANK") {
        if (q.acceptableAnswers?.some(
          (a) => a.trim().toLowerCase() === ans.trim().toLowerCase()
        )) score += q.points;
      }
    }

    return score;
  };

  /* -----------------------------------------
     Submit attempt
  --------------------------------------------*/
  const submit = async () => {
    const answerArray = Object.entries(answers).map(([questionId, answerText]) => ({
      questionId,
      answerText,
    }));

    const score = computeScore();

    try {
      await client.submitQuizAttempt(qid, {
        answers: answerArray,
        score,
        accessCode: accessCodeInput || undefined,
      });
      router.push(`/Courses/${cid}/Quizzes/${qid}/Results`);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Attempts limit reached.");
    }
  };

  /* -----------------------------------------
     Next button logic with locking
  --------------------------------------------*/
  const goNext = () => {
    const currentQuestion = questions[index];
    if (!currentQuestion) return;

    // ✅ Lock the answer when moving forward
    if (quiz.lockQuestionsAfterAnswering) {
      setLockedAnswers((prev) => ({
        ...prev,
        [currentQuestion._id]: true,
      }));
    }

    setIndex(index + 1);
  };

  /* -----------------------------------------
     Render single question
  --------------------------------------------*/
  const renderQuestion = (q: Question) => {
    const value = answers[q._id] || "";

    if (q.type === "MCQ") {
      return (
        <div className="mt-3">
          {(q.choices || []).map((choice) => (
            <Form.Check
              key={choice._id}
              type="radio"
              label={choice.text}
              name={`mcq-${q._id}`}
              checked={value === choice._id}
              onChange={() => handleChange(q._id, choice._id)}
            />
          ))}
        </div>
      );
    }

    if (q.type === "TRUE_FALSE") {
      return (
        <div className="mt-3">
          <Form.Check
            type="radio"
            label="True"
            checked={value === "true"}
            onChange={() => handleChange(q._id, "true")}
          />
          <Form.Check
            type="radio"
            label="False"
            checked={value === "false"}
            onChange={() => handleChange(q._id, "false")}
          />
        </div>
      );
    }

    if (q.type === "FILL_IN_BLANK") {
      return (
        <div className="mt-3">
          <Form.Control
            placeholder="Your answer"
            value={value}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        </div>
      );
    }

    return null;
  };

  /* -----------------------------------------
     Main Render
  --------------------------------------------*/
  return (
    <div style={{ padding: "20px" }}>
      <h3>{quiz.title}</h3>

      {/* Multi-question-at-once */}
      {!quiz.oneQuestionAtATime && (
        <>
          {questions.map((q, idx) => (
            <div key={q._id} className="border rounded p-3 mb-4" style={{ background: "#fafafa" }}>
              <h5>
                Question {idx + 1} ({q.points} pts)
              </h5>
              <div dangerouslySetInnerHTML={{ __html: q.text }} />
              {renderQuestion(q)}
            </div>
          ))}

          <Button variant="danger" onClick={submit}>Submit Quiz</Button>
        </>
      )}

      {/* One Question At A Time */}
      {quiz.oneQuestionAtATime && questions[index] && (
        <div className="border rounded p-3 mb-4" style={{ background: "#fafafa" }}>
          <h5>
            Question {index + 1} of {questions.length} ({questions[index].points} pts)
          </h5>

          <div dangerouslySetInnerHTML={{ __html: questions[index].text }} />
          {renderQuestion(questions[index])}

          <div className="d-flex justify-content-between mt-3">

            {/* Previous allowed only when NOT locked */}
            {!quiz.lockQuestionsAfterAnswering && (
              <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
                Previous
              </Button>
            )}

            <div className="ms-auto">
              {index < questions.length - 1 ? (
                <Button onClick={goNext}>Next</Button>
              ) : (
                <Button variant="danger" onClick={submit}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
