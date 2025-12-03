"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form } from "react-bootstrap";

import type { Question } from "../../types";
import type { Quiz} from "../../reducer";


/* -----------------------------------------
   Types
--------------------------------------------*/
type AnswerMap = Record<string, string>;

export default function TakeQuiz() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  // Removed unused currentUser

  const [answers, setAnswers] = useState<AnswerMap>({});

  /* -----------------------------------------
     Load quiz
  --------------------------------------------*/
  const loadQuiz = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));

    const initial: AnswerMap = {};
    (q.questions || []).forEach((question: Question) => {
      initial[question._id] = "";
    });
    setAnswers(initial);
  }, [dispatch, qid]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const questions = (quiz.questions || []) as Question[];

  /* -----------------------------------------
     Update per-question answer
  --------------------------------------------*/
  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /* -----------------------------------------
     Submit attempt
  --------------------------------------------*/
  const submit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answerText]) => ({
        questionId,
        answerText,
      })
    );

    await client.submitQuizAttempt(qid, formattedAnswers);
    router.push(`/Courses/${cid}/Quizzes/${qid}/Results`);
  };

  /* -----------------------------------------
     Render per question type
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

      <p className="text-muted">Answer all questions and submit your attempt.</p>

      {questions.map((q, idx) => (
        <div
          key={q._id}
          className="border rounded p-3 mb-4"
          style={{ background: "#fafafa" }}
        >
          <h5>
            Question {idx + 1} ({q.points} pts)
          </h5>

          <div dangerouslySetInnerHTML={{ __html: q.text }} />
          {renderQuestion(q)}
        </div>
      ))}

      <Button variant="danger" onClick={submit}>
        Submit Quiz
      </Button>
    </div>
  );
}
