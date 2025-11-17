import { createSlice } from "@reduxjs/toolkit";
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
  editing?: boolean;
}

interface ModulesState {
  modules: Module[];
}

const initialState: ModulesState = {
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    // ⭐ Replace whole module list (server data)
    setModules: (state, action) => {
      state.modules = action.payload;
    },

    // ⭐ Add a new module locally (rarely used now)
    addModule: (state, { payload }) => {
      const newModule: Module = {
        _id: uuidv4(),
        lessons: [],
        name: payload.name,
        course: payload.course,
        editing: false,
      };
      state.modules.push(newModule);
    },

    // ⭐ Remove a module by ID
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter((m) => m._id !== moduleId);
    },

    // ⭐ Update module *locally while typing* (client-side only)
    updateModule: (state, { payload }) => {
      state.modules = state.modules.map((m) =>
        m._id === payload._id ? { ...m, ...payload } : m
      );
    },

    // ⭐ Mark module as editing mode
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m
      );
    },

    // ⭐ Save module (stop editing after server update)
    saveModule: (state, { payload }) => {
      state.modules = state.modules.map((m) =>
        m._id === payload._id ? { ...payload, editing: false } : m
      );
    },
  },
});

export const {
  addModule,
  deleteModule,
  updateModule,
  editModule,
  saveModule,
  setModules,
} = modulesSlice.actions;

export default modulesSlice.reducer;
