import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    loggedIn(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
    },
    loggedOut(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
