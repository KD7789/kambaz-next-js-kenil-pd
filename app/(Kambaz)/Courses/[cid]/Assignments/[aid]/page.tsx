"use client";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import * as db from "../../../../Database";
import { Form, Button, Row, Col } from "react-bootstrap";
import Link from "next/link";

export default function AssignmentEditor() {
  const { aid, cid } = useParams();
  const assignment = useMemo(
    () => db.assignments.find((a: any) => a._id === aid),
    [aid]
  );

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-4" controlId="wd-name">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control type="text" defaultValue={assignment?.title || ""} />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Label className="fw-semibold">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            defaultValue={assignment?.description || ""}
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={3}>
            <Form.Group controlId="wd-points" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">Points</Form.Label>
              <Form.Control
                type="number"
                defaultValue={assignment?.points || 100}
                style={{ width: "300px" }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-group" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">Assignment Group</Form.Label>
              <Form.Select defaultValue={assignment?.group || "ASSIGNMENTS"} style={{ width: "300px" }}>
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>PROJECTS</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="wd-display-grade-as" className="d-flex align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">Display Grade as</Form.Label>
              <Form.Select defaultValue="Percentage" style={{ width: "300px" }}>
                <option>Percentage</option>
                <option>Points</option>
                <option>Complete/Incomplete</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex align-items-start mb-4">
          <Form.Label className="fw-semibold mb-0 me-2">Submission Type</Form.Label>
          <div className="border p-3 rounded mb-4">
            <Form.Group controlId="wd-submission-type" className="d-flex align-items-center mb-3">
              <Form.Select defaultValue="Online" style={{ width: "300px" }}>
                <option>Online</option>
                <option>On Paper</option>
                <option>External Tool</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="wd-online-entry">
              <Form.Label className="fw-semibold mb-2" style={{ minWidth: '140px', display: 'inline-block' }}>
                Online Entry Options
              </Form.Label>
              <div className="ms-3">
                <Form.Check type="checkbox" label="Text Entry" />
                <Form.Check type="checkbox" label="Website URL" defaultChecked />
                <Form.Check type="checkbox" label="Media Recordings" />
                <Form.Check type="checkbox" label="Student Annotation" />
                <Form.Check type="checkbox" label="File Uploads" />
              </div>
            </Form.Group>
          </div>
        </div>

        <div className="d-flex align-items-start mb-4">
          <Form.Label className="fw-semibold mb-0 me-2">Assign</Form.Label>
          <div className="border p-3 rounded mb-4">
            <Form.Group className="mb-4" controlId="wd-assign-to">
              <Form.Label className="fw-semibold">Assign to</Form.Label>
              <Form.Control type="text" defaultValue="Everyone" />
            </Form.Group>

            <Row className="mb-0">
              <Form.Group controlId="wd-due-date">
                <Form.Label className="fw-semibold">Due</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={assignment?.dueDate?.slice(0, 10) || "2024-05-13"}
                />
              </Form.Group>

              <Col md={4}>
                <Form.Group controlId="wd-available-from" style={{ marginBlockStart: "30px" }}>
                  <Form.Label className="fw-semibold">Available from</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={assignment?.availableFrom?.slice(0, 10) || "2024-05-06"}
                    style={{ width: "130px" }}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="wd-available-until" style={{ marginBlockStart: "30px" }}>
                  <Form.Label className="fw-semibold">Until</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={assignment?.availableUntil?.slice(0, 10) || "2024-05-20"}
                    style={{ width: "130px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <div className="text-end mt-4">
          <Link href={`/Courses/${cid}/Assignments`} passHref>
            <Button variant="secondary" className="me-2 px-4">
              Cancel
            </Button>
          </Link>
          <Link href={`/Courses/${cid}/Assignments`} passHref>
            <Button variant="danger" className="px-4">
              Save
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
}

/* "use client";
import { Form, Button, Row, Col} from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
       
        <Form.Group className="mb-4" controlId="wd-name">
          <Form.Label className="fw-semibold">Assignment Name</Form.Label>
          <Form.Control type="text" defaultValue="A1" />
        </Form.Group>

        
        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Label className="fw-semibold">Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            defaultValue={`The assignment is available online.

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:
• Your full name and section
• Links to each of the lab assignments
• Link to the Kanbas application
• Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
          />
        </Form.Group>

      
        <Row className="mb-4">
  <Col md={3}>
    <Form.Group controlId="wd-points" className="d-flex align-items-center">
      <Form.Label className="fw-semibold mb-0 me-2">Points</Form.Label>
      <Form.Control type="number" defaultValue={100} style={{ width: '300px' }} />
    </Form.Group>
  </Col>
</Row>

       
        <Row className="mb-4">
  <Col md={4}>
    <Form.Group controlId="wd-group" className="d-flex align-items-center">
      <Form.Label className="fw-semibold mb-0 me-2">Assignment Group</Form.Label>
      <Form.Select defaultValue="ASSIGNMENTS" style={{ width: '300px' }}>
        <option>ASSIGNMENTS</option>
        <option>QUIZZES</option>
        <option>EXAMS</option>
        <option>PROJECTS</option>
      </Form.Select>
    </Form.Group>
  </Col>
</Row>

        
        <Row className="mb-4">
  <Col md={4}>
    <Form.Group controlId="wd-display-grade-as" className="d-flex align-items-center">
      <Form.Label className="fw-semibold mb-0 me-2">Display Grade as</Form.Label>
      <Form.Select defaultValue="Percentage" style={{ width: '300px' }}>
        <option>Percentage</option>
        <option>Points</option>
        <option>Complete/Incomplete</option>
      </Form.Select>
    </Form.Group>
  </Col>
</Row>

<div className="d-flex align-items-start mb-4">
<Form.Label className="fw-semibold mb-0 me-2">Submission Type</Form.Label>
<div className="border p-3 rounded mb-4">
 
  <Form.Group controlId="wd-submission-type" className="d-flex align-items-center mb-3">
    <Form.Select defaultValue="Online" style={{ width: '300px' }}>
      <option>Online</option>
      <option>On Paper</option>
      <option>External Tool</option>
    </Form.Select>
  </Form.Group>


  <Form.Group controlId="wd-online-entry">
    <Form.Label className="fw-semibold mb-2" style={{ minWidth: '140px', display: 'inline-block' }}>
      Online Entry Options
    </Form.Label>
    <div className="ms-3">
      <Form.Check type="checkbox" label="Text Entry" />
      <Form.Check type="checkbox" label="Website URL" defaultChecked />
      <Form.Check type="checkbox" label="Media Recordings" />
      <Form.Check type="checkbox" label="Student Annotation" />
      <Form.Check type="checkbox" label="File Uploads" />
    </div>
  </Form.Group>
</div>
</div>

<div className="d-flex align-items-start mb-4">
    <Form.Label className="fw-semibold mb-0 me-2">Assign</Form.Label>
        <div className="border p-3 rounded mb-4">
          
 
  <Form.Group className="mb-4" controlId="wd-assign-to">
    <Form.Label className="fw-semibold">Assign to</Form.Label>
    <Form.Control type="text" defaultValue="Everyone" />
  </Form.Group>


  <Row className="mb-0">
    
      <Form.Group controlId="wd-due-date">
        <Form.Label className="fw-semibold">Due</Form.Label>
        <Form.Control type="date" defaultValue="2024-05-13" />
      </Form.Group>
    
    <Col md={4}>
      <Form.Group controlId="wd-available-from" style={{marginBlockStart: "30px"}}>
        <Form.Label className="fw-semibold">Available from</Form.Label>
        <Form.Control type="date" defaultValue="2024-05-06" style={{width: "130px"}}/>
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group controlId="wd-available-until" style={{marginBlockStart: "30px"}}>
        <Form.Label className="fw-semibold">Until</Form.Label>
        <Form.Control type="date" defaultValue="2024-05-20" style={{width: "130px"}}/>
      </Form.Group>
    </Col>
  </Row>
</div>
</div>

       
        <div className="text-end mt-4">
          <Button variant="secondary" className="me-2 px-4">
            Cancel
          </Button>
          <Button variant="danger" className="px-4">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
} */