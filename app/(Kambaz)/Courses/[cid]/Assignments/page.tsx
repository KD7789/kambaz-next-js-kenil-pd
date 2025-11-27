"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import {
  setAssignments,
  deleteAssignmentInStore,
} from "./reducer";
import * as client from "../../client";
import {
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaEllipsisV, FaTrash } from "react-icons/fa";
import Link from "next/link";
import LessonControlButtons from "../Modules/LessonControlButtons";
import React from "react";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  points: number;
  group: string;
  gradeDisplay: string;
  submissionType: string;
  onlineEntryOptions: string[];
  assignTo: string;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  description: string;
}

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  // NEW → role check
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const user = currentUser as { role?: string } | null;
  const isFaculty = user?.role === "FACULTY";

  /** Load from server */
  const loadAssignments = async () => {
    const list = await client.findAssignmentsForCourse(cid!);
    dispatch(setAssignments(list));
  };

  React.useEffect(() => {
    loadAssignments();
  }, [cid]);

  const courseAssignments = assignments.filter((a) => a.course === cid);

  /** Delete assignment */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    await client.deleteAssignment(id);
    dispatch(deleteAssignmentInStore(id));
  };

  return (
    <div id="wd-assignments" className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="form-control w-50"
          id="wd-search-assignment"
        />

        {/* NEW → faculty-only buttons */}
        {isFaculty && (
          <div>
            <Button
              variant="danger"
              size="lg"
              id="wd-add-assignment"
              onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
            >
              <FaPlus className="me-2" /> Assignment
            </Button>

            <Button
              variant="secondary"
              size="lg"
              id="wd-add-assignment-group"
              className="ms-3"
            >
              <FaPlus className="me-2" /> Group
            </Button>
          </div>
        )}
      </div>

      {/* Assignment Groups */}
      <ListGroup className="rounded-0" id="wd-assignment-groups">
        <ListGroupItem className="wd-assignment-group p-0 mb-5 fs-5 border-gray">
          <div className="d-flex justify-content-between align-items-center border p-3 bg-light">
            <div className="d-flex align-items-center">
              <FaEllipsisV className="me-2 text-secondary" />
              <h5 className="mb-0 fw-bold">ASSIGNMENTS</h5>
            </div>

            <div className="d-flex align-items-center">
              <span
                className="badge bg-gray text-dark border me-3"
                style={{
                  borderRadius: "999px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                }}
              >
                40% of Total
              </span>

              {/* NEW → faculty-only */}
              {isFaculty && (
                <>
                  <Button variant="light" className="border me-2">
                    <FaPlus />
                  </Button>
                  <FaEllipsisV className="fs-5 text-secondary" />
                </>
              )}
            </div>
          </div>

          {/* ASSIGNMENT LIST */}
          <ListGroup className="wd-assignments rounded-0">
            {courseAssignments.map((assignment: Assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="wd-assignment p-3 ps-2 d-flex justify-content-between align-items-center"
              >
                {/* LEFT INFO */}
                <div>
                  <BsGripVertical className="me-2 fs-3" />

                  {/* NEW → faculty can click, students cannot */}
                  {isFaculty ? (
                    <Link
                      href={`/Courses/${cid}/Assignments/${assignment._id}`}
                      className="fw-bold text-black text-decoration-none"
                    >
                      {assignment.title}
                    </Link>
                  ) : (
                    <span className="fw-bold text-black">{assignment.title}</span>
                  )}

                  <p className="mb-0 text-muted small mt-2">
                    <span className="fw-bold text-danger">Multiple Modules</span>

                    {assignment.availableFrom && (
                      <>
                        {" | "}
                        <span className="fw-bold">Not available until</span>{" "}
                        {new Date(assignment.availableFrom).toLocaleDateString()} at 12:00 AM
                      </>
                    )}

                    {assignment.dueDate && (
                      <>
                        {" | "}
                        <span className="fw-bold">Due</span>{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()} at 11:59 PM
                      </>
                    )}

                    {assignment.points && ` | ${assignment.points} pts`}
                  </p>
                </div>

                {/* RIGHT BUTTONS → faculty only */}
                {isFaculty && (
                  <div className="d-flex align-items-center gap-2">
                    <LessonControlButtons />

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
