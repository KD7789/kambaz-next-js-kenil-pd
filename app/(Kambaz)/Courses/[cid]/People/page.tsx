"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import * as coursesClient from "../../client";
import PeopleTable from "../People/Table/page";

export default function CoursePeoplePage() {
  const { cid } = useParams<{ cid: string }>();

  // FIX 1: remove "any"
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  // FIX 2: wrap loadUsers in useCallback
  const loadUsers = useCallback(async () => {
    try {
      if (!cid) return;
      const enrolledUsers = await coursesClient.findUsersForCourse(cid);
      setUsers(enrolledUsers);
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loading) return <div>Loading enrolled users...</div>;

  return (
    <div className="p-3">
      <h2>People Enrolled in this Course</h2>
      <PeopleTable users={users} />
    </div>
  );
}
