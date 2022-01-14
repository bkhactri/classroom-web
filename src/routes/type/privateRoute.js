import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated }) => {
  const currentUrl = window.location.pathname;
  localStorage.setItem("currentUrl", currentUrl);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: "/login",
      }}
    />
  );
};

export default PrivateRoute;
