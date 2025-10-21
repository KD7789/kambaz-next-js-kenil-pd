import type { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";

export default async function CoursesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;  // Await the params Promise here
  const course = courses.find((course) => course._id === cid);

  return (
    <div id="wd-courses">
      <h2 className="text-danger d-flex align-items-center gap-3">
        <FaAlignJustify className="fs-4 mb-1" />
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}


/* import type { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { cid: string };
}) {
  const { cid } = params;
  const course = courses.find((course) => course._id === cid);

  return (
    <div id="wd-courses">
      <h2 className="text-danger d-flex align-items-center gap-3">
        <FaAlignJustify className="fs-4 mb-1" />
        <Breadcrumb course={course} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
} */

/* import type { ReactNode } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../Database";

export default async function CoursesLayout(
  { children, params }: { children: ReactNode; params: Promise<{ cid: string }>; }) {
 const { cid } = await params;
 const course = courses.find((course) => course._id === cid);
 return (
   <div id="wd-courses">
     <h2 className="text-danger">
      <FaAlignJustify className="me-4 fs-4 mb-1" />
      {course?.name} </h2> <hr />
  <div className="d-flex">
    <div className="d-none d-md-block">
      < CourseNavigation cid={cid} />
    </div>
    <div className="flex-fill">
      {children}
    </div>
    </div>
</div>

);}

 */