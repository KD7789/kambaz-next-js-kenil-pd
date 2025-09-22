import Link from "next/link";
import Image from "next/image";
import React from "react";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
      <div className="wd-dashboard-course1">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/Course-1.png" width={200} height={150} alt={""} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course2">
          <Link href="/Courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/Course-2.png" width={200} height={150} alt={""} />
            <div>
              <h5> CS5678 Node JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course3">
          <Link href="/Courses/9101" className="wd-dashboard-course-link">
            <Image src="/images/Course-3.png" width={200} height={150} alt={""}/>
            <div>
              <h5> CS9101 Mongo DB </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course4">
          <Link href="/Courses/1213" className="wd-dashboard-course-link">
            <Image src="/images/Course-4.png" width={200} height={150} alt={""} />
            <div>
              <h5> CS1213 Express JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course5">
          <Link href="/Courses/1415" className="wd-dashboard-course-link">
            <Image src="/images/Course-5.png" width={200} height={150} alt={""} />
            <div>
              <h5> CS1415 Python </h5>
              <p className="wd-dashboard-course-title">
                Programming Languages
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course6">
          <Link href="/Courses/1617" className="wd-dashboard-course-link">
            <Image src="/images/Course-6.jpeg" width={200} height={150} alt={""} />
            <div>
              <h5> CS1617 Java </h5>
              <p className="wd-dashboard-course-title">
                Programming Languages
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course7">
          <Link href="/Courses/1819" className="wd-dashboard-course-link">
            <Image src="/images/Course-7.jpeg" width={200} height={150} alt={""} />
            <div>
              <h5> CS1819 R </h5>
              <p className="wd-dashboard-course-title">
                Programming Languages
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> ... </div>
        <div className="wd-dashboard-course"> ... </div>
      </div>
    </div>
);}

