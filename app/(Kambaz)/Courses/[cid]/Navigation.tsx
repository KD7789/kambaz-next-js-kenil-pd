import Link from "next/link";
import React from "react";
export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link"
      className="list-group-item active border-0">Home</Link>
      <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link"
      className="list-group-item text-danger border-0">Modules</Link>
      <Link href="https://piazza.com/class/mf9tt3f8vlw16f" id="wd-course-piazza-link"
      className="list-group-item text-danger border-0">Piazza</Link>
      <Link href="https://www.zoom.com/" id="wd-course-zoom-link"
      className="list-group-item text-danger border-0">Zoom</Link>
      <Link href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link"
      className="list-group-item text-danger border-0">Assignments</Link>
      <Link href="https://northeastern.instructure.com/courses/225988/quizzes" id="wd-course-quizzes-link"
      className="list-group-item text-danger border-0">Quizzes</Link>
      <Link href="https://northeastern.instructure.com/courses/225988/grades" id="wd-course-grades-link"
      className="list-group-item text-danger border-0">Grades</Link>
      <Link href={`/Courses/${cid}/People/Table`} id="wd-course-people-link"
      className="list-group-item text-danger border-0">People</Link>
    </div>
  );}

