import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) => {
  const currentUrl = localStorage.getItem("currentUrl");

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: currentUrl ? currentUrl : "/",
      }}
    />
  );
};

export default PublicRoute;
