"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";

import { setCurrentQuiz, updateQuizInStore } from "../../reducer";
import * as client from "../../../../client";
import { Button, Form } from "react-bootstrap";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";



import type { Quiz } from "../../reducer";

/* -----------------------------------------
   Component
--------------------------------------------*/
export default function QuizEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const dispatch = useDispatch();
  const router = useRouter();

  const storedQuiz = useSelector(
    (state: RootState) => state.quizzesReducer.currentQuiz
  );

  const [localQuiz, setLocalQuiz] = useState<Quiz | null>(null);

  /* -----------------------------------------
     Load quiz
  --------------------------------------------*/
  const loadQuiz = useCallback(async () => {
    const q: Quiz = await client.findQuizById(qid);
    dispatch(setCurrentQuiz(q));
    setLocalQuiz(q);
  }, [dispatch, qid]);

  useEffect(() => {
    if (storedQuiz) setLocalQuiz(storedQuiz);
    else loadQuiz();
  }, [storedQuiz, loadQuiz]);

  if (!localQuiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  /* -----------------------------------------
     Update field (typed)
  --------------------------------------------*/
  const updateField = <K extends keyof Quiz>(field: K, value: Quiz[K]) => {
    setLocalQuiz((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  function toDateInputValue(d: string | Date | null | undefined): string {
    if (!d) return "";
    try {
      return new Date(d).toISOString().split("T")[0];
    } catch {
      return "";
    }
  }  

  /* -----------------------------------------
     Save actions
  --------------------------------------------*/
  const saveOnly = async () => {
    await client.updateQuiz(qid, localQuiz);
    dispatch(updateQuizInStore(localQuiz));
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const saveAndPublish = async () => {
    const payload: Quiz = { ...localQuiz, published: true };
    await client.updateQuiz(qid, payload);
    dispatch(updateQuizInStore(payload));
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const cancel = () => router.push(`/Courses/${cid}/Quizzes`);
  const goToQuestions = () =>
    router.push(`/Courses/${cid}/Quizzes/${qid}/Questions`);

  /* -----------------------------------------
     Render
  --------------------------------------------*/
  return (
    <div style={{ padding: "20px" }}>
      <h3>Edit Quiz</h3>

      {/* TABS */}
      <div className="d-flex gap-3 mt-3 mb-4">
        <div style={{ fontWeight: 600 }}>Details</div>
        <div
          style={{ color: "#b30000", cursor: "pointer" }}
          onClick={goToQuestions}
        >
          Questions
        </div>
      </div>

      <Form style={{ maxWidth: "700px" }}>
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={localQuiz.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </Form.Group>

        {/* Description (WYSIWYG) */}
        {/* Description (WYSIWYG) */}
        <Form.Group className="mb-3">
  <Form.Label>Description</Form.Label>
  <SimpleMDE
    value={localQuiz.description || ""}
    onChange={(v) => updateField("description", v)}
    options={{
      spellChecker: false,
      placeholder: "Enter quiz description...",
    }}
  />
</Form.Group>



        {/* Points (readonly) */}
        <div className="mb-3">
          <strong>Total Points:</strong> {localQuiz.points}
        </div>

        {/* Quiz Type */}
        <Form.Group className="mb-3">
          <Form.Label>Quiz Type</Form.Label>
          <Form.Select
            value={localQuiz.quizType}
            onChange={(e) => updateField("quizType", e.target.value)}
          >
            <option value="GRADED_QUIZ">Graded Quiz</option>
            <option value="PRACTICE_QUIZ">Practice Quiz</option>
            <option value="GRADED_SURVEY">Graded Survey</option>
            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
          </Form.Select>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="mb-3">
          <Form.Label>Assignment Group</Form.Label>
          <Form.Select
            value={localQuiz.assignmentGroup}
            onChange={(e) => updateField("assignmentGroup", e.target.value)}
          >
            <option value="QUIZZES">Quizzes</option>
            <option value="EXAMS">Exams</option>
            <option value="ASSIGNMENTS">Assignments</option>
            <option value="PROJECT">Project</option>
          </Form.Select>
        </Form.Group>

        {/* Shuffle Answers (Missing earlier) */}
        <Form.Group className="mb-3">
          <Form.Label>Shuffle Answers</Form.Label>
          <Form.Select
            value={localQuiz.shuffleAnswers ? "YES" : "NO"}
            onChange={(e) =>
              updateField("shuffleAnswers", e.target.value === "YES")
            }
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </Form.Select>
        </Form.Group>

        {/* Time Limit */}
        <Form.Group className="mb-3">
          <Form.Label>Time Limit (minutes)</Form.Label>
          <Form.Control
            type="number"
            value={localQuiz.timeLimit}
            onChange={(e) =>
              updateField("timeLimit", Number(e.target.value))
            }
          />
        </Form.Group>

        {/* Multiple Attempts */}
        <Form.Group className="mb-3">
          <Form.Label>Multiple Attempts</Form.Label>
          <Form.Select
            value={localQuiz.multipleAttempts ? "YES" : "NO"}
            onChange={(e) =>
              updateField("multipleAttempts", e.target.value === "YES")
            }
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </Form.Select>

          {localQuiz.multipleAttempts && (
            <div className="mt-2">
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control
                type="number"
                value={localQuiz.howManyAttempts}
                onChange={(e) =>
                  updateField("howManyAttempts", Number(e.target.value))
                }
              />
            </div>
          )}
        </Form.Group>

        {/* Show Correct Answers */}
        <Form.Group className="mb-3">
          <Form.Label>Show Correct Answers</Form.Label>
          <Form.Control
            value={localQuiz.showCorrectAnswers}
            onChange={(e) =>
              updateField("showCorrectAnswers", e.target.value)
            }
          />
        </Form.Group>

        {/* Access Code */}
        <Form.Group className="mb-3">
          <Form.Label>Access Code</Form.Label>
          <Form.Control
            value={localQuiz.accessCode}
            onChange={(e) => updateField("accessCode", e.target.value)}
          />
        </Form.Group>

        {/* One Q at a Time */}
        <Form.Group className="mb-3">
          <Form.Label>One Question at a Time</Form.Label>
          <Form.Select
            value={localQuiz.oneQuestionAtATime ? "YES" : "NO"}
            onChange={(e) =>
              updateField("oneQuestionAtATime", e.target.value === "YES")
            }
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </Form.Select>
        </Form.Group>

        {/* Webcam Required */}
        <Form.Group className="mb-3">
          <Form.Label>Webcam Required</Form.Label>
          <Form.Select
            value={localQuiz.webcamRequired ? "YES" : "NO"}
            onChange={(e) =>
              updateField("webcamRequired", e.target.value === "YES")
            }
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </Form.Select>
        </Form.Group>

        {/* Lock Questions */}
        <Form.Group className="mb-3">
          <Form.Label>Lock Questions After Answering</Form.Label>
          <Form.Select
            value={localQuiz.lockQuestionsAfterAnswering ? "YES" : "NO"}
            onChange={(e) =>
              updateField(
                "lockQuestionsAfterAnswering",
                e.target.value === "YES"
              )
            }
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </Form.Select>
        </Form.Group>

        {/* Dates */}
        <Form.Group className="mb-3">
          <Form.Label>Available From</Form.Label>
          <Form.Control
  type="date"
  value={toDateInputValue(localQuiz.availableFrom)}
  onChange={(e) => updateField("availableFrom", e.target.value)}
/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Available Until</Form.Label>
          <Form.Control
  type="date"
  value={toDateInputValue(localQuiz.availableUntil)}
  onChange={(e) => updateField("availableUntil", e.target.value)}
/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
  type="date"
  value={toDateInputValue(localQuiz.dueDate)}
  onChange={(e) => updateField("dueDate", e.target.value)}
/>
        </Form.Group>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <Button variant="danger" onClick={saveOnly}>
            Save
          </Button>

          <Button variant="success" onClick={saveAndPublish}>
            Save & Publish
          </Button>

          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
