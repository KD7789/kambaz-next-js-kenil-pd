"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  cid: string;
};

const links = [
  { label: "Home", internal: true },
  { label: "Modules", internal: true},
  { label: "Piazza", internal: false, url: "https://piazza.com/class/mf9tt3f8vlw16f" },
  { label: "Zoom", internal: false, url: "https://www.zoom.com/" },
  { label: "Assignments", internal: true },
  { label: "Quizzes", internal: false, url: "https://northeastern.instructure.com/courses/225988/quizzes" },
  { label: "Grades", internal: false, url: "https://northeastern.instructure.com/courses/225988/grades" },
  { label: "People", internal: true, customPath: "People" },
];

export default function CourseNavigation({ cid }: Props) {
  const pathname = usePathname();

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map(({ label, internal, url, customPath }) => {
       
        const href = internal
          ? `/Courses/${cid}/${customPath || label}`
          : url!;

        const isActive =
          internal && pathname.includes(`/${cid}/${customPath || label}`);

        return internal ? (
          <Link
            key={label}
            href={href}
            id={`wd-course-${label.toLowerCase()}-link`}
            className={`list-group-item border-0 ${
              isActive ? "active" : "text-danger"
            }`}
          >
            {label}
          </Link>
        ) : (
          <a
            key={label}
            href={href}
            id={`wd-course-${label.toLowerCase()}-link`}
            className="list-group-item text-danger border-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}


/* import Link from "next/link";
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

 */