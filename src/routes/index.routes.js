import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from "../pages/Home/Home";
import Classroom from "../pages/Classroom/Classroom";
import LoginPage from "../pages/Login/Login";
import RegisterPage from "../pages/Register/Register";
import PageNotFound from "../pages/PageNotFound/PageNotFound";
import axiosAuth from "../api/auth.axios";
import { authActions } from "../stores/authenticationStore";

const AppRouter = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = localStorage.getItem("accessToken");
  const history = useHistory();

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        if (window.location.pathname !== "/signup") {
          history.replace("/login");
        }
      }

      try {
        const response = await axiosAuth.get("/", {
          headers: { Authorization: "Bearer " + accessToken },
        });
        if (response) {
          const user = {
            id: response,
            accessToken: accessToken,
          };
          dispatch(authActions.setUser(user));
          history.replace(window.location.pathname);
        }
      } catch (error) {
        if (window.location.pathname !== "/signup") {
          history.replace("/login");
        }
        console.log(error);
      }
    };

    if (
      !isAuthenticated &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup"
    ) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, history, accessToken]);

  return (
    <Switch>
      {isAuthenticated && (
        <>
          <Route path="/" exact component={Home}></Route>
          <Route path="/classroom/:classroomId" component={Classroom}></Route>
        </>
      )}
      {!isAuthenticated && (
        <>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/signup" component={RegisterPage}></Route>
        </>
      )}
      <Route path="*" component={PageNotFound}></Route>
    </Switch>
  );
};

export default AppRouter;
