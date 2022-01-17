import { useEffect, useState, Fragment, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../../components/Header/Header";
import GradeTable from "../../components/GradeTable/GradeTable";
import GradeDetailModal from "../../components/Modal/GradeDetailModal";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import axiosUser from "../../api/user.axios";
import axiosGrade from "../../api/grade.axios";
import axiosClassroom from "../../api/classroom.axios";
import axiosStudentIdentification from "../../api/student-identification.axios";
import { useTranslation } from "react-i18next";
import { userInfoActions } from "../../stores/userInfoStore";

import { calculateMyGrades } from "../../utils/index";

const MyGrades = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [myGrades, setMyGrades] = useState([]);
  const [gradeTotal, setGradeTotal] = useState(null);
  const [isGradeDetailOpen, setGradeDetailOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState({});

  const fetchMyGrades = useCallback(
    async (tempStudentId) => {
      setIsLoading(true);
      try {
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
    },
    [accessToken, classroomId]
  );

  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchInitialData = async () => {
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

        const studentInfo = await axiosStudentIdentification.get(
          `/${tempStudentId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setStudentName(studentInfo.name);

        fetchMyGrades(tempStudentId);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    fetchInitialData();
  }, [accessToken, classroomId, dispatch, fetchMyGrades]);

  const handleCloseGradeDetailModal = () => {
    setGradeDetailOpen(false);
    fetchMyGrades(studentId);
  };
  const handleOpenGradeDetail = ({
    gradeStructureId,
    gradeStructureName,
    point,
    total,
    createdAt,
    updatedAt,
  }) => {
    setSelectedGrade({
      gradeStructureId,
      gradeStructureName,
      point,
      total,
      createdAt,
      updatedAt,
    });
    setGradeDetailOpen(true);
  };

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
                {t("pleaseSetYour")}&nbsp;
                <strong>{t("accountPage.studentId")}</strong> {t("toViewGrade")}
              </Typography>
            </Alert>
          </Collapse>

          {studentId && studentName && (
            <Typography sx={{ mb: 2 }}>
              {t("gradesOf")} <strong>{studentId}</strong> -{" "}
              <strong>{studentName}</strong>
            </Typography>
          )}

          <GradeTable
            myGrades={myGrades}
            gradeTotal={gradeTotal}
            clickable={true}
            handleOpenGradeDetail={handleOpenGradeDetail}
          />
        </Box>
      </Container>

      {isGradeDetailOpen && (
        <GradeDetailModal
          gradeId={{
            classroomId,
            gradeStructureId: selectedGrade.gradeStructureId,
            studentIdentificationId: studentId,
          }}
          additionalInfos={{
            studentId,
            studentName,
            gradeStructureName: selectedGrade.gradeStructureName,
            createdAt: selectedGrade.createdAt,
            updatedAt: selectedGrade.updatedAt,
          }}
          grade={{
            point: selectedGrade.point,
            total: selectedGrade.total,
          }}
          isOpen={isGradeDetailOpen}
          handleClose={handleCloseGradeDetailModal}
        />
      )}
    </Fragment>
  );
};

export default MyGrades;
