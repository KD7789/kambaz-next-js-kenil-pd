import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

export interface Lesson {
  _id: string;
  name: string;
  description?: string;
  module?: string;
}

export interface Module {
  _id: string;
  name: string;
  course: string;
  lessons: Lesson[];
  editing?: boolean; // 👈 optional flag for inline editing
}

interface ModulesState {
  modules: Module[];
}

const initialState: ModulesState = {
  modules: modules as Module[],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    // ✅ Add new module with editing flag
    addModule: (state, { payload }) => {
      const newModule: Module = {
        _id: uuidv4(),
        lessons: [],
        name: payload.name,
        course: payload.course,
        editing: false, // 👈 ensure TypeScript knows this exists
      };
      state.modules.push(newModule);
    },

    // ✅ Delete module by ID
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter((m) => m._id !== moduleId);
    },

    // ✅ Update module details
    updateModule: (state, { payload }) => {
      state.modules = state.modules.map((m) =>
        m._id === payload._id ? payload : m
      );
    },

    // ✅ Toggle editing mode
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m
      );
    },
  },
});

export const { addModule, deleteModule, updateModule, editModule } =
  modulesSlice.actions;
export default modulesSlice.reducer;
