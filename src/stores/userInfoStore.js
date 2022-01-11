import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: false,
  email: null,
  isActive: false,
};

const userInfoStore = createSlice({
  name: "authentication",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.isActive = action.payload.isActive;
    },
    clearUser(state) {
      state.userId = false;
      state.email = null;
      state.isActive = false;
    },
  },
});

export const userInfoActions = userInfoStore.actions;
export default userInfoStore.reducer;
