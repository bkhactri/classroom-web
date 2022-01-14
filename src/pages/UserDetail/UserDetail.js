import React, { useState, useEffect, Fragment } from "react";

import Header from "../../components/Header/Header";
import GradeTable from "../../components/GradeTable/GradeTable";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classes from "./UserDetail.module.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";

import axiosUser from "../../api/user.axios";
import axiosGrade from "../../api/grade.axios";
import axiosClassroom from "../../api/classroom.axios";

import { calculateMyGrades } from "../../utils/index";

import { userInfoActions } from "../../stores/userInfoStore";

const UserDetail = () => {
  const dispatch = useDispatch();
  const { classroomId, userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const [userInfo, setUserInfo] = useState(null);
  const currentUserRole = useSelector((state) => state.userInfo.role);
  const [myGrades, setMyGrades] = useState([]);
  const [gradeTotal, setGradeTotal] = useState(null);
  const currentUrl = window.location.pathname;

  const shouldShowGradesBoard = () => {
    console.log(currentUserRole, "currentUserRole");
    console.log(userInfo?.role, "userInfo?.role");
    return (
      (currentUserRole === "OWNER" || currentUserRole === "TEACHER") &&
      userInfo?.role === "STUDENT"
    );
  };

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchUserDetailInfo = async () => {
      setIsLoading(true);

      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        dispatch(
          userInfoActions.setRole({ role: result.data.participants[0].role })
        );

        const response = await axiosUser.get(`/${classroomId}/info/${userId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        setUserInfo(response);

        const gradeStructures = await axiosGrade.get(
          `/structure/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        let grades;

        grades = await axiosGrade.get(`/myGrade/${classroomId}/${userId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const [tempGrades, total] = calculateMyGrades(gradeStructures, grades);

        setMyGrades(tempGrades);
        setGradeTotal(total);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        throw new Error(err);
      }
    };

    fetchUserDetailInfo();
  }, [userId, accessToken, classroomId, dispatch]);

  const canShowGrade = shouldShowGradesBoard();

  return (
    <Fragment>
      <Header loading={isLoading} classID={classroomId} />
      <Container maxWidth="md">
        {/* User basic info */}
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LazyLoadImage
            className={classes.avatar}
            alt={"User Logo"}
            src={userInfo && userInfo.avatarUrl}
          />
          <Typography variant="h4" sx={{ mt: 2 }}>
            {userInfo && userInfo.username}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "row" }}>
            <EmailIcon sx={{ mt: "5px", mr: "5px" }} />
            <Typography variant="h5">{userInfo && userInfo.email}</Typography>
            <Button
              sx={{
                ml: 1,
                textTransform: "capitalize",
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "#5e92e6" },
              }}
            >
              Send Mail
            </Button>
          </Box>
        </Box>
        {/* User grade */}
        {canShowGrade && (
          <Box
            sx={{
              m: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <GradeTable
              myGrades={myGrades}
              gradeTotal={gradeTotal}
              clickable={true}
            />
          </Box>
        )}
      </Container>
    </Fragment>
  );
};

export default UserDetail;
