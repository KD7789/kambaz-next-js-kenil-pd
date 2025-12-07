"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { v4 as uuid } from "uuid";

import { setCurrentQuiz, updateQuizInStore, type Quiz } from "../../reducer";
import * as client from "../../../../client";

import { Button, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import type { Question } from "../../types";
import dynamic from "next/dynamic";

import JoditEditorWrapper from "../../../../../Components/JoditEditorWrapper";



/* -------------------------------------------------
   QUESTIONS EDITOR
--------------------------------------------------- */

export default function QuestionsEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const quiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  const [questions, setQuestions] = useState<Question[]>([]);

  /* -------------------------------------------------
     Load quiz + questions
  --------------------------------------------------- */
  const loadQuiz = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));
    setQuestions((q.questions ?? []).map(q => ({ ...q, editing: false })));
  }, [dispatch, qid]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  /* -------------------------------------------------
     Add new question (default MCQ)
  --------------------------------------------------- */
  const addQuestion = () => {
    const newQuestion: Question = {
      _id: uuid(),
      type: "MCQ",
      title: "New Question",
      points: 1,
      text: "",
      editing: false,
      choices: [
        { _id: uuid(), text: "Option 1", isCorrect: true },
        { _id: uuid(), text: "Option 2", isCorrect: false },
      ],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  /* -------------------------------------------------
     Update a question field
  --------------------------------------------------- */
  const updateQuestion = <K extends keyof Question>(
    index: number,
    field: K,
    value: Question[K]
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
  const changeType = (index: number, newType: Question["type"]) => {
    setQuestions((prev) => {
      const current = prev[index];

      const base: Question = {
        _id: current._id,
        type: newType,
        title: current.title,
        points: current.points,
        text: current.text,
      };

      let next: Question = base;

      if (newType === "MCQ") {
        next = {
          ...base,
          choices: [
            { _id: uuid(), text: "Option 1", isCorrect: true },
            { _id: uuid(), text: "Option 2", isCorrect: false },
          ],
        };
      } else if (newType === "TRUE_FALSE") {
        next = {
          ...base,
          correctBoolean: true,
        };
      } else if (newType === "FILL_IN_BLANK") {
        next = {
          ...base,
          acceptableAnswers: [""],
        };
      }

      const updated = [...prev];
      updated[index] = next;
      return updated;
    });
  };

  const [backup, setBackup] = useState<Record<string, Question>>({});

  /* -------------------------------------------------
     Save to backend
  --------------------------------------------------- */
  const saveAll = async () => {
    await client.saveQuizQuestions(qid, questions);

    if (!quiz) return;

    const updatedQuiz: Quiz = {
      ...quiz,
      questions,
      points: questions.reduce((sum, q) => sum + (q.points ?? 0), 0),
    };

    dispatch(updateQuizInStore(updatedQuiz));
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

  const setEditing = (index: number, editing: boolean) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], editing };
      return copy;
    });
  };  

  /* -------------------------------------------------
     Render per question type
  --------------------------------------------------- */
  const renderEditor = (q: Question, index: number) => {
    /* ------------ MCQ ------------ */
    if (q.type === "MCQ") {
      return (
        <div className="mt-3">
          <Form.Label>Choices</Form.Label>

          {q.choices?.map((c) => (
            <div key={c._id} className="d-flex align-items-center mb-2">
              {/* correct choice selector */}
              <Form.Check
                type="radio"
                name={`correct-${q._id}`}
                checked={c.isCorrect}
                onChange={() => {
                  const updatedChoices =
                    q.choices?.map((choice) => ({
                      ...choice,
                      isCorrect: choice._id === c._id,
                    })) ?? [];
                  updateQuestion(index, "choices", updatedChoices);
                }}
                style={{ marginRight: "10px" }}
              />

              {/* text input */}
              <Form.Control
                value={c.text}
                onChange={(e) => {
                  const updatedChoices =
                    q.choices?.map((choice) =>
                      choice._id === c._id
                        ? { ...choice, text: e.target.value }
                        : choice
                    ) ?? [];
                  updateQuestion(index, "choices", updatedChoices);
                }}
              />

              {/* delete choice (only the choice, not the whole question) */}
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const updatedChoices =
                    q.choices?.filter((choice) => choice._id !== c._id) ?? [];
                  updateQuestion(index, "choices", updatedChoices);
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
              const updatedChoices = [
                ...(q.choices ?? []),
                {
                  _id: uuid(),
                  text: "New Choice",
                  isCorrect: false,
                },
              ];
              updateQuestion(index, "choices", updatedChoices);
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
            name={`tf-${q._id}`}
            checked={q.correctBoolean === true}
            onChange={() => updateQuestion(index, "correctBoolean", true)}
          />
          <Form.Check
            type="radio"
            label="False"
            name={`tf-${q._id}`}
            checked={q.correctBoolean === false}
            onChange={() => updateQuestion(index, "correctBoolean", false)}
          />
        </div>
      );
    }

    /* ------------ FILL IN BLANK ------------ */
    if (q.type === "FILL_IN_BLANK") {
      const answers = q.acceptableAnswers ?? [];
      return (
        <div className="mt-3">
          <Form.Label>Correct Answers</Form.Label>

          {answers.map((ans, i) => (
            <div key={`${q._id}-${i}`} className="d-flex align-items-center mb-2">
              <Form.Control
                value={ans}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i] = e.target.value;
                  updateQuestion(index, "acceptableAnswers", newAnswers);
                }}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  const newAnswers = answers.filter((_, idx) => idx !== i);
                  updateQuestion(index, "acceptableAnswers", newAnswers);
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
              const newAnswers = [...answers, ""];
              updateQuestion(index, "acceptableAnswers", newAnswers);
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
    {/* ======================== PREVIEW MODE ======================== */}
{!q.editing && (
  <>
    <div className="d-flex justify-content-between align-items-center">
      <strong>{q.title}</strong>

      <div className="d-flex gap-2">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => {
            setBackup(prev => ({ ...prev, [q._id]: { ...q } }));
            setEditing(index, true);
          }}
        >
          Edit
        </Button>

        <Button
          size="sm"
          variant="outline-danger"
          onClick={() =>
            setQuestions(prev => prev.filter((_, i) => i !== index))
          }
        >
          Delete
        </Button>
      </div>
    </div>

    <div className="mt-2">Type: {q.type}</div>
    <div>Points: {q.points}</div>

    {/* ⭐ SHOW QUESTION PROMPT (HTML) IN PREVIEW MODE ⭐ */}
    <div
      className="mt-3"
      dangerouslySetInnerHTML={{ __html: q.text || "" }}
    />
  </>
)}


    {/* ======================== EDIT MODE ======================== */}
    {q.editing && (
      <>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <strong>Editing: {q.title}</strong>
        </div>

        {/* Question Type */}
        <Form.Group className="mt-2">
          <Form.Label>Question Type</Form.Label>
          <Form.Select
            value={q.type}
            onChange={(e) =>
              changeType(index, e.target.value as Question["type"])
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
            onChange={(e) => updateQuestion(index, "title", e.target.value)}
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
  <JoditEditorWrapper
    value={q.text || ""}
    onChange={(value: string) =>
      updateQuestion(index, "text", value)
    }
  />
</Form.Group>


        {/* Type-specific editor */}
        {renderEditor(q, index)}

        {/* Save / Cancel */}
        <div className="mt-3 d-flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => setEditing(index, false)}
          >
            Save
          </Button>

          <Button
  size="sm"
  variant="secondary"
  onClick={() => {
    setQuestions(prev => {
      const copy = [...prev];
      const original = backup[q._id];

      if (original) {
        copy[index] = original;  // restore backup safely
      }

      return copy;
    });

    setEditing(index, false);
  }}
>
  Cancel
</Button>

        </div>
      </>
    )}
  </div>
))}
{/* SAVE / CANCEL ALL QUESTIONS */}
<div className="mt-4 d-flex gap-3">
  <Button variant="danger" onClick={saveAll}>
    Save All Questions
  </Button>

  <Button variant="secondary" onClick={cancel}>
    Cancel
  </Button>
</div>

 </div>
  );
}

