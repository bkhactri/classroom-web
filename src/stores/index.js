import { configureStore } from "@reduxjs/toolkit";

import authenticationReducer from "./authenticationStore";

const store = configureStore({
  reducer: { auth: authenticationReducer },
});

export default store;
