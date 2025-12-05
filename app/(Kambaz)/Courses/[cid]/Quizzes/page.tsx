"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import type { Quiz } from "../Quizzes/reducer";

import {
  setQuizzes,
  addQuiz,
  updateQuizInStore,
  deleteQuizInStore,
} from "./reducer";

import * as client from "../../client"; // API client

import { Button } from "react-bootstrap";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

/* -------------------------------------------------
   Strong Types — No `any`
--------------------------------------------------- */

interface MCQChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_IN_BLANK";
  points: number;
  text: string;
  title: string;
  choices?: MCQChoice[];
  correctBoolean?: boolean;
  acceptableAnswers?: string[];
}

interface QuizMenuProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
}

/* -------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------- */

export default function QuizList() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const { quizzes } = useSelector(
    (state: RootState) => state.quizzesReducer
  );

  const currentUser = useSelector(
    (state: RootState) =>
      state.accountReducer.currentUser as { role?: string } | null
  );  

  const isFaculty = currentUser?.role === "FACULTY";

  /* ---------------------------
       Load quizzes (useCallback fixes ESLint)
  --------------------------- */
  const loadQuizzes = useCallback(async () => {
    const data: Quiz[] = await client.findQuizzesForCourse(cid as string);

// If student, load last attempt score
if (currentUser?.role === "STUDENT") {
  for (const quiz of data) {
    const attempt = await client.findMyLastAttempt(quiz._id);
    if (attempt) quiz.lastScore = attempt.score;
  }
}

dispatch(setQuizzes(data));

  }, [cid, dispatch]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  /* ---------------------------
       Add new quiz
  --------------------------- */
  const handleAddQuiz = async () => {
    const quiz: Quiz = await client.createQuizForCourse(cid as string);
    dispatch(addQuiz(quiz));
    router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`);
  };

  /* ---------------------------
       Publish / Unpublish
  --------------------------- */
  const togglePublish = async (quiz: Quiz) => {
    const updatedQuiz: Quiz = { ...quiz, published: !quiz.published };
    await client.updateQuiz(quiz._id, updatedQuiz);
    dispatch(updateQuizInStore(updatedQuiz));
  };

  /* ---------------------------
       Delete quiz
  --------------------------- */
  const handleDelete = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    dispatch(deleteQuizInStore(quizId));
  };

  /* ---------------------------
       EMPTY STATE
  --------------------------- */
  if (!quizzes.length) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Quizzes</h3>

        {isFaculty && (
          <>
            <p className="text-muted">(No quizzes yet)</p>
            <Button variant="danger" onClick={handleAddQuiz}>
              <FaPlus /> Quiz
            </Button>
          </>
        )}

        {!isFaculty && <p>No quizzes available.</p>}
      </div>
    );
  }

  /* ---------------------------
       MAIN RENDER
  --------------------------- */
  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quizzes</h3>

        {isFaculty && (
          <Button variant="danger" onClick={handleAddQuiz}>
            <FaPlus /> Quiz
          </Button>
        )}
      </div>

      <ul className="list-group">
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              {/* Quiz Title */}
              <div
                style={{ fontSize: "18px", fontWeight: 500, cursor: "pointer" }}
                onClick={() =>
                  router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)
                }
              >
                {quiz.title}
              </div>

              {/* Metadata */}
              <div className="text-muted" style={{ fontSize: "14px" }}>
  {quiz.published ? "Published" : "Unpublished"} 
  • {getAvailability(quiz)}
  • {quiz.points} pts 
  • {(quiz.questions || []).length} questions

  {/* Student score */}
  {!isFaculty && quiz.lastScore != null && (
    <> • Score: {quiz.lastScore} / {quiz.points}</>
  )}
</div>

            </div>

            {/* Faculty-only icons */}
            <div className="d-flex align-items-center">
              {/* Publish toggle */}
              {isFaculty && (
                <span
                  onClick={() => togglePublish(quiz)}
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    fontSize: "20px",
                  }}
                >
                  {quiz.published ? "✅" : "🚫"}
                </span>
              )}

              {/* Context menu */}
              {isFaculty && (
                <QuizMenu
                  quiz={quiz}
                  onEdit={() =>
                    router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`)
                  }
                  onDelete={() => handleDelete(quiz._id)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------
   Availability Helper
--------------------------- */
function getAvailability(quiz: Quiz): string {
  const now = new Date();
  const from = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
  const until = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

  if (from && now < from) {
    return `Not available until ${from.toLocaleDateString()}`;
  }
  if (until && now > until) {
    return "Closed";
  }
  return "Available";
}

/* ==========================================
   Quiz Menu Component (Edit/Delete)
========================================== */

function QuizMenu({ quiz, onEdit, onDelete }: QuizMenuProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="position-relative">
      <FaEllipsisV
        style={{ cursor: "pointer" }}
        onClick={() => setShow((prev) => !prev)}
      />

      {show && (
        <div
          className="position-absolute"
          style={{
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "6px",
            zIndex: 10,
          }}
        >
          <div
            className="dropdown-item"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShow(false);
              onEdit();
            }}
          >
            Edit
          </div>

          <div
            className="dropdown-item text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShow(false);
              onDelete();
            }}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
}