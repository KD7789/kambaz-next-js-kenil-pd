import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

interface EnrollmentState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentState = {
  enrollments: [], // Loaded from server
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // Load list from server
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },

    // Add single enrollment (from server)
    addEnrollmentToStore: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments.push(action.payload);
    },

    // Remove enrollment by ID (server returns that ID)
    removeEnrollmentFromStore: (state, action: PayloadAction<string>) => {
      state.enrollments = state.enrollments.filter(
        (e) => e._id !== action.payload
      );
    },
  },
});

export const {
  setEnrollments,
  addEnrollmentToStore,
  removeEnrollmentFromStore,
} = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;
