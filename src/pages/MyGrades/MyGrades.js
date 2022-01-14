import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../../components/Header/Header";
import GradeTable from "../../components/GradeTable/GradeTable";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import axiosUser from "../../api/user.axios";
import axiosGrade from "../../api/grade.axios";
import axiosClassroom from "../../api/classroom.axios";

import { userInfoActions } from "../../stores/userInfoStore";

import { calculateMyGrades } from "../../utils/index";

const MyGrades = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [myGrades, setMyGrades] = useState([]);
  const [gradeTotal, setGradeTotal] = useState(null);

  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchMyGrades = async () => {
      setIsLoading(true);

      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        dispatch(
          userInfoActions.setRole({ role: result.data.participants[0].role })
        );

        const userInfo = await axiosUser.get(`/`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        const tempStudentId = userInfo?.studentId;
        setStudentId(tempStudentId);

        const gradeStructures = await axiosGrade.get(
          `/structure/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        let grades;
        if (tempStudentId) {
          grades = await axiosGrade.get(
            `/myGrade/${classroomId}/${tempStudentId}`,
            {
              headers: { Authorization: "Bearer " + accessToken },
            }
          );
        }

        const [tempGrades, total] = calculateMyGrades(gradeStructures, grades);
        setMyGrades(tempGrades);
        setGradeTotal(total);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchMyGrades();
  }, [accessToken, classroomId, dispatch]);

  return (
    <Fragment>
      <Header loading={isLoading} classroom={4} classID={classroomId}></Header>

      <Container component={Card} maxWidth="sm" sx={{ mt: 5 }}>
        <Box
          sx={{
            m: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Collapse in={!Boolean(studentId)}>
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              <Typography>
                Please set your <strong>Student ID</strong> to see your grades
              </Typography>
            </Alert>
          </Collapse>

          <GradeTable
            myGrades={myGrades}
            gradeTotal={gradeTotal}
            clickable={true}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default MyGrades;
