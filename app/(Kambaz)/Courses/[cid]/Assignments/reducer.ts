import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assignments } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

// ✅ Define Assignment type consistent with your JSON and components
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
}

// ✅ Define slice state type
interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: assignments as Assignment[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload }: PayloadAction<Partial<Assignment>>) => {
      const assignment = payload;
      const newAssignment: Assignment = {
        _id: uuidv4(),
        title: assignment.title || "New Assignment",
        description: assignment.description || "",
        course: assignment.course || "",
        points: assignment.points ?? 100,
        group: assignment.group ?? "ASSIGNMENTS",
        gradeDisplay: assignment.gradeDisplay ?? "Percentage",
        submissionType: assignment.submissionType ?? "Online",
        onlineEntryOptions: assignment.onlineEntryOptions ?? ["Text Entry"],
        assignTo: assignment.assignTo ?? "Everyone",
        dueDate: assignment.dueDate ?? new Date().toISOString(),
        availableFrom: assignment.availableFrom ?? new Date().toISOString(),
        availableUntil: assignment.availableUntil ?? new Date().toISOString(),
      };
      state.assignments.push(newAssignment);
    },

    deleteAssignment: (state, { payload }: PayloadAction<string>) => {
      // ✅ Type-safe filter
      state.assignments = state.assignments.filter(
        (a: Assignment) => a._id !== payload
      );
    },

    updateAssignment: (state, { payload }: PayloadAction<Assignment>) => {
      // ✅ Type-safe map
      state.assignments = state.assignments.map((a: Assignment) =>
        a._id === payload._id ? payload : a
      );
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment } =
  assignmentsSlice.actions;

export default assignmentsSlice.reducer;
