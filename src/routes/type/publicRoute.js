import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PublicRoute = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(window.location.pathname);
  }, [navigate]);

  return !isAuthenticated && <Outlet />;
};

export default PublicRoute;
