import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrolledClass: [],
  teachingClass: [],
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState: initialState,
  reducers: {
    setCurrentUserClasses(state, action) {
      state.enrolledClass = action.payload.enrolledClass;
      state.teachingClass = action.payload.teachingClass;
    },
    clearCurrentUserClasses(state) {
      state.enrolledClass = [];
      state.teachingClass = [];
    },
  },
});

export const classroomActions = classroomSlice.actions;
export default classroomSlice.reducer;
