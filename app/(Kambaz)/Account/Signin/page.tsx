"use client";
import Link from "next/link";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";

interface Credentials {
  username: string;
  password: string;
}

interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: "USER" | "ADMIN" | "FACULTY" | "STUDENT" | "TA";
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const signin = () => {
    const users = db.users as User[];
    const user = users.find(
      (u) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };

  return (
    <div
      id="wd-signin-screen"
      style={{
        marginLeft: "30px",
        marginRight: "80px",
        marginTop: "10px", // ⬆️ moved slightly higher for alignment
        maxWidth: "400px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px 25px",
        backgroundColor: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="text-danger mb-4 text-center">Sign in</h2>

      <FormControl
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-3"
        placeholder="Username"
        id="wd-username"
      />

      <FormControl
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-3"
        placeholder="Password"
        type="password"
        id="wd-password"
      />

      <Button
        onClick={signin}
        id="wd-signin-btn"
        className="w-100 mb-3"
        variant="danger"
      >
        Sign in
      </Button>

      <div className="text-center">
        <Link
          id="wd-signup-link"
          href="/Account/Signup"
          style={{
            color: "#b30000",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
