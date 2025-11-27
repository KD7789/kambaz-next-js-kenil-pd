"use client";

import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "../[cid]/Breadcrumb";
import * as coursesClient from "../client";

interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  img: string;
  author?: string;
}

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cid } = useParams<{ cid: string }>();

  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);

  const [showNav, setShowNav] = useState(true);

  const course = courses.find((c: Course) => c._id === cid);

  // 🔥 Load courses on refresh so layout can validate the course
  useEffect(() => {
    const loadCourses = async () => {
      if (courses.length === 0) {
        const allCourses = await coursesClient.fetchAllCourses();
        dispatch({ type: "courses/setCourses", payload: allCourses });
      }
    };
    loadCourses();
  }, [courses.length, dispatch]);

  // Load enrollments on refresh
  useEffect(() => {
    const loadEnrollments = async () => {
      if (!currentUser) return;
  
      const user = currentUser as { _id: string };   // 👈 minimal TS fix
      const allEnrollments = await coursesClient.fetchEnrollments(user._id);
  
      dispatch({ type: "enrollments/setEnrollments", payload: allEnrollments });
    };
  
    if (currentUser && enrollments.length === 0) {
      loadEnrollments();
    }
  }, [currentUser, enrollments.length, dispatch]);  

  // 🔥 Load user? (optional, because AccountReducer may already handle it)

  const loading =
  courses.length === 0 ||
  !currentUser ||
  enrollments.length === 0;

  // 🔥 Redirect logic AFTER data loads
  useEffect(() => {
    if (loading) return; // WAIT for Redux to hydrate

    if (!cid || !course) {
      router.push("/Dashboard");
      return;
    }

    const user = currentUser as { _id: string; role: string };

    const isFaculty = user.role === "FACULTY" || user.role === "ADMIN";
    const isEnrolled = enrollments.some(
      (e) => e.user === user._id && e.course === cid
    );

    if (isFaculty) return;

    if (!isEnrolled) {
      alert("You are not enrolled in this course.");
      router.push("/Dashboard");
    }
  }, [cid, course, currentUser, enrollments, loading, router]);

  // 🔥 Show loading until we know the course exists
  if (loading) {
    return <div>Loading course...</div>;
  }

  return (
    <div id="wd-courses" style={{ padding: "20px" }}>
      <div className="d-flex align-items-center mb-2">
        <FaAlignJustify
          className="me-3 fs-4"
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => setShowNav(!showNav)}
        />
        <h5 className="m-0 text-muted">
          <Breadcrumb course={course} />
        </h5>
      </div>

      <hr />

      <div className="d-flex">
        {showNav && (
          <div>
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
