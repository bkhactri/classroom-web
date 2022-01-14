import React, { useEffect, useRef, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import axiosAuth from "../../api/auth.axios";
import { validateEmail } from "../../validators/fieldValidator";

import GmailLogo from "../../assets/gmail.png";
import GMXLogo from "../../assets/gmx.png";
import IcloudLogo from "../../assets/icloud.png";
import OutLookLogo from "../../assets/outlook.png";
import ZohoLogo from "../../assets/zoho.png";
import Header from "../../components/Header/Header";

const ResetPassword = () => {
  const emailRef = useRef(null);
  const [hasSendMail, setHasSendMail] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    if (!validateEmail(email) || email === "") {
      setError("Email is not valid");
    } else {
      setError("");

      try {
        setIsLoading(true);
        const response = await axiosAuth.post("/resetPassword", { email });
        if (response) {
          localStorage.setItem("c_user", response.accepted[0]);
          setHasSendMail(true);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error.response.data);
      }
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
          Forgot Password
        </Typography>
        {hasSendMail ? (
          <Fragment>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 4, textAlign: "center" }}
            >
              We have send a reset password mail to your email please check and
              see you around
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
                <a href="https://www.gmx.com" target="_blank" rel="noreferrer">
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
            <Typography
              component="h1"
              variant="h6"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Please enter your username or email address. <br />
              You will receive a link to create a new password via email.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                inputRef={emailRef}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "primary.main" }}
                disabled={isLoading}
              >
                {!isLoading ? (
                  "Reset Password"
                ) : (
                  <CircularProgress sx={{ color: "#fff" }} />
                )}
              </Button>
              <Link to="/login" variant="body2">
                Remember your password?
              </Link>
            </Box>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

export default ResetPassword;
