import React from "react";
import Home from "../../pages/Home/Home";
import Classroom from "../../pages/Classroom/Classroom";
import JoinClassroom from "../../pages/JoinClassroom/JoinClassroom";
import AccountPage from "../../pages/Account/Account";

import ClassroomPeople from "../../pages/ClassroomPeople/ClassroomPeople";
import GradeStructure from "../../pages/GradeStructure/GradeStructure";
import ClassroomGrades from "../../pages/ClassroomGrades/ClassroomGrades";
import MyGrades from "../../pages/MyGrades/MyGrades";

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
];

export default privateRoutes;
