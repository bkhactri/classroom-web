import { React, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import axiosClassroom from "../../api/classroom.axios";

const JoinClassroom = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId, classCode } = useParams();
  const [joinInfo, setJoinInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchJoinInfo = async () => {
      setIsLoading(true);
      try {
        const res = await axiosClassroom.get("/join", {
          params: { id: classroomId, code: classCode },
          headers: { Authorization: "Bearer " + accessToken },
        });
        setJoinInfo(res.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        navigate("/");
        Swal.fire({
          title: t("errorTitle"),
          text: error.response.data,
          icon: "error",
        });
      }
    };

    fetchJoinInfo();
  }, [navigate, classroomId, classCode, accessToken, t]);

  const joinClass = async () => {
    setIsLoading(true);
    try {
      await axiosClassroom.post("/join", null, {
        params: { id: joinInfo.classroomId, code: classCode },
        headers: { Authorization: "Bearer " + accessToken },
      });

      setIsLoading(false);
      navigate(`/classroom/${joinInfo.classroomId}`);
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        title: t("errorTitle"),
        text: error.response.data,
        icon: "error",
      });
    }
  };

  return (
    <>
      <Header loading={isLoading} />
      {joinInfo?.classroomName && (
        <Container component={Card} maxWidth="sm" sx={{ mt: 5 }}>
          <Box
            sx={{
              m: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t("youWillBeJoin")} <strong>{joinInfo.classroomName}</strong>
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t("asA")} <strong>{joinInfo.role}</strong>
            </Typography>
            <Grid sx={{ mt: 5 }} container justifyContent="space-around">
              <Grid item xs={5}>
                <Button
                  sx={{ width: "100%" }}
                  component={Link}
                  to="/"
                  variant="outlined"
                  disabled={isLoading}
                >
                  {t("goHome")}
                </Button>
              </Grid>
              <Grid item xs={5}>
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  onClick={joinClass}
                  disabled={isLoading}
                >
                  {t("join")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </>
  );
};

export default JoinClassroom;
