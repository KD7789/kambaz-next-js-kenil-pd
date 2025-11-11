"use client";

import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "../[cid]/Breadcrumb"; // ✅ Import

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
  const { cid } = useParams<{ cid: string }>();

  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);

  const [showNav, setShowNav] = useState(true);

  const course: Course | undefined = courses.find((c: Course) => c._id === cid);

  useEffect(() => {
    if (!cid || !course) {
      router.push("/Dashboard");
      return;
    }

    if (!currentUser) {
      alert("Please sign in to access courses.");
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
  }, [cid, currentUser, enrollments, course, router]);

  return (
    <div id="wd-courses" style={{ padding: "20px" }}>
      {/* ✅ Combined Title + Breadcrumb in one clean line */}
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
