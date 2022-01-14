import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// import classes from "./Account.module.css";

import InformationBlock from "../../../components/AdminDetailBlock/InformationBlock";
import MapStudentId from "../../../components/AccountForm/MapStudentId";

import axiosUser from "../../../api/user.axios";
import { useParams } from "react-router";
import moment from "moment";

const UserDetail = () => {
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

        console.log('userInfo', userInfo);

        const values = [
          {
            name: "ID",
            value: userInfo.id
          },
          {
            name: "Display Name",
            value: userInfo.displayName
          },
          {
            name: "Student ID",
            value: userInfo.studentId
          },
          {
            name: "Username",
            value: userInfo.username
          },
          {
            name: "Email",
            value: userInfo.email
          },
          {
            name: "Is Activate",
            value: userInfo.isActive ? "TRUE" : "FALSE"
          },
          {
            name: "Is Ban",
            value: userInfo.isBan ? "TRUE" : "FALSE"
          },
          {
            name: "Created At",
            value: moment(userInfo.createdAt).format('L')
          },
          {
            name: "Role",
            value: userInfo.role
          } 
        ]

        setInfo(values);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [accessToken, userID]);

  return (
    <>
      <Header loading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "600" }}>
          Account Infomation
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

export default UserDetail;
