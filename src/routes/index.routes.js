import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound/PageNotFound";
import ConfirmEmail from "../pages/Register/ConfirmEmail";
import axiosAuth from "../api/auth.axios";
import { authActions } from "../stores/authenticationStore";
import { userInfoActions } from "../stores/userInfoStore";

import PrivateRoute from "./type/privateRoute";
import PublicRoute from "./type/publicRoute";

import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";
import Admin from "../pages/Admin/Admin";
import AdminAccounts from "../pages/Admin/AdminAccounts";
import AdminUsers from "../pages/Admin/AdminUsers";

const AppRouter = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = localStorage.getItem("accessToken");

  const refresh = async () => {
    try {
      const response = await axiosAuth.get("/refresh/getUserInfo", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      if (response) {
        const user = {
          userId: response.id,
          email: response.email,
          isActive: response.isActive,
        };
        dispatch(authActions.loggedIn({ accessToken: accessToken }));
        dispatch(userInfoActions.setUser(user));
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      {publicRoutes.map(({ component: Component, path, exact }) => (
        <Route
          path={`/${path}`}
          key={path}
          element={<PublicRoute isAuthenticated={isAuthenticated} />}
        >
          <Route
            path={`/${path}`}
            key={path}
            exact={exact}
            element={<Component />}
          />
        </Route>
      ))}

      {privateRoutes.map(({ component: Component, path, exact }) => (
        <Route
          path={`/${path}`}
          key={path}
          element={<PrivateRoute isAuthenticated={isAuthenticated} />}
        >
          <Route
            path={`/${path}`}
            key={path}
            exact={exact}
            element={<Component />}
          />
        </Route>
      ))}

      <Route
        path='/admin'
        key='admin'
        element={<PrivateRoute isAuthenticated={isAuthenticated} />}
      >
        <Route
          path="/admin"
          key="admin"
          exact={false}
          element={<Admin />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="adminAccounts" element={<AdminAccounts />} />
        </Route>
      </Route>

      <Route path="/verify-email/:verifyToken" element={<ConfirmEmail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRouter;
