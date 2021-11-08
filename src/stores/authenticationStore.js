import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  userId: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.userId = action.payload.id;
    },
    clearUser(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
    },
  },
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
