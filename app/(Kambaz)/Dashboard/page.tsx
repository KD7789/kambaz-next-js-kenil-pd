"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  Course,
} from "../Courses/reducer";
import {
  enroll,
  unenroll,
  Enrollment, // ✅ from your new Enrollments reducer
} from "../Enrollments/reducer";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

type User = {
  _id: string;
  username: string;
  role: string;
};

const eq = (a: string | number, b: string | number) => String(a) === String(b);

export default function Dashboard() {
  const dispatch = useDispatch();

  const { courses } = useSelector((s: RootState) => s.coursesReducer);
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const { enrollments } = useSelector((s: RootState) => s.enrollmentsReducer);

  const [showAllCourses, setShowAllCourses] = useState(false);

  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "NEW-000",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    department: "General",
    credits: 3,
    description: "New Description",
    img: "/images/Teslabot.jpg",
  });

  const typedUser = currentUser as User | null;
  const isFaculty = typedUser?.role === "FACULTY";

  // ✅ Helper: check if a user is enrolled in a course
  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e) => eq(e.user, typedUser?._id ?? "") && eq(e.course, courseId)
    );

  // ✅ Toggle enrollment
  const toggleEnrollment = (courseId: string) => {
    if (!typedUser) return;
    const enrolled = isEnrolled(courseId);
    if (enrolled) {
      dispatch(unenroll({ user: typedUser._id, course: courseId }));
    } else {
      dispatch(enroll({ user: typedUser._id, course: courseId }));
    }
  };

  // ✅ Filter visible courses
  const filteredCourses = useMemo(() => {
    if (!typedUser) return [];

    // Faculty always sees all
    if (isFaculty) return courses;

    // If showing all
    if (showAllCourses) return courses;

    // Else, only enrolled ones
    return courses.filter((c) =>
      enrollments.some(
        (e) => eq(e.user, typedUser._id) && eq(e.course, c._id)
      )
    );
  }, [courses, enrollments, showAllCourses, typedUser, isFaculty]);

  // ✅ Redirect message if not logged in
  if (!typedUser) {
    return (
      <div id="wd-dashboard" style={{ marginLeft: "30px" }}>
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <hr />
        <p className="text-muted">Please sign in to view your enrolled courses.</p>
      </div>
    );
  }

  return (
    <div id="wd-dashboard" style={{ marginLeft: "30px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>

        {/* ✅ Blue toggle button */}
        <Button
          variant="primary"
          id="wd-toggle-enrollments"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show My Courses" : "Show All Courses"}
        </Button>
      </div>
      <hr />

      {/* ✅ Faculty-only add/update controls */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => {
                const { _id, ...courseData } = course;
                dispatch(addNewCourse(courseData));
              }}
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={() => dispatch(updateCourse(course))}
            >
              Update
            </button>
          </h5>

          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "My Courses"} (
        {filteredCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((c) => {
            const enrolled = isEnrolled(c._id);

            return (
              <Col
                key={c._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <CardImg
                    src={c.img ?? "/images/default-course.jpg"}
                    alt={c.name}
                    width="100%"
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {c.description}
                    </CardText>

                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        href={`/Courses/${c._id}/Home`}
                        className="btn btn-primary wd-dashboard-course-link"
                      >
                        Go
                      </Link>

                      {/* Faculty-only controls */}
                      {isFaculty && (
                        <>
                          <Button
                            variant="warning"
                            id="wd-edit-course-click"
                            onClick={() => setCourse(c)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            id="wd-delete-course-click"
                            onClick={() => dispatch(deleteCourse(c._id))}
                          >
                            Delete
                          </Button>
                        </>
                      )}

                      {/* Student/TA Enroll/Unenroll */}
                      {!isFaculty && (
                        <Button
                          variant={enrolled ? "danger" : "success"}
                          id={`wd-${enrolled ? "unenroll" : "enroll"}-click`}
                          onClick={() => toggleEnrollment(c._id)}
                        >
                          {enrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
