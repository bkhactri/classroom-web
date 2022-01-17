import React, { useState, Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Header from "../../components/Header/Header";

import axiosAuth from "../../api/auth.axios";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { useTranslation } from "react-i18next";

const ConfirmEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { verifyToken } = useParams();
  const c_email = localStorage.getItem("c_user");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let timer;

  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const response = await axiosAuth.post("/verifyEmail", {
        email: c_email,
        verifyToken,
      });
      console.log(response);
      const userInfo = {
        userId: response.id,
        email: response.email,
        isActive: response.isActive,
        avatarUrl: response.avatarUrl,
      };
      localStorage.setItem("accessToken", response.accessToken);
      setIsLoading(false);
      timer = setTimeout(() => {
        dispatch(authActions.loggedIn({ accessToken: response.accessToken }));
        dispatch(userInfoActions.setUser(userInfo));
        navigate("/");
      });
      console.log(response);
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, [timer]);

  return (
    <Fragment>
      <Header loading={isLoading} />
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <Avatar sx={{ margin: "20px auto", bgcolor: "primary.main" }}>
          <SchoolIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {t("auth.verifyEmail")}
        </Typography>
        {error && <Alert severity="error">{t(error)}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Typography
            component="h1"
            variant="h6"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {t("welcomeBack")} {c_email}, <br />
            {t("auth.verifyEmailHint")}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "primary.main", height: "50px" }}
            disabled={isLoading}
          >
            {!isLoading ? (
              t("auth.verifyEmail")
            ) : (
              <CircularProgress sx={{ color: "#fff" }} />
            )}
          </Button>
        </Box>
      </Container>
    </Fragment>
  );
};

export default ConfirmEmail;
