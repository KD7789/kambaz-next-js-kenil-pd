"use client";
import * as client from "./client";
import { useEffect, useState, useCallback, ReactNode } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  // Wrap fetchProfile with useCallback to fix missing dependency warning
  const fetchProfile = useCallback(async () => {
    try {
      const currentUser = await client.profile();
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
      }
    } catch (err) {
      console.error("Session load error:", err);
    }
    setPending(false);
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (pending) return null;
  return children;
}
