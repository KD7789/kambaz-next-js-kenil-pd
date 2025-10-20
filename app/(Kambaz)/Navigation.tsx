"use client"
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser, FaClipboardList } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/Dashboard", icon: LiaBookSolid },
    { label: "Calendar",  path: "https://northeastern.instructure.com/calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "https://northeastern.instructure.com/conversations",     icon: FaInbox },
    { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
  ];

 return (
   <ListGroup className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2" style={{ width: 110 }}
              id="wd-kambaz-navigation">
     <ListGroupItem className="bg-black border-0 text-center" as="a"
              target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
       <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
       <ListGroupItem as={Link} href="/Account"
        className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <FaRegCircleUser
          className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </ListGroupItem>
      {links.map((link) => (
        <ListGroupItem key={link.path} as={Link} href={link.path}
          className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-danger"})}
          <br />
          {link.label}
        </ListGroupItem>
      ))}

      </ListGroupItem><br />
    {/* <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
         <FaRegCircleUser className="fs-1 text-white" />
         <br />
         Account
       </Link>
     </ListGroupItem><br />
     <ListGroupItem className="border-0 bg-white text-center">
       <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
         <AiOutlineDashboard className="fs-1 text-danger" />
         <br />
         Dashboard
       </Link>
     </ListGroupItem><br />
     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Dashboard" id="wd-courses-link" className="text-danger text-decoration-none">
         <LiaBookSolid className="fs-1 text-danger" />
         <br />
         Courses
       </Link>
     </ListGroupItem><br />
     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="https://northeastern.instructure.com/calendar" id="wd-calendar-link" className="text-danger text-decoration-none">
         <IoCalendarOutline className="fs-1 text-danger" />
         <br />
         Calendar
       </Link>
     </ListGroupItem><br />
     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="https://northeastern.instructure.com/conversations" id="wd-inbox-link" className="text-danger text-decoration-none">
         <FaInbox className="fs-1 text-danger" />
         <br />
         Inbox
       </Link>
     </ListGroupItem><br />
     <ListGroupItem className="border-0 bg-black text-center">
       <Link href="/Labs" id="wd-labs-link" className="text-danger text-decoration-none">
         <LiaCogSolid className="fs-1 text-danger" />
         <br />
         Labs
       </Link>
     </ListGroupItem><br /> */}
   </ListGroup>
);}

