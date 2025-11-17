"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  updateAssignmentInStore,
  setAssignments,
} from "../reducer";

import type { Assignment } from "../reducer";   // ← ADD THIS


import * as client from "../../../client";

import { useEffect, useState, ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  const { aid, cid } = useParams<{ aid: string; cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  const existingAssignment = assignments.find((a) => a._id === aid);

  const [assignment, setAssignment] = useState<Assignment>(
    existingAssignment || {
      _id: "",
      title: "",
      description: "",
      course: cid!,
      points: 100,
      group: "ASSIGNMENTS",
      gradeDisplay: "Percentage",
      submissionType: "Online",
      onlineEntryOptions: ["Text Entry"],
      assignTo: "Everyone",
      dueDate: "",
      availableFrom: "",
      availableUntil: "",
    }
  );

  useEffect(() => {
    if (existingAssignment) setAssignment(existingAssignment);
  }, [existingAssignment]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setAssignment((prev) => ({
      ...prev,
      [id.replace("wd-", "")]: value,
    }));
  };

  /** SAVE: Create or Update */
  const handleSave = async () => {
    if (existingAssignment) {
      const updated = await client.updateAssignment(assignment) as Assignment;
      dispatch(updateAssignmentInStore(updated));
    } else {
      const created = await client.createAssignmentForCourse(cid!, assignment) as Assignment;
      dispatch(setAssignments([...assignments, created]));
    }

    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        {/* Name */}
        <Form.Group className="mb-4" controlId="wd-title">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control
            type="text"
            value={assignment.title}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Label className="fw-semibold">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            value={assignment.description}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Points */}
        <Row className="mb-4">
          <Col md={3}>
            <Form.Group controlId="wd-points" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">Points</Form.Label>
              <Form.Control
                type="number"
                value={assignment.points}
                style={{ width: "300px" }}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Group */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-group" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">
                Assignment Group
              </Form.Label>
              <Form.Select
                value={assignment.group}
                style={{ width: "300px" }}
                onChange={handleChange}
              >
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECTS">PROJECTS</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Grade display */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-gradeDisplay" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">
                Display Grade as
              </Form.Label>
              <Form.Select
                value={assignment.gradeDisplay}
                style={{ width: "300px" }}
                onChange={handleChange}
              >
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Complete/Incomplete">
                  Complete/Incomplete
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Submission Type */}
        <div className="d-flex align-items-start mb-4">
          <Form.Label className="fw-semibold mb-0 me-2">Submission Type</Form.Label>
          <div className="border p-3 rounded mb-4">
            <Form.Group
              controlId="wd-submissionType"
              className="d-flex align-items-center mb-3"
            >
              <Form.Select
                value={assignment.submissionType}
                style={{ width: "300px" }}
                onChange={handleChange}
              >
                <option value="Online">Online</option>
                <option value="On Paper">On Paper</option>
                <option value="External Tool">External Tool</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="wd-onlineEntryOptions">
              <Form.Label className="fw-semibold mb-2">Online Entry Options</Form.Label>
              <div className="ms-3">
                <Form.Check type="checkbox" label="Text Entry" />
                <Form.Check type="checkbox" label="Website URL" />
                <Form.Check type="checkbox" label="Media Recordings" />
                <Form.Check type="checkbox" label="Student Annotation" />
                <Form.Check type="checkbox" label="File Uploads" />
              </div>
            </Form.Group>
          </div>
        </div>

        {/* Assign / Dates */}
        <div className="d-flex align-items-start mb-4">
          <Form.Label className="fw-semibold mb-0 me-2">Assign</Form.Label>
          <div className="border p-3 rounded mb-4">
            <Form.Group className="mb-4" controlId="wd-assignTo">
              <Form.Label className="fw-semibold">Assign to</Form.Label>
              <Form.Control
                type="text"
                value={assignment.assignTo}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Form.Group controlId="wd-dueDate">
                <Form.Label className="fw-semibold">Due</Form.Label>
                <Form.Control
                  type="date"
                  value={assignment.dueDate?.slice(0, 10) || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Col md={4}>
                <Form.Group
                  controlId="wd-availableFrom"
                  style={{ marginBlockStart: "30px" }}
                >
                  <Form.Label className="fw-semibold">Available from</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignment.availableFrom?.slice(0, 10) || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  controlId="wd-availableUntil"
                  style={{ marginBlockStart: "30px" }}
                >
                  <Form.Label className="fw-semibold">Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={assignment.availableUntil?.slice(0, 10) || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <div className="text-end mt-4">
          <Button variant="secondary" onClick={handleCancel} className="me-2 px-4">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSave} className="px-4">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
