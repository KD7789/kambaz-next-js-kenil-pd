import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
import React from "react";

export default function Profile() {
  return (
    <div
      id="wd-profile-screen"
      style={{
        width: "300px",
        marginLeft: "30px", 
      }}
    >
      <h3>Profile</h3>

      <FormControl
        defaultValue="alice"
        placeholder="username"
        className="mb-2"
      />
      <FormControl
        defaultValue="123"
        placeholder="password"
        type="password"
        className="mb-2"
      />
      <FormControl
        defaultValue="Alice"
        placeholder="First Name"
        className="mb-2"
      />
      <FormControl
        defaultValue="Wonderland"
        placeholder="Last Name"
        className="mb-2"
      />
      <FormControl
        defaultValue="2000-01-01"
        type="date"
        className="mb-2"
      />
      <FormControl
        defaultValue="alice@wonderland.com"
        type="email"
        className="mb-2"
      />

      <FormSelect defaultValue="FACULTY" className="mb-2">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormSelect>

      <Link
        href="/Account/Signin"
        className="btn w-100 mb-2"
        style={{
          backgroundColor: "#d9534f", 
          color: "white",
        }}
      >
        Signout
      </Link>
    </div>
  );
}
