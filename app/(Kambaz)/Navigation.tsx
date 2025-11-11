"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// ✅ Explicit link type
interface NavLink {
  label: string;
  path: string;
  icon: React.ElementType;
  external: boolean;
}

export default function KambazNavigation() {
  const pathname = usePathname();
  const [clicked, setClicked] = useState<string>("");

  const links: NavLink[] = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard, external: false },
    { label: "Courses", path: "/Dashboard", icon: LiaBookSolid, external: false },
    { label: "Calendar", path: "https://northeastern.instructure.com/calendar", icon: IoCalendarOutline, external: true },
    { label: "Inbox", path: "https://northeastern.instructure.com/conversations", icon: FaInbox, external: true },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid, external: false },
  ];

  const isActive = (label: string, path: string) => {
    if (label === "Dashboard") {
      return pathname.startsWith("/Dashboard") && clicked !== "Courses";
    }
    if (label === "Courses") {
      return pathname.startsWith("/Dashboard") && clicked === "Courses";
    }
    return !path.startsWith("http") && pathname.startsWith(path);
  };

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 110 }}
      id="wd-kambaz-navigation"
    >
      {/* ✅ NEU logo with Next/Image */}
      <ListGroupItem className="bg-black border-0 text-center">
        <a
          id="wd-neu-link"
          href="https://www.northeastern.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="d-inline-block"
        >
          <Image
            src="/images/NEU.png"
            width={75}
            height={75}
            alt="Northeastern University"
            priority
          />
        </a>
      </ListGroupItem>

      {/* Account */}
      <ListGroupItem
        as={Link}
        href="/Account"
        className={`text-center border-0 ${
          isActive("Account", "/Account") ? "bg-white text-danger" : "bg-black text-white"
        }`}
      >
        <FaRegCircleUser className="fs-1 text-danger" />
        <br />
        Account
      </ListGroupItem>

      {/* Main navigation */}
      {links.map((link) => {
        const active = isActive(link.label, link.path);
        const commonClass = `text-center border-0 ${
          active ? "bg-white text-danger" : "bg-black text-white"
        }`;

        // ✅ Use proper tag type based on `external`
        if (link.external) {
          return (
            <ListGroupItem
              key={link.label}
              as="a"
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              className={commonClass}
              onClick={() => setClicked(link.label)}
            >
              <link.icon className="fs-1 text-danger" />
              <br />
              {link.label}
            </ListGroupItem>
          );
        }

        return (
          <ListGroupItem
            key={link.label}
            as={Link}
            href={link.path}
            className={commonClass}
            aria-current={active ? "page" : undefined}
            onClick={() => setClicked(link.label)}
          >
            <link.icon className="fs-1 text-danger" />
            <br />
            {link.label}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
