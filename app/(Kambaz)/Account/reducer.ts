import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "STUDENT" | "FACULTY" | "TA" | "ADMIN" | string;

export interface AccountUser {
  _id: string;
  username: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface AccountState {
  currentUser: AccountUser | null;
}

const initialState: AccountState = {
  currentUser: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AccountUser | null>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
