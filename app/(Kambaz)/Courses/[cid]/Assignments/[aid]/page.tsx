"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  updateAssignmentInStore,
  setAssignments,
  type Assignment,
} from "../reducer";

import * as client from "../../../client";

import { useEffect, useState, ChangeEvent } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function AssignmentEditor() {
  const { aid, cid } = useParams<{ aid: string; cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  // "new" → create mode, anything else → edit mode
  const isNew = aid === "new";

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );

  // Only try to find an existing assignment when we're not in "new" mode
  const existingAssignment = !isNew
    ? assignments.find((a) => a._id === aid)
    : undefined;

  /** Default assignment template */
  const [assignment, setAssignment] = useState<Assignment>(
    existingAssignment || {
      _id: isNew ? "" : (aid ?? ""),
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

  /** When opened directly (refresh / deep link), fetch assignment from server */
  useEffect(() => {
    const load = async () => {
      if (isNew) return;
      if (!aid) return; // critical guard
  
      // fetch only if not found in Redux
      if (!existingAssignment) {
        const fetched = await client.findAssignmentById(aid);
        setAssignment(fetched);
      }
    };
    load();
  }, [aid, isNew, existingAssignment]);  

  /** Format date for <input type="date"> */
  const normalizeDate = (d?: string | Date) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  /** Generic change handler for text/select/textarea */
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setAssignment((prev) => ({
      ...prev,
      [id.replace("wd-", "")]: value,
    }));
  };

  /** Checkbox handler for onlineEntryOptions[] */
  const handleEntryOptionChange = (option: string) => {
    setAssignment((prev) => {
      const hasOption = prev.onlineEntryOptions.includes(option);
      return {
        ...prev,
        onlineEntryOptions: hasOption
          ? prev.onlineEntryOptions.filter((o) => o !== option)
          : [...prev.onlineEntryOptions, option],
      };
    });
  };

  /** SAVE (create or update) */
  const handleSave = async () => {
    if (!isNew) {
      // EDIT / UPDATE existing assignment
      const updated = await client.updateAssignment(assignment);
      dispatch(updateAssignmentInStore(updated));
    } else {
      // CREATE new assignment
      const { _id, ...newData } = assignment; // let Mongo / server decide _id
      const created = await client.createAssignmentForCourse(cid!, newData);
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
        {/* Assignment Name */}
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
            <Form.Group controlId="wd-points">
              <Form.Label className="fw-semibold mb-0 me-2">Points</Form.Label>
              <Form.Control
                type="number"
                value={assignment.points}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Assignment Group */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-group">
              <Form.Label className="fw-semibold">Assignment Group</Form.Label>
              <Form.Select
                value={assignment.group}
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

        {/* Grade Display */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-gradeDisplay">
              <Form.Label className="fw-semibold">
                Display Grade as
              </Form.Label>
              <Form.Select
                value={assignment.gradeDisplay}
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

        {/* Submission Type + Entry Options */}
        <div className="mb-4">
          <Form.Label className="fw-semibold me-3">
            Submission Type
          </Form.Label>

          <div className="border rounded p-3 mt-2">
            <Form.Group controlId="wd-submissionType" className="mb-3">
              <Form.Select
                value={assignment.submissionType}
                onChange={handleChange}
                style={{ width: "300px" }}
              >
                <option value="Online">Online</option>
                <option value="On Paper">On Paper</option>
                <option value="External Tool">External Tool</option>
              </Form.Select>
            </Form.Group>

            {/* Online Entry Options */}
            {assignment.submissionType === "Online" && (
              <div>
                <Form.Label className="fw-semibold mb-2">
                  Online Entry Options
                </Form.Label>
                <div className="ms-3">
                  {[
                    "Text Entry",
                    "Website URL",
                    "Media Recordings",
                    "Student Annotation",
                    "File Uploads",
                  ].map((opt) => (
                    <Form.Check
                      key={opt}
                      type="checkbox"
                      label={opt}
                      checked={assignment.onlineEntryOptions.includes(opt)}
                      onChange={() => handleEntryOptionChange(opt)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assign To + Dates */}
        <div className="mb-4">
          <Form.Label className="fw-semibold">Assign</Form.Label>

          <div className="border rounded p-3 mt-2">
            <Form.Group className="mb-4" controlId="wd-assignTo">
              <Form.Label className="fw-semibold">Assign to</Form.Label>
              <Form.Control
                type="text"
                value={assignment.assignTo}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Dates */}
            <Row>
              <Form.Group controlId="wd-dueDate">
                <Form.Label className="fw-semibold">Due</Form.Label>
                <Form.Control
                  type="date"
                  value={normalizeDate(assignment.dueDate)}
                  onChange={handleChange}
                />
              </Form.Group>

              <Col md={4}>
                <Form.Group controlId="wd-availableFrom" className="mt-4">
                  <Form.Label className="fw-semibold">
                    Available from
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={normalizeDate(assignment.availableFrom)}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="wd-availableUntil" className="mt-4">
                  <Form.Label className="fw-semibold">Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={normalizeDate(assignment.availableUntil)}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        {/* Save / Cancel */}
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
