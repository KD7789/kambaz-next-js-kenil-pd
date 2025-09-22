import Link from "next/link";
import React from "react";
export default function KambazNavigation() {
  return (
    <div id="wd-kambaz-navigation">
      <a href="https://www.northeastern.edu/" id="wd-neu-link" target="_blank">Northeastern</a><br/>
      <Link href="/Account" id="wd-account-link">Account</Link><br/>
      <Link href="/Dashboard" id="wd-dashboard-link">Dashboard</Link><br/>
      <Link href="/Dashboard" id="wd-course-link">Courses</Link><br/>
      <Link href="/Calendar" id="wd-calendar-link">Calendar</Link><br/>
      <Link href="/Inbox" id="wd-inbox-link">Inbox</Link><br/>
      <Link href="/Labs" id="wd-labs-link">Labs</Link><br/>
      <Link href="/Labs/Lab1" id="wd-lab1-link">Lab Exercises</Link>
    </div>
);}

