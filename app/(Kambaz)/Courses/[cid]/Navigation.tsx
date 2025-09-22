import Link from "next/link";
import React from "react";
export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation">
      <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link">Home</Link><br/>
      <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link">Modules
        </Link><br/>
      <Link href="https://piazza.com/class/mf9tt3f8vlw16f" id="wd-course-piazza-link">Piazza</Link><br/>
      <Link href="https://www.zoom.com/" id="wd-course-zoom-link">Zoom</Link><br/>
      <Link href="/Courses/{cid}/Assignments" id="wd-course-assignments-link">
          Assignments</Link><br/>
      <Link href="https://northeastern.instructure.com/courses/225988/quizzes" id="wd-course-quizzes-link">Quizzes
        </Link><br/>
      <Link href="https://northeastern.instructure.com/courses/225988/grades" id="wd-course-grades-link">Grades</Link><br/>
      <Link href={`/Courses/${cid}/People/Table`} id="wd-course-people-link">People</Link><br/>
    </div>
  );}

