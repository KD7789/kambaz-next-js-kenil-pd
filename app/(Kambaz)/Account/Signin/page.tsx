"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { useState } from "react";
import * as client from "../client";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);

      if (!user || !user._id) {
        alert("Invalid username or password");
        return;
      }

      dispatch(setCurrentUser(user));
      router.push("/Dashboard");   
    } catch (e) {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      id="wd-signin-screen"
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