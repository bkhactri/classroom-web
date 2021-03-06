import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import { validatePassword } from "../../validators/fieldValidator";

import axiosUser from "../../api/user.axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const oldPasswordEl = useRef(null);
  const newPasswordEl = useRef(null);

  const handleChange = () => {
    const oldPassword = oldPasswordEl.current.value;
    const newPassword = newPasswordEl.current.value;

    if (oldPassword && newPassword) {
      if (oldPassword === newPassword) {
        setError("error.newPasswordMathOld");
      } else {
        setError(null);
        const errorPwCheck = validatePassword(newPassword);
        if (!errorPwCheck) {
          setError(null);
          setIsValid(true);
        } else {
          setError(errorPwCheck);
        }
      }
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const oldPassword = oldPasswordEl.current.value;
    const newPassword = newPasswordEl.current.value;
    try {
      await axiosUser.put(
        "/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      setIsLoading(false);
      setIsValid(false);
      event.target.reset();
      Swal.fire({
        title: t("success"),
        text: t("accountPage.updatedPassword"),
        icon: "success",
      });
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 3,
        border: "1px solid #333",
        padding: "30px",
        borderRadius: "20px",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {t(error)}
        </Alert>
      )}

      <Typography variant="h6">{t("auth.changePassword")}</Typography>
      <TextField
        fullWidth
        margin="normal"
        id="oldPassword"
        label={t("auth.oldPassword")}
        name="oldPassword"
        type="password"
        inputRef={oldPasswordEl}
        onChange={handleChange}
        autoComplete="old-password"
      />
      <TextField
        fullWidth
        margin="normal"
        id="newPassword"
        label={t("auth.newPassword")}
        type="password"
        name="newPassword"
        onChange={handleChange}
        inputRef={newPasswordEl}
        autoComplete="new-password"
      />
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={isLoading || !isValid}
        >
          {!isLoading ? (
            t("accountPage.update")
          ) : (
            <CircularProgress sx={{ color: "#fff" }} />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
