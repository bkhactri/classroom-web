import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import SchoolIcon from "@mui/icons-material/School";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import axiosAuth from "../../api/auth.axios";
import { validatePassword } from "../../validators/fieldValidator";

const ChangePassword = () => {
  const history = useHistory();
  const { resetToken } = useParams();
  const [updatePwdStatus, setUpdatePwdStatus] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
            resetToken,
            password,
          });

          history.replace("/login");

          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          setUpdatePwdStatus(false);
          setError(error.response.data);
        }
      } else {
        setError("Confirm Password not match");
      }
    } else {
      setError(errorPwdCheck);
    }
  };

  return (
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
        Reset your password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          type="password"
          margin="normal"
          required
          fullWidth
          id="password"
          label="New Password"
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
          label="Confirm new password"
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
            "Change password"
          ) : (
            <CircularProgress sx={{ color: "#fff" }} />
          )}
        </Button>
        {!updatePwdStatus && (
          <Link to="/reset-password" variant="body2">
            Can not update password? Send another mail
          </Link>
        )}
      </Box>
    </Container>
  );
};

export default ChangePassword;