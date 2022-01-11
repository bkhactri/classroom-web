import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) =>
  !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: "/",
      }}
    />
  );

export default PublicRoute;
