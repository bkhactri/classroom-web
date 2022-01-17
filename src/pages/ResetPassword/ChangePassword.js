import React, { useState, Fragment, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Header from "../../components/Header/Header";

import axiosAuth from "../../api/auth.axios";
import { validatePassword } from "../../validators/fieldValidator";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [updatePwdStatus, setUpdatePwdStatus] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const c_email = localStorage.getItem("c_user");
  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    const errorPwdCheck = validatePassword(password);
    console.log(errorPwdCheck);
    if (!errorPwdCheck) {
      if (confirmPassword === password) {
        try {
          setIsLoading(true);
          await axiosAuth.post("/changePassword", {
            email: c_email,
            resetToken,
            password,
          });

          navigate("/login");

          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setUpdatePwdStatus(false);
          setError(error.response.data);
        }
      } else {
        setError("error.invalidConfirmPassword");
      }
    } else {
      setError(errorPwdCheck);
    }
  };

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
          {t("auth.resetYourPassword")}
        </Typography>
        {error && <Alert severity="error">{t(error)}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            type="password"
            margin="normal"
            required
            fullWidth
            id="password"
            label={t("auth.newPassword")}
            name="password"
            autoComplete="password"
            autoFocus
          />
          <TextField
            type="password"
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label={t("auth.newPasswordConfirm")}
            name="confirmPassword"
            autoComplete="confirmPassword"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: "primary.main" }}
            disabled={isLoading}
          >
            {!isLoading ? (
              t("auth.changePassword")
            ) : (
              <CircularProgress sx={{ color: "#fff" }} />
            )}
          </Button>
          {!updatePwdStatus && (
            <Link to="/reset-password" variant="body2">
              {t("auth.canNotUpdatePassword")}
            </Link>
          )}
        </Box>
      </Container>
    </Fragment>
  );
};

export default ChangePassword;
