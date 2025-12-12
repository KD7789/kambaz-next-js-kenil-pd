"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form } from "react-bootstrap";
import type { Quiz } from "../../reducer";
import type { Question } from "../../types";

type AnswerMap = Record<string, string>;

export default function PreviewQuiz() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  const user = useSelector(
    (state: RootState) =>
      state.accountReducer.currentUser as { role?: string } | null
  );

  const isFaculty = user?.role === "FACULTY";

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const loadQuiz = useCallback(async () => {
    const data: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(data));

    const initial: AnswerMap = {};
    (data.questions || []).forEach((q: Question) => {
      initial[q._id] = "";
    });

    setAnswers(initial);
    setSubmitted(false);
  }, [dispatch, qid]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }
  
  const questions: Question[] = quiz.questions || [];
  
  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  

  if (!isFaculty) {
    return (
      <div style={{ padding: "20px" }}>
        <h4>Only faculty can preview quizzes.</h4>
      </div>
    );
  }

  const isCorrect = (q: Question, ans: string): boolean => {
    if (q.type === "MCQ") {
      return Boolean(q.choices?.find((c) => c._id === ans)?.isCorrect);
    }

    if (q.type === "TRUE_FALSE") {
      return String(q.correctBoolean) === String(ans);
    }

    if (q.type === "FILL_IN_BLANK") {
      return (
        q.acceptableAnswers?.some(
          (a) => a.trim().toLowerCase() === ans.trim().toLowerCase()
        ) ?? false
      );
    }

    return false;
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = submitted
    ? questions.reduce((sum, q) => {
        const ans = answers[q._id] || "";
        return sum + (isCorrect(q, ans) ? q.points : 0);
      }, 0)
    : 0;

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitPreview = () => {
    setSubmitted(true);
  };

  const renderQuestion = (q: Question) => {
    const studentAnswer = answers[q._id] || "";

    if (submitted) {
      const correct = isCorrect(q, studentAnswer);

      return (
        <div
          className="p-2 mt-2"
          style={{
            borderRadius: "5px",
            background: correct ? "#e6ffed" : "#ffe6e6",
            border: correct ? "1px solid #28a745" : "1px solid #dc3545",
          }}
        >
          <strong style={{ color: correct ? "#28a745" : "#dc3545" }}>
            {correct ? "✔ Correct" : "✘ Incorrect"}
          </strong>

          {q.type === "MCQ" && (
            <div className="mt-1">
              <b>Your answer:</b>{" "}
              {q.choices?.find((c) => c._id === studentAnswer)?.text ||
                "(No answer)"}
              <br />
              <b>Correct answer:</b>{" "}
              {q.choices?.find((c) => c.isCorrect)?.text}
            </div>
          )}

          {q.type === "TRUE_FALSE" && (
            <div className="mt-1">
              <b>Your answer:</b> {studentAnswer || "(No answer)"}
              <br />
              <b>Correct answer:</b> {String(q.correctBoolean)}
            </div>
          )}

          {q.type === "FILL_IN_BLANK" && (
            <div className="mt-1">
              <b>Your answer:</b> {studentAnswer || "(No answer)"}
              <br />
              <b>Correct answers:</b>{" "}
              {q.acceptableAnswers?.join(", ") || ""}
            </div>
          )}
        </div>
      );
    }

    if (q.type === "MCQ") {
      return (
        <div className="mt-2">
          {q.choices?.map((choice) => (
            <Form.Check
              key={choice._id}
              type="radio"
              name={`mcq-${q._id}`}
              label={choice.text}
              checked={studentAnswer === choice._id}
              onChange={() => handleChange(q._id, choice._id)}
            />
          ))}
        </div>
      );
    }

    if (q.type === "TRUE_FALSE") {
      return (
        <div className="mt-2">
          <Form.Check
            type="radio"
            label="True"
            checked={studentAnswer === "true"}
            onChange={() => handleChange(q._id, "true")}
          />
          <Form.Check
            type="radio"
            label="False"
            checked={studentAnswer === "false"}
            onChange={() => handleChange(q._id, "false")}
          />
        </div>
      );
    }

    if (q.type === "FILL_IN_BLANK") {
      return (
        <div className="mt-2">
          <Form.Control
            placeholder="Your answer"
            value={studentAnswer}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        </div>
      );
    }

    return null;
  };

  const q = questions[currentIndex];

  return (
    <div style={{ padding: "20px" }}>
      <h3>Preview: {quiz.title}</h3>

      <p className="text-muted">
        This is how students will see the quiz. Your answers will NOT be saved.
      </p>

      {submitted && (
        <h5 className="mb-3">
          Score: {earnedPoints} / {totalPoints}
        </h5>
      )}

<div
  key={q._id}
  className="border rounded p-3 mb-4"
  style={{ background: "#fafafa" }}
>
  <h5>
    Question {currentIndex + 1} of {questions.length} ({q.points} pts)
  </h5>

  <div dangerouslySetInnerHTML={{ __html: q.text }} />

  {renderQuestion(q)}
</div>


<div className="d-flex justify-content-between mt-4 mb-4">
  <Button
    variant="secondary"
    disabled={currentIndex === 0}
    onClick={goPrev}
  >
    Previous
  </Button>

  {!submitted && (
    <Button
      variant="secondary"
      disabled={currentIndex === questions.length - 1}
      onClick={goNext}
    >
      Next
    </Button>
  )}
</div>

<div className="mt-4">
  {!submitted ? (
    currentIndex === questions.length - 1 ? (
      <Button variant="danger" onClick={submitPreview}>
        Submit Preview
      </Button>
    ) : null
  ) : (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)
        }
      >
        Edit Quiz
      </Button>

      <Button
        variant="danger"
        className="ms-2"
        onClick={() => setSubmitted(false)}
      >
        Try Again
      </Button>
    </>
  )}
</div>

    </div>
  );
}
