import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from "../pages/Home/Home";
import Classroom from "../pages/Classroom/Classroom";
import JoinClassroom from "../pages/JoinClassroom/JoinClassroom";
import LoginPage from "../pages/Login/Login";
import RegisterPage from "../pages/Register/Register";
import AccountPage from "../pages/Account/Account";
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
          if (
            window.location.pathname === "/login" ||
            window.location.pathname === "/signup"
          ) {
            history.replace("/");
          } else {
            history.replace(window.location.pathname);
          }
        }
      } catch (error) {
        if (window.location.pathname !== "/signup") {
          history.replace("/login");
        }
        console.log(error);
      }
    };

    if (
      (accessToken &&
        (window.location.pathname === "/login" ||
          window.location.pathname === "/signup")) ||
      (!isAuthenticated &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup")
    ) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, history, accessToken]);

  return (
    <Switch>
      {isAuthenticated && (
        <>
          <Route path="/" exact component={Home} />
          <Route path="/classroom/:classroomId" component={Classroom} />
          <Route path="/account" component={AccountPage} />
          <Route path="/join/:classCode" component={JoinClassroom} />
        </>
      )}
      {!isAuthenticated && (
        <>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={RegisterPage} />
        </>
      )}
      <Route path="*" component={PageNotFound}></Route>
    </Switch>
  );
};

export default AppRouter;
