import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated }) =>
  isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: "/login",
      }}
    />
  );

export default PrivateRoute;
