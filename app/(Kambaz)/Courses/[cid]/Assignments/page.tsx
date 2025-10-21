"use client";
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import LessonControlButtons from "../Modules/LessonControlButtons";

export default function Assignments() {
  type Assignment = {
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
  };

  const { cid } = useParams();
  const courseAssignments = (db.assignments as Assignment[]).filter(
    (a) => a.course === cid
  );
  
  /* const { cid } = useParams();
  const courseAssignments = db.assignments.filter(
    (a: any) => a.course === cid
  ); */

  return (
    <div id="wd-assignments" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="form-control w-50"
          id="wd-search-assignment"
        />
        <div>
          <Button
            variant="danger"
            size="lg"
            className="me-1 float-end"
            id="wd-add-assignment"
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
      </div>

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
                style={{ borderRadius: "999px", padding: "8px 16px", fontSize: "0.85rem" }}
              >
                40% of Total
              </span>
              <Button variant="light" className="border me-2">
                <FaPlus />
              </Button>
              <FaEllipsisV className="fs-5 text-secondary" />
            </div>
          </div>

          <ListGroup className="wd-assignments rounded-0">
            {courseAssignments.map((assignment: Assignment) => (
              <ListGroupItem key={assignment._id} className="wd-assignment p-3 ps-2">
                <BsGripVertical className="me-2 fs-3" />

                <Link
                  href={`/Courses/${cid}/Assignments/${assignment._id}`}
                  className="wd-assignment-link fw-bold text-black text-decoration-none"
                >
                  {assignment.title}
                </Link>

                <LessonControlButtons />

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


              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}


/* import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FaPlus, FaEllipsisV, FaSearch } from "react-icons/fa";
import LessonControlButtons from "../Modules/LessonControlButtons";

export default function Assignments() {
  return (
    <div id="wd-assignments" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="form-control w-50"
          id="wd-search-assignment"
        />
        <div>
          <Button
            variant="danger"
            size="lg"
            className="me-1 float-end"
            id="wd-add-assignment"
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
      </div>

      <ListGroup className="rounded-0" id="wd-assignment-groups">
        <ListGroupItem className="wd-assignment-group p-0 mb-5 fs-5 border-gray">
          <div className="d-flex justify-content-between align-items-center border p-3 bg-light">
            <div className="d-flex align-items-center">
              <FaEllipsisV className="me-2 text-secondary" />
              <h5 className="mb-0 fw-bold">ASSIGNMENTS</h5>
            </div>

            <div className="d-flex align-items-center">
              <span
                className="badge bg-white text-dark border me-3"
                style={{ borderRadius: "999px", padding: "8px 16px", fontSize: "0.85rem" }}
              >
                40% of Total
              </span>
              <Button variant="light" className="border me-2">
                <FaPlus />
              </Button>
              <FaEllipsisV className="fs-5 text-secondary" />
            </div>
          </div>

          <ListGroup className="wd-assignments rounded-0">
            <ListGroupItem className="wd-assignment p-3 ps-2">
              <BsGripVertical className="me-2 fs-3" />
             
                <Link
                  href="/Courses/1234/Assignments/123"
                  className="wd-assignment-link fw-bold text-black text-decoration-none"
                >
                  A1 
                </Link>
              
              <LessonControlButtons />
              <p className="mb-0 text-muted small mt-2">
                <span className="fw-bold text-danger">Multiple Modules</span> | Not
                available until May 6 at 12am | Due May 15 at 11:59pm | 100 pts
              </p>
            </ListGroupItem>

            <ListGroupItem className="wd-assignment p-3 ps-2">
              <BsGripVertical className="me-2 fs-3" />
              
                <Link
                  href="/Courses/1234/Assignments/124"
                  className="wd-assignment-link fw-bold text-black text-decoration-none"
                >
                  A2 
                </Link>
              
              <LessonControlButtons />
              <p className="mb-0 text-muted small mt-2">
                <span className="fw-bold text-danger">Multiple Modules</span> | Not
                available until May 13 at 12am | Due May 20 at 11:59pm | 100 pts
              </p>
            </ListGroupItem>

            <ListGroupItem className="wd-assignment p-3 ps-2">
              <BsGripVertical className="me-2 fs-3" />
              
                <Link
                  href="/Courses/1234/Assignments/125"
                  className="wd-assignment-link fw-bold text-black text-decoration-none"
                >
                  A3 
                </Link>
              
              <LessonControlButtons />
              <p className="mb-0 text-muted small mt-2">
                <span className="fw-bold text-danger">Multiple Modules</span> | Not
                available until May 20 at 12am | Due May 27 at 11:59pm | 100 pts
              </p>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
  */