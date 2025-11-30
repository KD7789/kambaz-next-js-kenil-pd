"use client";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../Details";
import Link from "next/link";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: Array<Record<string, unknown>>;
  fetchUsers?: () => Promise<void>;   // ✅ MADE OPTIONAL
}) {

  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);

  return (
    <div id="wd-people-table" style={{ marginLeft: "30px", marginRight: "30px" }}>

      {/* USER DETAILS POPUP */}
      {showDetails && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            if (fetchUsers) fetchUsers();     // ✅ SAFE CALL
          }}
        />
      )}

      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: Record<string, unknown>) => (
            <tr key={user._id as string}>
              <td className="wd-full-name text-nowrap">
                <span
                  className="text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowDetails(true);
                    setShowUserId(user._id as string);
                  }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName as string}</span>{" "}
                  <span className="wd-last-name">{user.lastName as string}</span>
                </span>
              </td>

              <td>{user.loginId as string}</td>
              <td>{user.section as string}</td>
              <td>{user.role as string}</td>
              <td>{user.lastActivity as string}</td>
              <td>{user.totalActivity as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}


/* "use client";
import React from "react";
import { useParams } from "next/navigation";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import * as db from "../../../../Database";

type User = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
};

type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

export default function PeopleTable() {
  const { cid } = useParams();
  const users: User[] = db.users;
  const enrollments: Enrollment[] = db.enrollments;

  const enrolledUserIds = enrollments
    .filter((enroll) => enroll.course === cid)
    .map((enroll) => enroll.user);

  const enrolledUsers = users.filter((user) =>
    enrolledUserIds.includes(user._id)
  );

  return (
    <div id="wd-people-table" style={{ marginLeft: "30px", marginRight: "30px" }}>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} */






/* "use client";
import React from "react";
import { useParams } from "next/navigation";
import * as db from "../../../../Database";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleTable() {
   const { cid } = useParams();
  const { users, enrollments } = db;

 return (
  <div id="wd-people-table" style={{marginLeft: "30px", marginRight: "30px"}}>
   <Table striped>
    <thead>
     <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
    </thead>
    <tbody>
  {users
    .filter((usr) =>
      enrollments.some((enrollment) => enrollment.user === usr._id && enrollment.course === cid)
    )
    .map((user: any) => (
      <tr key={user._id}>
        <td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">{user.firstName}</span>
          <span className="wd-last-name">{user.lastName}</span>
        </td>
        <td className="wd-login-id">{user.loginId}</td>
        <td className="wd-section">{user.section}</td>
        <td className="wd-role">{user.role}</td>
        <td className="wd-last-activity">{user.lastActivity}</td>
        <td className="wd-total-activity">{user.totalActivity}</td>
      </tr>
    ))}
</tbody>


   </Table>
  </div> );} */












/* import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
 return (
  <div id="wd-people-table" style={{marginLeft: "30px", marginRight: "30px"}}>
   <Table striped>
    <thead>
     <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
    </thead>
    <tbody>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Tony</span>{" "}
          <span className="wd-last-name">Stark</span></td>
      <td className="wd-login-id">001234561S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2020-10-01</td>
      <td className="wd-total-activity">10:21:32</td></tr>
    </tbody>
    <tbody>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Bruce</span>{" "}
          <span className="wd-last-name">Wayne</span></td>
      <td className="wd-login-id">001234789S</td>
      <td className="wd-section">S102</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2020-10-02</td>
      <td className="wd-total-activity">09:21:42</td></tr>
    </tbody>
    <tbody>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Natasha</span>{" "}
          <span className="wd-last-name">Romanoff</span></td>
      <td className="wd-login-id">001234123S</td>
      <td className="wd-section">S111</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2020-08-01</td>
      <td className="wd-total-activity">10:53:32</td></tr>
    </tbody>
   </Table>
  </div> );}

 */