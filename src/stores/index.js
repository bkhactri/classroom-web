import { configureStore } from "@reduxjs/toolkit";

import authenticationReducer from "./authenticationStore";
import userInfoReducer from "./userInfoStore";

const store = configureStore({
  reducer: { auth: authenticationReducer, userInfo: userInfoReducer },
});

export default store;
