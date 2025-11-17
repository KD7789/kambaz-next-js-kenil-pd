import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  points: number;
  group: "ASSIGNMENTS" | "QUIZZES" | "EXAMS" | "PROJECTS";
  gradeDisplay: "Percentage" | "Points" | "Complete/Incomplete";
  submissionType: "Online" | "On Paper" | "External Tool";
  onlineEntryOptions: string[];
  assignTo: string;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  editing?: boolean;
}

interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: [], // server fills this
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // Load all assignments for a course
    setAssignments: (state, { payload }: PayloadAction<Assignment[]>) => {
      state.assignments = payload;
    },

    // Add new assignment returned from server
    addAssignmentInStore: (
      state,
      { payload }: PayloadAction<Assignment>
    ) => {
      state.assignments.push(payload);
    },

    // Remove from Redux after server deletion
    deleteAssignmentInStore: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.assignments = state.assignments.filter(
        (a) => a._id !== payload
      );
    },

    // Update in Redux after server PUT
    updateAssignmentInStore: (
      state,
      { payload }: PayloadAction<Assignment>
    ) => {
      state.assignments = state.assignments.map((a) =>
        a._id === payload._id ? { ...payload, editing: false } : a
      );
    },

    // Toggle editing state locally
    editAssignment: (state, { payload }: PayloadAction<string>) => {
      state.assignments = state.assignments.map((a) =>
        a._id === payload ? { ...a, editing: true } : a
      );
    },
  },
});

export const {
  setAssignments,
  addAssignmentInStore,
  deleteAssignmentInStore,
  updateAssignmentInStore,
  editAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
