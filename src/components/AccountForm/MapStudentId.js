import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import axiosUser from "../../api/user.axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const MapStudentId = ({ accountInfo }) => {
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const [currentStuId, setCurrentStuId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const studentIdEl = useRef(null);

  useEffect(() => {
    if (accountInfo) {
      setCurrentStuId(accountInfo.studentId);
    }
  }, [accountInfo]);

  const handleChange = () => {
    const studentId = studentIdEl.current.value;

    if (studentId !== accountInfo.studentId && studentId !== "") {
      setIsValid(true);
      setCurrentStuId(studentId);
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const studentId = data.get("studentId");

    setIsLoading(true);
    try {
      await axiosUser.post(
        "/map-studentId",
        {
          studentId,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      setIsLoading(false);
      setCurrentStuId(studentId);
      setIsValid(false);
      Swal.fire({
        title: t("success"),
        text: t("accountPage.mappedStudentId"),
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
        mt: 1,
        border: "1px solid #333",
        padding: "30px",
        borderRadius: "20px",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h6">{t("accountPage.studentId")}</Typography>
      <TextField
        fullWidth
        margin="normal"
        id="studentId"
        label="ID"
        name="studentId"
        inputRef={studentIdEl}
        onChange={handleChange}
        value={currentStuId || ""}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={isLoading || !isValid}
        >
          {t("accountPage.mapMyId")}
        </Button>
      </Box>
    </Box>
  );
};

export default MapStudentId;
