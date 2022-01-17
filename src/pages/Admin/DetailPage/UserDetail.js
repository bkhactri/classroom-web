import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
// import classes from "./Account.module.css";

import InformationBlock from "../../../components/AdminDetailBlock/InformationBlock";
import MapStudentId from "../../../components/AccountForm/MapStudentId";

import axiosUser from "../../../api/user.axios";
import { useParams } from "react-router";
import moment from "moment";

const AdminUserDetail = () => {
  const { t } = useTranslation();
  const { userID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [info, setInfo] = useState([]);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const userInfo = await axiosUser.get(`/userInfo/${userID}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setAccountInfo(userInfo);

        console.log("userInfo", userInfo);

        const values = [
          {
            name: "ID",
            value: userInfo.id,
          },
          {
            name: t("accountPage.displayName"),
            value: userInfo.displayName,
          },
          {
            name: t("accountPage.studentId"),
            value: userInfo.studentId,
          },
          {
            name: t("auth.username"),
            value: userInfo.username,
          },
          {
            name: t("auth.emailAddress"),
            value: userInfo.email,
          },
          {
            name: t("user.isActive"),
            value: userInfo.isActive ? "TRUE" : "FALSE",
          },
          {
            name: t("user.isBan"),
            value: userInfo.isBan ? "TRUE" : "FALSE",
          },
          {
            name: t("user.createAt"),
            value: moment(userInfo.createdAt).format("L"),
          },
          {
            name: t("user.role"),
            value: userInfo.role,
          },
        ];

        setInfo(values);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [accessToken, userID, t]);

  return (
    <>
      <Header loading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "600" }}>
          {t("admin.accountInfo")}
        </Typography>
        <Grid container spacing={2} rowSpacing={2}>
          <Grid item sm={12} md={8}>
            <InformationBlock accountInfo={info} />
          </Grid>
          <Grid item sm={12} md={4}>
            <MapStudentId accountInfo={accountInfo} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminUserDetail;
