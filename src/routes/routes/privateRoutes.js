import React from "react";
import Home from "../../pages/Home/Home";
import Classroom from "../../pages/Classroom/Classroom";
import JoinClassroom from "../../pages/JoinClassroom/JoinClassroom";
import AccountPage from "../../pages/Account/Account";

import ClassroomPeople from "../../pages/ClassroomPeople/ClassroomPeople";
import GradeStructure from "../../pages/GradeStructure/GradeStructure";
import ClassroomGrades from "../../pages/ClassroomGrades/ClassroomGrades";
import MyGrades from "../../pages/MyGrades/MyGrades";
import UserDetail from "../../pages/UserDetail/UserDetail";
import AdminUserDetail from "../../pages/Admin/DetailPage/UserDetail";
import ClassroomDetail from "../../pages/Admin/DetailPage/ClassroomDetail";
import AdminDetail from "../../pages/Admin/DetailPage/AdminDetail";

const privateRoutes = [
  {
    path: "",
    component: () => <Home />,
    exact: true,
  },
  {
    path: "account",
    component: () => <AccountPage />,
    exact: false,
  },
  {
    path: "join/:classroomId/:classCode",
    component: () => <JoinClassroom />,
    exact: false,
  },
  {
    path: "classroom/:classroomId",
    component: () => <Classroom />,
    exact: true,
  },
  {
    path: "classroom/:classroomId/people",
    component: () => <ClassroomPeople />,
    exact: true,
  },
  {
    path: "classroom/:classroomId/grades",
    component: () => <ClassroomGrades />,
    exact: true,
  },
  {
    path: "classroom/:classroomId/myGrades",
    component: () => <MyGrades />,
    exact: true,
  },
  {
    path: "grade-structure/:classroomId",
    component: () => <GradeStructure />,
    exact: false,
  },
  {
    path: ":classroomId/user/:userId",
    component: () => <UserDetail />,
    exact: true,
  },
  {
    path: "userDetail/:userID",
    component: () => <AdminUserDetail />,
    exact: false,
  },
  {
    path: "adminDetail/:userID",
    component: () => <AdminDetail />,
    exact: false,
  },
  {
    path: "classroomDetail/:classroomID",
    component: () => <ClassroomDetail />,
    exact: false,
  },
];

export default privateRoutes;
