import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// import classes from "./Account.module.css";

import BasicInformation from "../../components/AccountForm/BasicInformation";
import ChangePassword from "../../components/AccountForm/ChangePassword";
import MapStudentId from "../../components/AccountForm/MapStudentId";
import { useTranslation } from "react-i18next";
import axiosUser from "../../api/user.axios";

const AccountPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const accessToken = useSelector((state) => state.auth.token);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    // localStorage.setItem("currentUrl", currentUrl);
    navigate(currentUrl);
  }, [currentUrl, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const userInfo = await axiosUser.get(`/`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setAccountInfo(userInfo);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  return (
    <>
      <Header loading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "600" }}>
          {t("accountPage.accountSetting")}
        </Typography>
        <Grid container spacing={2} rowSpacing={2}>
          <Grid item sm={12} md={8}>
            <BasicInformation accountInfo={accountInfo} />
            <ChangePassword />
          </Grid>
          <Grid item sm={12} md={4}>
            <MapStudentId accountInfo={accountInfo} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AccountPage;
