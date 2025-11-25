"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaEllipsisV, FaTrash } from "react-icons/fa";
import Link from "next/link";
import LessonControlButtons from "../Modules/LessonControlButtons";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  points: number;
  group: "ASSIGNMENTS" | "QUIZZES" | "EXAMS" | "PROJECTS";
  gradeDisplay: "Percentage" | "Points" | "Complete/Incomplete";
  submissionType: "Online" | "On Paper" | "External Tool";
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

  // ⭐ Role Access
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const editableRoles = ["FACULTY", "TA", "ADMIN"];
  const canEdit = editableRoles.includes(currentUser?.role ?? "");

  const courseAssignments: Assignment[] = assignments.filter(
    (a: Assignment) => a.course === cid
  );

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    if (confirm("Are you sure you want to delete this assignment?")) {
      dispatch(deleteAssignment(id));
    }
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

        {/* ⭐ Show Add buttons only if allowed */}
        {canEdit && (
          <div>
            <Button
              variant="danger"
              size="lg"
              className="me-1 float-end"
              id="wd-add-assignment"
              onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
            >
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Assignment
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="me-1 float-end"
              id="wd-add-assignment-group"
            >
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Group
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

              {/* ⭐ Only faculty/TA/admin can add items inside group */}
              {canEdit && (
                <Button variant="light" className="border me-2">
                  <FaPlus />
                </Button>
              )}

              <FaEllipsisV className="fs-5 text-secondary" />
            </div>
          </div>

          {/* Assignment List */}
          <ListGroup className="wd-assignments rounded-0">
            {courseAssignments.map((assignment: Assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="wd-assignment p-3 ps-2 d-flex justify-content-between align-items-center"
              >
                {/* LEFT: Assignment Info */}
                <div>
                  <BsGripVertical className="me-2 fs-3" />

                  {/* ⭐ Students can open details, but cannot edit */}
                  <Link
                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                    className="wd-assignment-link fw-bold text-black text-decoration-none"
                  >
                    {assignment.title}
                  </Link>

                  <p className="mb-0 text-muted small mt-2">
                    <span className="fw-bold text-danger">Multiple Modules</span>

                    {assignment.availableFrom && (
                      <>
                        {" | "}
                        <span className="fw-bold">Not available until</span>{" "}
                        {new Date(assignment.availableFrom).toLocaleDateString()}
                        <span> at 12:00 AM</span>
                      </>
                    )}

                    {assignment.dueDate && (
                      <>
                        {" | "}
                        <span className="fw-bold">Due</span>{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                        <span> at 11:59 PM</span>
                      </>
                    )}

                    {assignment.points && ` | ${assignment.points} pts`}
                  </p>
                </div>

                {/* ⭐ RIGHT-SIDE CONTROLS — Visible only for faculty/TA/admin */}
                {canEdit && (
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
