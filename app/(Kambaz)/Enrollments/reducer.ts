import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import * as db from "../Database";

// ✅ Enrollment type
export type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

// ✅ Initial state — uses db data as session default
const initialState: { enrollments: Enrollment[] } = {
  enrollments: (db.enrollments ?? []) as Enrollment[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;
      const exists = state.enrollments.some(
        (e) => e.user === user && e.course === course
      );
      if (!exists) {
        const newEnrollment: Enrollment = { _id: uuidv4(), user, course };
        state.enrollments.push(newEnrollment);
      }
    },

    unenroll: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === user && e.course === course)
      );
    },

    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enroll, unenroll, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
