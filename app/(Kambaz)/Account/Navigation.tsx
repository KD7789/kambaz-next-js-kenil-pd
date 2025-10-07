import Link from "next/link";
import React from "react";
export default function AccountNavigation() {
 return (
   <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
     <Link href="Signin" id="wd-signin-screen"
      className="list-group-item active border-0">Signin</Link>
      <Link href="Signup" id="wd-signup-screen"
      className="list-group-item text-danger border-0">Signup</Link>
      <Link href="Profile" id="wd-profile-screen"
      className="list-group-item text-danger border-0">Profile</Link>
    </div>
);}

