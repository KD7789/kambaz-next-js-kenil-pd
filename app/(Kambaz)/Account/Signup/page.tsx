"use client";
import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id.replace("wd-", "")]: value }));
  };

  const handleSignup = async () => {
    try {
      const newUser = await client.signup(user);

      // Success
      dispatch(setCurrentUser(newUser));
      router.push("/Account/Profile");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Signup failed!";
      setError(message);
      alert(message);
    }
  };

  return (
    <div
      id="wd-signup-screen"
      style={{
        marginLeft: "30px",
        marginRight: "80px",
        marginTop: "10px",
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