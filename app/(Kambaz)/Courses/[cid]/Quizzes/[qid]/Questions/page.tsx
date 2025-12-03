"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz, updateQuizInStore } from "../../reducer";
import * as client from "../../../../client";

import { Button, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import type { Quiz } from "../../reducer";
import type { Question } from "../../types";


/* -------------------------------------------------
   Full Strong Types
--------------------------------------------------- */

interface MCQChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionType {
  _id: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  text: string;

  choices?: MCQChoice[];
  correctBoolean?: boolean;
  acceptableAnswers?: string[];
}

export default function QuestionsEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  /* -------------------------------------------------
     Load quiz (useCallback → ESLint fix)
  --------------------------------------------------- */
  const loadQuiz = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));
    setQuestions(q.questions || []);
  }, [dispatch, qid]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  /* -------------------------------------------------
     Add new question
  --------------------------------------------------- */
  const addQuestion = () => {
    const newQuestion: QuestionType = {
      _id: Date.now().toString(),
      type: "MCQ",
      title: "New Question",
      points: 1,
      text: "",
      choices: [
        { _id: "1", text: "Option 1", isCorrect: true },
        { _id: "2", text: "Option 2", isCorrect: false },
      ],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  /* -------------------------------------------------
     Update a question field
  --------------------------------------------------- */
  const updateQuestion = <K extends keyof QuestionType>(
    index: number,
    field: K,
    value: QuestionType[K]
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  /* -------------------------------------------------
     Change question type
  --------------------------------------------------- */
  const changeType = (
    index: number,
    newType: QuestionType["type"]
  ) => {
    const oldQ = questions[index];

    const base: QuestionType = {
      _id: oldQ._id,
      type: newType,
      title: oldQ.title,
      points: oldQ.points,
      text: oldQ.text,
    };

    let newQuestion: QuestionType = base;

    if (newType === "MCQ") {
      newQuestion = {
        ...base,
        choices: [
          { _id: "1", text: "Option 1", isCorrect: true },
          { _id: "2", text: "Option 2", isCorrect: false },
        ],
      };
    }

    if (newType === "TRUE_FALSE") {
      newQuestion = {
        ...base,
        correctBoolean: true,
      };
    }

    if (newType === "FILL_IN_BLANK") {
      newQuestion = {
        ...base,
        acceptableAnswers: [""],
      };
    }

    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = newQuestion;
      return updated;
    });
  };

  /* -------------------------------------------------
     Save to backend
  --------------------------------------------------- */
  const saveAll = async () => {
    await client.saveQuizQuestions(qid, questions);

    if (!quiz) return;

dispatch(
  updateQuizInStore({
    ...quiz!, // force non-null
    questions,
    points: questions.reduce((sum, q) => sum + q.points, 0),
  })
);


    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  /* -------------------------------------------------
     Cancel
  --------------------------------------------------- */
  const cancel = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  /* -------------------------------------------------
     Back to Details
  --------------------------------------------------- */
  const goToDetails = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`);
  };

  /* -------------------------------------------------
     RENDER QUESTION TYPE EDITOR
  --------------------------------------------------- */
  const renderEditor = (q: QuestionType, index: number) => {
    /* ------------ MCQ ------------ */
    if (q.type === "MCQ") {
      return (
        <div className="mt-3">
          <Form.Label>Choices</Form.Label>

          {q.choices?.map((c, i) => (
            <div key={c._id} className="d-flex align-items-center mb-2">
              {/* correct choice selector */}
              <Form.Check
                type="radio"
                name={`correct-${index}`}
                checked={c.isCorrect}
                onChange={() => {
                  const updated = q.choices!.map((opt, idx) => ({
                    ...opt,
                    isCorrect: idx === i,
                  }));
                  updateQuestion(index, "choices", updated);
                }}
                style={{ marginRight: "10px" }}
              />

              {/* text input */}
              <Form.Control
                value={c.text}
                onChange={(e) => {
                  const updated = [...q.choices!];
                  updated[i] = { ...updated[i], text: e.target.value };
                  updateQuestion(index, "choices", updated);
                }}
              />

              {/* delete choice */}
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const updated = q.choices!.filter(
                    (opt) => opt._id !== c._id
                  );
                  updateQuestion(index, "choices", updated);
                }}
              >
                X
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            className="mt-2"
            variant="secondary"
            onClick={() => {
              const updated = [
                ...(q.choices || []),
                {
                  _id: String((q.choices?.length || 0) + 1),
                  text: "New Choice",
                  isCorrect: false,
                },
              ];
              updateQuestion(index, "choices", updated);
            }}
          >
            + Choice
          </Button>
        </div>
      );
    }

    /* ------------ TRUE / FALSE ------------ */
    if (q.type === "TRUE_FALSE") {
      return (
        <div className="mt-3">
          <Form.Check
            type="radio"
            label="True"
            name={`tf-${index}`}
            checked={q.correctBoolean === true}
            onChange={() => updateQuestion(index, "correctBoolean", true)}
          />
          <Form.Check
            type="radio"
            label="False"
            name={`tf-${index}`}
            checked={q.correctBoolean === false}
            onChange={() => updateQuestion(index, "correctBoolean", false)}
          />
        </div>
      );
    }

    /* ------------ FILL IN BLANK ------------ */
    if (q.type === "FILL_IN_BLANK") {
      return (
        <div className="mt-3">
          <Form.Label>Correct Answers</Form.Label>

          {(q.acceptableAnswers || []).map((ans, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <Form.Control
                value={ans}
                onChange={(e) => {
                  const updated = [...q.acceptableAnswers!];
                  updated[i] = e.target.value;
                  updateQuestion(index, "acceptableAnswers", updated);
                }}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const updated = q.acceptableAnswers!.filter(
                    (_, idx) => idx !== i
                  );
                  updateQuestion(index, "acceptableAnswers", updated);
                }}
              >
                X
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            className="mt-2"
            variant="secondary"
            onClick={() => {
              const updated = [...(q.acceptableAnswers || []), ""];
              updateQuestion(index, "acceptableAnswers", updated);
            }}
          >
            + Answer
          </Button>
        </div>
      );
    }

    return null;
  };

  /* -------------------------------------------------
     MAIN RENDER
  --------------------------------------------------- */
  return (
    <div style={{ padding: "20px" }}>
      <h3>Quiz Questions</h3>

      {/* TABS */}
      <div className="d-flex gap-3 mt-3 mb-4">
        <div
          style={{ color: "#b30000", cursor: "pointer" }}
          onClick={goToDetails}
        >
          Details
        </div>
        <div style={{ fontWeight: 600 }}>Questions</div>
      </div>

      <Button variant="danger" className="mb-3" onClick={addQuestion}>
        <FaPlus /> New Question
      </Button>

      {questions.map((q, index) => (
        <div
          key={q._id}
          className="border rounded p-3 mb-3"
          style={{ background: "#fafafa" }}
        >
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center">
            <strong>{q.title}</strong>

            <Button
              size="sm"
              variant="outline-danger"
              onClick={() =>
                setQuestions((prev) => prev.filter((_, i) => i !== index))
              }
            >
              Delete
            </Button>
          </div>

          {/* Question Type */}
          <Form.Group className="mt-2">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
              value={q.type}
              onChange={(e) =>
                changeType(index, e.target.value as QuestionType["type"])
              }
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="FILL_IN_BLANK">Fill in the Blank</option>
            </Form.Select>
          </Form.Group>

          {/* Title */}
          <Form.Group className="mt-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={q.title}
              onChange={(e) =>
                updateQuestion(index, "title", e.target.value)
              }
            />
          </Form.Group>

          {/* Points */}
          <Form.Group className="mt-2">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={q.points}
              onChange={(e) =>
                updateQuestion(index, "points", Number(e.target.value))
              }
            />
          </Form.Group>

          {/* Prompt */}
          <Form.Group className="mt-2">
            <Form.Label>Prompt</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={q.text}
              onChange={(e) => updateQuestion(index, "text", e.target.value)}
            />
          </Form.Group>

          {/* Dynamic editor */}
          {renderEditor(q, index)}
        </div>
      ))}

      <div className="mt-4 d-flex gap-3">
        <Button variant="danger" onClick={saveAll}>
          Save
        </Button>
        <Button variant="secondary" onClick={cancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}