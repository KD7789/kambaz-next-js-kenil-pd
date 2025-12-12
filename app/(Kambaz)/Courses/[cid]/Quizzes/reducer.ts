"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MCQChoice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  text: string;

  choices?: MCQChoice[];
  correctBoolean?: boolean;
  acceptableAnswers?: string[];
}

export interface Answer {
  questionId: string;
  answerText: string;
}

export interface Attempt {
  attemptNumber: number;
  score: number;
  startedAt: string;
  submittedAt: string;
  answers: Answer[];
}

export interface Quiz {
  _id: string;
  course: string;
  title: string;
  description?: string;
  published: boolean;
  points: number;

  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;

  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;

  availableFrom?: string;
  availableUntil?: string;
  dueDate?: string;

  questions?: Question[];
  attempts?: Attempt[];
  lastScore?: number;
}

interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  myAttempts: Record<string, Attempt>; 
  loading: boolean;
  error: string | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  myAttempts: {},
  loading: false,
  error: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {

    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },

    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },

    updateQuizInStore(state, action: PayloadAction<Quiz>) {
      const updated = action.payload;
      const index = state.quizzes.findIndex((q) => q._id === updated._id);
      if (index !== -1) state.quizzes[index] = updated;

      if (state.currentQuiz?._id === updated._id) {
        state.currentQuiz = updated;
      }
    },

    deleteQuizInStore(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },

    setCurrentQuiz(state, action: PayloadAction<Quiz | null>) {
      state.currentQuiz = action.payload;
    },

    setMyAttempt(
      state,
      action: PayloadAction<{ quizId: string; attempt: Attempt | null }>
    ) {
      const { quizId, attempt } = action.payload;
      if (attempt) {
        state.myAttempts[quizId] = attempt;
      } else {
        delete state.myAttempts[quizId];
      }
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  updateQuizInStore,
  deleteQuizInStore,
  setCurrentQuiz,
  setMyAttempt,
  setLoading,
  setError,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;