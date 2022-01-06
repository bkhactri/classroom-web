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
import LoginSuccess from "../pages/Login/LoginSuccess";
import ClassroomPeople from "../pages/ClassroomPeople/ClassroomPeople";
import GradeStructure from "../pages/GradeStructure/GradeStructure";
import ClassroomGrades from "../pages/ClassroomGrades/ClassroomGrades";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import ChangePassword from "../pages/ResetPassword/ChangePassword";

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
          window.location.pathname === "/signup" ||
          window.location.pathname === "/loginSucess" ||
          window.location.pathname === "/reset-password" ||
          window.location.pathname.includes("change-password"))) ||
      (!isAuthenticated &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/loginSucess" &&
        window.location.pathname !== "/reset-password" &&
        !window.location.pathname.includes("change-password"))
    ) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, history, accessToken]);

  return (
    <Switch>
      {isAuthenticated && (
        <>
          <Route path="/" exact component={Home} />
          <Route path="/account" component={AccountPage} />
          <Route
            path="/join/:classroomId/:classCode"
            component={JoinClassroom}
          />
          <Route path="/classroom/:classroomId" component={Classroom} exact />
          <Route
            path="/classroom/:classroomId/people"
            component={ClassroomPeople}
            exact
          />
          <Route
            path="/classroom/:classroomId/grades"
            component={ClassroomGrades}
            exact
          />
          <Route
            path="/grade-structure/:classroomId"
            component={GradeStructure}
          />
        </>
      )}
      {!isAuthenticated && (
        <>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/reset-password" component={ResetPassword}></Route>
          <Route
            path="/change-password/:resetToken"
            component={ChangePassword}
          ></Route>
          <Route path="/signup" component={RegisterPage}></Route>
          <Route path="/loginSucess" component={LoginSuccess}></Route>
        </>
      )}
      <Route path="*" component={PageNotFound}></Route>
    </Switch>
  );
};

export default AppRouter;
