import { configureStore } from "@reduxjs/toolkit";

import authenticationReducer from "./authenticationStore";
import userInfoReducer from "./userInfoStore";
import classroomReducer from "./classroomsStore";

const store = configureStore({
  reducer: {
    auth: authenticationReducer,
    userInfo: userInfoReducer,
    classroom: classroomReducer,
  },
});

export default store;
