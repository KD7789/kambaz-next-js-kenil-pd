import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "../(Kambaz)/Courses/[cid]/Assignments/reducer";
import enrollmentsReducer from "./Enrollments/reducer";
import quizzesReducer from "./Courses/[cid]/Quizzes/reducer";
const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
    quizzesReducer: quizzesReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;