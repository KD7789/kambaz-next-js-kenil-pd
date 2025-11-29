"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const pathname = usePathname();

  return (
    <Nav
      className="p-3"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "white",
      }}
    >

      {/* default links (profile / signin / signup) */}
      {links.map((link) => {
        const isActive = pathname.endsWith(link.toLowerCase());
        return (
          <Link
            key={link}
            href={`/Account/${link}`}
            id={`wd-${link.toLowerCase()}-link`}
            style={{
              backgroundColor: isActive ? "#b30000" : "#dc3545",
              color: "white",
              borderRadius: "6px",
              width: "120px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "16px",
              transition: "background-color 0.2s ease",
            }}
          >
            {link}
          </Link>
        );
      })}

      {/* professor's ADMIN → Users link */}
      {currentUser && (currentUser as Record<string, unknown>).role
 === "ADMIN" && (
        <Link
          href="/Account/Users"
          id="wd-users-link"
          style={{
            backgroundColor: pathname.endsWith("users")
              ? "#b30000"
              : "#dc3545",
            color: "white",
            borderRadius: "6px",
            width: "120px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "16px",
            transition: "background-color 0.2s ease",
          }}
        >
          Users
        </Link>
      )}

    </Nav>
  );
}
