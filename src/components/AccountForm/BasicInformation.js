import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import axiosUser from "../../api/user.axios";
import axiosAuth from "../../api/auth.axios";
import { useTranslation } from "react-i18next";

const BasicInformation = ({ accountInfo }) => {
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const isUserActive = useSelector((state) => state.userInfo.isActive);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSendMail, setHasSendMail] = useState(false);
  const [isFieldChange, setIsFieldChange] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({
    displayName: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    setCurrentInfo({
      displayName: accountInfo ? accountInfo.displayName : "",
      username: accountInfo ? accountInfo.username : "",
      email: accountInfo ? accountInfo.email : "",
    });
  }, [accountInfo]);

  const handleClickSendVeryEmail = async () => {
    try {
      setIsLoading(true);

      const response = await axiosAuth.post("/sendVerifyEmail", {
        email: currentInfo.email,
      });

      if (response) {
        localStorage.setItem("c_user", response.accepted[0]);
        setIsLoading(false);
        setHasSendMail(true);
      }
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const displayName = data.get("displayName");
    const username = data.get("username");

    const newUserData = {
      email: email !== accountInfo.email ? email : null,
      displayName: displayName !== accountInfo.displayName ? displayName : null,
      username: username !== accountInfo.username ? username : null,
    };

    setIsLoading(true);

    try {
      await axiosUser.put(
        "/basic-info",
        {
          newUserData,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      setIsLoading(false);
      setCurrentInfo((prevState) => ({
        ...prevState,
        newUserData,
      }));
      setIsFieldChange(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data);
    }
  };

  const handleFieldChange = (key, event) => {
    setCurrentInfo((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
    if (accountInfo[key] !== event.target.value && event.target.value !== "") {
      setIsFieldChange(true);
    } else {
      setIsFieldChange(false);
    }
  };

  const handleRestoreDefault = () => {
    setCurrentInfo(accountInfo);
    setIsFieldChange(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 1,
        border: "1px solid #333",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h6">{t("accountPage.displayName")}</Typography>
      <TextField
        fullWidth
        margin="none"
        id="displayName"
        name="displayName"
        onChange={(e) => handleFieldChange("displayName", e)}
        value={currentInfo.displayName || ""}
        autoComplete="display-name"
      />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {t("auth.username")}
      </Typography>
      <TextField
        fullWidth
        margin="none"
        id="username"
        name="username"
        onChange={(e) => handleFieldChange("username", e)}
        value={currentInfo.username || ""}
        autoComplete="username"
      />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {t("auth.emailAddress")}
      </Typography>
      <TextField
        fullWidth
        margin="none"
        id="email"
        name="email"
        onChange={(e) => handleFieldChange("email", e)}
        value={currentInfo.email || ""}
        autoComplete="email"
      />
      {!isUserActive && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mt: 1,
          }}
        >
          {!hasSendMail ? (
            <>
              <Typography sx={{ fontSize: "15px", color: "red", mr: 1 }}>
                {t("accountPage.emailNotVerified")}
              </Typography>
              <Typography
                sx={{
                  color: "green",
                  fontSize: "15px",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleClickSendVeryEmail}
              >
                {t("accountPage.sendMeVerifyEmail")}
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontSize: "15px", color: "red", mr: 1 }}>
              {t("auth.hasSendEmail")}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={isLoading || !isFieldChange}
        >
          {!isLoading ? (
            t("accountPage.update")
          ) : (
            <CircularProgress sx={{ color: "#fff" }} />
          )}
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleRestoreDefault}
          disabled={isLoading || !isFieldChange}
        >
          {t("accountPage.restoreDefault")}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(BasicInformation);
