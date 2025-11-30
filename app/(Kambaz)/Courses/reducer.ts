import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type Course = {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  description: string;
  img: string;
  image: string,
};

interface CoursesState {
  courses: Course[];
}

const initialState: CoursesState = {
  courses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addNewCourse: (state, { payload }: PayloadAction<Omit<Course, "_id">>) => {
      const newCourse: Course = { ...payload, _id: uuidv4() };
      state.courses.push(newCourse);
    },

    deleteCourse: (state, { payload: courseId }: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course._id !== courseId);
    },

    updateCourse: (state, { payload }: PayloadAction<Course>) => {
      state.courses = state.courses.map((c) =>
        c._id === payload._id ? payload : c
      );
    },

    setCourses: (state, { payload }: PayloadAction<Course[]>) => {
      state.courses = payload;
    },
  },
});

export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;

export default coursesSlice.reducer;
