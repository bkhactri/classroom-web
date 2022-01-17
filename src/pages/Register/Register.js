import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Header from "../../components/Header/Header";

import GmailLogo from "../../assets/gmail.png";
import GMXLogo from "../../assets/gmx.png";
import IcloudLogo from "../../assets/icloud.png";
import OutLookLogo from "../../assets/outlook.png";
import ZohoLogo from "../../assets/zoho.png";
import axiosAuth from "../../api/auth.axios.js";
import { signUpFormValidator } from "../../validators/formValidator";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [hasSendMail, setHasSendMail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errorFormCheck = signUpFormValidator(data).error;
    if (!errorFormCheck) {
      setIsLoading(true);

      try {
        const response = await axiosAuth.post("/signup", {
          username: data.get("username"),
          email: data.get("email"),
          password: data.get("password"),
        });
        if (response) {
          localStorage.setItem("c_user", response.accepted[0]);
          setIsLoading(false);
          setHasSendMail(true);
        }
      } catch (error) {
        setIsLoading(false);
        setError(error.response.data);
      }
    } else {
      setError(errorFormCheck);
    }
  };

  return (
    <Fragment>
      <Header loading={isLoading} />
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <SchoolIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {t("auth.signUp")}
          </Typography>
          {hasSendMail ? (
            <Fragment>
              <Typography
                component="h1"
                variant="h5"
                sx={{ mb: 4, textAlign: "center" }}
              >
                {t("auth.hasSendEmail")}
              </Typography>

              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "row",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <ListItem>
                  <a href="https://gmail.com" target="_blank" rel="noreferrer">
                    <img
                      style={{ width: "80px", height: "80px" }}
                      src={GmailLogo}
                      alt=""
                    />
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    href="https://outlook.live.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      src={OutLookLogo}
                      alt=""
                    />
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.gmx.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      src={GMXLogo}
                      alt=""
                    />
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    href="https://www.icloud.com/mail"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      src={IcloudLogo}
                      alt=""
                    />
                  </a>
                </ListItem>
                <ListItem>
                  <a
                    href="https://mail.zoho.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      style={{ width: "80px", height: "80px" }}
                      src={ZohoLogo}
                      alt=""
                    />
                  </a>
                </ListItem>
              </List>
            </Fragment>
          ) : (
            <Fragment>
              {error && <Alert severity="error">{t(error)}</Alert>}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Username"
                      label={t("auth.username")}
                      name="username"
                      autoComplete="username"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label={t("auth.emailAddress")}
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label={t("auth.password")}
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label={t("auth.confirmPassword")}
                      type="password"
                      id="confirm-password"
                      autoComplete="confirm-password"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                  <Grid item>
                    <Link to="/login" variant="body2">
                      {t("auth.alreadyHaveAccount")}
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "secondary.main",
                    height: "50px",
                  }}
                  disabled={isLoading}
                >
                  {!isLoading ? (
                    t("auth.signUp")
                  ) : (
                    <CircularProgress sx={{ color: "#fff" }} />
                  )}
                </Button>
              </Box>
            </Fragment>
          )}
        </Box>
      </Container>
    </Fragment>
  );
};

export default RegisterPage;
