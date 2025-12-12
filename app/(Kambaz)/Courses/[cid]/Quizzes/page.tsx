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

import * as client from "../../client";
import { Button } from "react-bootstrap";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

interface QuizMenuProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: (quiz: Quiz) => void;
  onSort: () => void;
  onTogglePublish: (quiz: Quiz) => void;
}

export default function QuizList() {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);

  const currentUser = useSelector(
    (state: RootState) =>
      state.accountReducer.currentUser as { role?: string } | null
  );

  const isFaculty = currentUser?.role === "FACULTY";
  const [sortMethod, setSortMethod] =
    useState<"NAME" | "DUE" | "AVAILABLE" | null>(null);

  const loadQuizzes = useCallback(async () => {
    const data: Quiz[] = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(data));
  }, [cid, dispatch]);

  useEffect(() => {
    const load = async () => {
      const data: Quiz[] = await client.findQuizzesForCourse(cid as string);
  
      if (currentUser?.role === "STUDENT") {
        for (const quiz of data) {
          const attempt = await client.findMyLastAttempt(quiz._id);
          if (attempt) quiz.lastScore = attempt.score;
        }
      }
  
      dispatch(setQuizzes(data)); 
    };
  
    load();
  }, [cid, currentUser?.role, dispatch]);  

  const handleAddQuiz = async () => {
    const quiz: Quiz = await client.createQuizForCourse(cid as string);
    dispatch(addQuiz(quiz));
    router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`);
  };

  const togglePublish = async (quiz: Quiz) => {
    const updatedQuiz: Quiz = { ...quiz, published: !quiz.published };
    await client.updateQuiz(quiz._id, updatedQuiz);
    dispatch(updateQuizInStore(updatedQuiz));
  };

  const handleDelete = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    dispatch(deleteQuizInStore(quizId));
  };

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

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    if (!sortMethod) return 0;
    if (sortMethod === "NAME") return a.title.localeCompare(b.title);
    if (sortMethod === "DUE")
      return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
    if (sortMethod === "AVAILABLE")
      return new Date(a.availableFrom || 0).getTime() -
             new Date(b.availableFrom || 0).getTime();
    return 0;
  });

  const handleCopyQuiz = async (quiz: Quiz) => {
    const newQuiz = await client.copyQuiz(quiz._id); 
    dispatch(addQuiz(newQuiz));
  };

  const handleSort = () => {
    const choice = prompt("Sort by: name | due | available?");
    if (!choice) return;

    if (choice === "name") setSortMethod("NAME");
    else if (choice === "due") setSortMethod("DUE");
    else if (choice === "available") setSortMethod("AVAILABLE");
  };

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
        {sortedQuizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <div
                style={{ fontSize: "18px", fontWeight: 500, cursor: "pointer" }}
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)}
              >
                {quiz.title}
              </div>

              <div className="text-muted" style={{ fontSize: "14px" }}>
  {quiz.published ? "Published" : "Unpublished"} •{" "}
  {getAvailability(quiz)} •{" "}

  {quiz.dueDate ? (
    <>Due: {new Date(quiz.dueDate).toLocaleDateString()} • </>
  ) : (
    <>No due date • </>
  )}

  {quiz.points} pts • {(quiz.questions || []).length} questions

  {!isFaculty && quiz.lastScore != null && (
    <> • Score: {quiz.lastScore} / {quiz.points}</>
  )}
  </div>
</div> 


            <div className="d-flex align-items-center">
              {isFaculty && (
                <span
                  onClick={() => togglePublish(quiz)}
                  style={{ cursor: "pointer", marginRight: "10px", fontSize: "20px" }}
                >
                  {quiz.published ? "✅" : "🚫"}
                </span>
              )}

              {isFaculty && (
                <QuizMenu
                  quiz={quiz}
                  onEdit={() =>
                    router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`)
                  }
                  onDelete={() => handleDelete(quiz._id)}
                  onCopy={() => handleCopyQuiz(quiz)}
                  onSort={handleSort}
                  onTogglePublish={() => togglePublish(quiz)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getAvailability(quiz: Quiz): string {
  const now = new Date();
  const from = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
  const until = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

  if (from && now < from) return `Not available until ${from.toLocaleDateString()}`;
  if (until && now > until) return "Closed";
  return "Available";
}

function QuizMenu({
  quiz,
  onEdit,
  onDelete,
  onCopy,
  onSort,
  onTogglePublish,
}: QuizMenuProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="position-relative">
      <FaEllipsisV
        onClick={() => setShow((prev) => !prev)}
        style={{ cursor: "pointer" }}
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
          <div className="dropdown-item" onClick={() => { setShow(false); onEdit(); }}>
            Edit
          </div>

          <div className="dropdown-item" onClick={() => { setShow(false); onTogglePublish(quiz); }}>
            {quiz.published ? "Unpublish" : "Publish"}
          </div>

          <div
            className="dropdown-item text-danger"
            onClick={() => { setShow(false); onDelete(); }}
          >
            Delete
          </div>

          <div className="dropdown-item" onClick={() => { setShow(false); onCopy(quiz); }}>
            Copy
          </div>

          <div className="dropdown-item" onClick={() => { setShow(false); onSort(); }}>
            Sort
          </div>
        </div>
      )}
    </div>
  );
}
