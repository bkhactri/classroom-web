import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: false,
  email: null,
  isActive: false,
  role: null
};

const userInfoStore = createSlice({
  name: "userInfo",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.isActive = action.payload.isActive;
    },
    setRole(state, action) {
      state.role = action.payload.role;
    },
    clearRole(state) {
      state.role = null;
    },
    clearUser(state) {
      state.userId = false;
      state.email = null;
      state.isActive = false;
      state.role = null;
    },
  },
});

export const userInfoActions = userInfoStore.actions;
export default userInfoStore.reducer;
