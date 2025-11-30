"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import {
  setCourses,
  Course,
} from "../Courses/reducer";

import * as Client from "../Courses/client";

import {
  setEnrollments,
  addEnrollmentToStore,
  removeEnrollmentFromStore,
} from "../Enrollments/reducer";

import { useState, useEffect } from "react";
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

type User = { _id: string; username: string; role: string };

export default function Dashboard() {
  const dispatch = useDispatch();
  const { courses } = useSelector((s: RootState) => s.coursesReducer);
  const { enrollments } = useSelector((s: RootState) => s.enrollmentsReducer);
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);

  const typedUser = currentUser as User | null;
  const isFaculty = typedUser?.role === "FACULTY";

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

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
    image: "/images/Teslabot.jpg",
  });

  // ============================================================
  // LOAD COURSES + ENROLLMENTS
  // ============================================================
  const loadMyCourses = async () => {
    if (!typedUser) return;

    const myCourses =
      isFaculty
        ? await Client.fetchAllCourses()
        : await Client.findMyCourses();

    dispatch(setCourses(myCourses));
  };

  const loadAllTheCourses = async () => {
    const list = await Client.fetchAllCourses();
    setAllCourses(list);
  };

  const loadEnrollments = async () => {
    if (!typedUser) return;
  
    const courseList = await Client.fetchEnrollments(typedUser._id);
  
    // Convert Course[] to Enrollment[]
    const enrollmentList = courseList.map((c) => ({
      _id: `${typedUser._id}-${c._id}`,
      user: typedUser._id,
      course: c._id
    }));
  
    dispatch(setEnrollments(enrollmentList));
  };  

  useEffect(() => {
    if (!typedUser) return;
    loadMyCourses();
    loadAllTheCourses();
    loadEnrollments();
  }, [typedUser]);

  // ============================================================
  // ENROLL / UNENROLL
  // ============================================================
  // ============================================================
// ENROLL / UNENROLL
// ============================================================
const isEnrolled = (courseId: string) =>
  enrollments?.some?.((e) => e?.user && e?.course === courseId) ?? false;

const handleEnroll = async (courseId: string) => {
  if (!typedUser) return;

  await Client.enrollIntoCourse(typedUser._id, courseId);

  // Add to Redux manually
  dispatch(
    addEnrollmentToStore({
      _id: `${typedUser._id}-${courseId}`,
      user: typedUser._id,
      course: courseId,
    })
  );

  loadMyCourses();
};

const handleUnenroll = async (courseId: string) => {
  if (!typedUser) return;

  await Client.unenrollFromCourse(typedUser._id, courseId);

  // Remove from Redux store
  dispatch(removeEnrollmentFromStore(`${typedUser._id}-${courseId}`));

  // Reload my courses
  loadMyCourses();
};


  // ============================================================
  // FACULTY ACTIONS
  // ============================================================
  const onAddNewCourse = async () => {
    const newCourse = await Client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onUpdateCourse = async () => {
    await Client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => (c._id === course._id ? { ...course } : c))
      )
    );
  };

  const onDeleteCourse = async (cid: string) => {
    await Client.deleteCourse(cid);
    dispatch(setCourses(courses.filter((c) => c._id !== cid)));
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (!typedUser) {
    return (
      <div style={{ marginLeft: "30px" }}>
        <h1>Dashboard</h1>
        <hr />
        <p>Please sign in to view your courses.</p>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: "30px" }}>
      {/* ===============================================================
          FIXED CARD CSS (entire page styling)
      =============================================================== */}
      <style>{`
        .course-card {
          height: 360px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .course-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .course-description {
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 10px;
        }

        .course-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: auto;
        }
      `}</style>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h1>Dashboard</h1>

        {!isFaculty && (
          <Button
            variant="secondary"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses ? "Hide All Courses" : "Show All Courses"}
          </Button>
        )}
      </div>

      <hr />

      {/* ============================================================
          ALL COURSES (For Students)
      ============================================================ */}
      {!isFaculty && showAllCourses && (
        <>
          <h2>All Courses</h2>
          <hr />

          <Row xs={1} md={5} className="g-4">
            {allCourses.map((c) => (
              <Col key={c._id} style={{ width: "300px" }}>
                <Card className="course-card">
                  <CardImg src={c.img} height={160} />

                  <CardBody className="course-card-body">
                    <CardTitle>{c.name}</CardTitle>

                    <CardText className="course-description">
                      {c.description}
                    </CardText>

                    <div className="course-actions">
                      {!isEnrolled(c._id) ? (
                        <Button
                          variant="success"
                          onClick={() => handleEnroll(c._id)}
                        >
                          Enroll
                        </Button>
                      ) : (
                        <Button
                          variant="warning"
                          onClick={() => handleUnenroll(c._id)}
                        >
                          Unenroll
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          <hr />
        </>
      )}

      {/* ============================================================
          MY COURSES (Same layout as your original)
      ============================================================ */}
      <h2>My Courses ({courses.length})</h2>
      <hr />

      {/* ---------- FACULTY CREATE PANEL ---------- */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              onClick={onAddNewCourse}
            >
              Add
            </button>

            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
            >
              Update
            </button>
          </h5>

          <br />

          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) =>
              setCourse({ ...course, name: e.target.value })
            }
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

      {/* ---------- MY COURSES GRID ---------- */}
      <Row xs={1} md={5} className="g-4">
        {courses.map((c) => (
          <Col key={c._id} style={{ width: "300px" }}>
            <Card className="course-card">
              <CardImg src={c.img} height={160} />

              <CardBody className="course-card-body">
                <CardTitle>{c.name}</CardTitle>

                <CardText className="course-description">
                  {c.description}
                </CardText>

                <div className="course-actions">
                  <Link
                    href={`/Courses/${c._id}/Home`}
                    className="btn btn-primary"
                  >
                    Go
                  </Link>

                  {!isFaculty && (
                    <Button
                      variant="warning"
                      onClick={() => handleUnenroll(c._id)}
                    >
                      Unenroll
                    </Button>
                  )}

                  {isFaculty && (
                    <>
                      <Button variant="warning" onClick={() => setCourse(c)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => onDeleteCourse(c._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
