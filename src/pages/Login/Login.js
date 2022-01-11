import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import GoogleLogo from "../../assets/google-logo.png";
import Header from "../../components/Header/Header";

import axiosAuth from "../../api/auth.axios";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { signInFormValidator } from "../../validators/formValidator";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let timer;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errorFormCheck = signInFormValidator(data).error;
    if (!errorFormCheck) {
      setIsLoading(true);
      try {
        const response = await axiosAuth.post("/login", {
          email: data.get("email"),
          password: data.get("password"),
        });
        const userInfo = {
          userId: response.id,
          email: response.email,
          isActive: response.isActive,
        };
        localStorage.setItem("c_user", response.email);
        localStorage.setItem("accessToken", response.accessToken);
        setIsLoading(false);
        timer = setTimeout(() => {
          dispatch(authActions.loggedIn({ accessToken: response.accessToken }));
          dispatch(userInfoActions.setUser(userInfo));
          navigate("/");
        });
      } catch (error) {
        setIsLoading(false);
        setError(error.response.data);
      }
    } else {
      setError(errorFormCheck);
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
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            m: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <SchoolIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Sign in
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Grid container sx={{ mt: 1 }}>
              <Grid item xs>
                <Link to="/reset-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "primary.main", height: 50 }}
              disabled={isLoading}
            >
              {!isLoading ? (
                "Sign In"
              ) : (
                <CircularProgress sx={{ color: "#fff" }} />
              )}
            </Button>
            <Divider sx={{ opacity: 0.7, fontSize: 14 }}> or </Divider>
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 50,
                mt: 2,
                backgroundColor: "white",
                textTransform: "capitalize",
                fontSize: 15,
                fontWeight: 500,
                color: "#555",
                ":hover": {
                  backgroundColor: "#f2f2f2",
                },
              }}
              onClick={async () => {
                const googleLoginURL = `${process.env.REACT_APP_API_END_POINT}/auth/google`;
                // window.location.href = googleLoginURL;
                window.open(googleLoginURL, "_blank").focus();
              }}
            >
              <img
                src={GoogleLogo}
                alt="Google Logo"
                style={{ marginRight: 10 }}
              />
              Login with Google
            </Button>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default LoginPage;
