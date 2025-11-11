"use client";
import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";
import { useState, ChangeEvent } from "react";
import { redirect } from "next/dist/client/components/navigation";
import * as db from "../../Database";

interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: "USER" | "ADMIN" | "FACULTY" | "STUDENT" | "TA";
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}

interface UserInput {
  username: string;
  password: string;
}

export default function Signup() {
  const [user, setUser] = useState<UserInput>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id.replace("wd-", "")]: value }));
  };

  const handleSignup = () => {
    const users = db.users as User[];

    if (users.some((u) => u.username === user.username)) {
      alert("Username already exists! Try a different one.");
      return;
    }

    const newUser: User = {
      _id: Date.now().toString(),
      username: user.username,
      password: user.password,
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      role: "USER",
      loginId: "00" + Math.floor(100000000 + Math.random() * 900000000) + "S",
      section: "S101",
      lastActivity: new Date().toISOString().split("T")[0],
      totalActivity: "00:00:00",
    };

    users.push(newUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(users));
    }

    alert("Signup successful!");
    redirect("/Account/Signin");
  };

  return (
    <div
      id="wd-signup-screen"
      style={{
        marginLeft: "30px",
        marginRight: "80px",
        marginTop: "10px", // ⬆️ slightly more up
        maxWidth: "400px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px 25px",
        backgroundColor: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="text-danger mb-4 text-center">Sign up</h2>

      <FormControl
        id="wd-username"
        placeholder="Username"
        className="mb-3"
        value={user.username}
        onChange={handleChange}
      />

      <FormControl
        id="wd-password"
        placeholder="Password"
        type="password"
        className="mb-3"
        value={user.password}
        onChange={handleChange}
      />

      <Button
        id="wd-signup-btn"
        className="w-100 mb-3"
        variant="danger"
        onClick={handleSignup}
      >
        Sign up
      </Button>

      <div className="text-center">
        <Link
          id="wd-signin-link"
          href="/Account/Signin"
          style={{
            color: "#b30000",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}




/* "use client";
import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";
import { useState, ChangeEvent } from "react";
import { redirect } from "next/dist/client/components/navigation";
import * as db from "../../Database";

// ✅ Define User and UserInput types for safe typing
interface User {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: "USER" | "ADMIN" | "FACULTY" | "STUDENT" | "TA";
  loginId: string;
  section: string;
  lastActivity: string;
  totalActivity: string;
}

interface UserInput {
  username: string;
  password: string;
}

export default function Signup() {
  // ✅ Use proper type instead of `any`
  const [user, setUser] = useState<UserInput>({
    username: "",
    password: "",
  });

  // ✅ Event typing
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id.replace("wd-", "")]: value }));
  };

  const handleSignup = () => {
    const users = db.users as User[];

    // ✅ Prevent duplicate usernames with typed user
    if (users.some((u) => u.username === user.username)) {
      alert("Username already exists! Try a different one.");
      return;
    }

    // ✅ Create new user safely
    const newUser: User = {
      _id: Date.now().toString(),
      username: user.username,
      password: user.password,
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      role: "USER",
      loginId: "00" + Math.floor(100000000 + Math.random() * 900000000) + "S",
      section: "S101",
      lastActivity: new Date().toISOString().split("T")[0],
      totalActivity: "00:00:00",
    };

    users.push(newUser);

    // ✅ Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(users));
    }

    alert("Signup successful!");
    redirect("/Account/Signin");
  };

  return (
    <div id="wd-signup-screen" style={{ marginLeft: "30px" }}>
      <h3>Sign up</h3>

      <FormControl
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={user.username}
        onChange={handleChange}
      />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={user.password}
        onChange={handleChange}
      />

      <Button
        id="wd-signup-btn"
        className="btn btn-primary w-100 mb-2"
        onClick={handleSignup}
      >
        Sign up
      </Button>

      <Link id="wd-signin-link" href="/Account/Signin">
        Sign in
      </Link>
    </div>
  );
}
 */