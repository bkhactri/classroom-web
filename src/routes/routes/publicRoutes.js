import React from "react";

import LoginPage from "../../pages/Login/Login";
import RegisterPage from "../../pages/Register/Register";
import LoginSuccess from "../../pages/Login/LoginSuccess";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import ChangePassword from "../../pages/ResetPassword/ChangePassword";

const publicRoutes = [
  {
    path: "login",
    component: () => <LoginPage />,
    exact: false,
  },
  {
    path: "signup",
    component: () => <RegisterPage />,
    exact: false,
  },
  {
    path: "loginSucess",
    component: () => <LoginSuccess />,
    exact: false,
  },
  {
    path: "reset-password",
    component: () => <ResetPassword />,
    exact: false,
  },
  {
    path: "change-password/:resetToken",
    component: () => <ChangePassword />,
    exact: false,
  },
];

export default publicRoutes;
