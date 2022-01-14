import React, { useState, useEffect, Fragment } from "react";

import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import classes from "./UserDetail.module.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";

import userAxios from "../../api/user.axios";

const UserDetail = () => {
  const { userId } = useParams();
  const accessToken = useSelector((state) => state.auth.token);
  const [userInfo, setUserInfo] = useState(null);
  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAxios.get(`/info/${userId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        console.log(response);
        setUserInfo(response);
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchUserInfo();
  }, [userId, accessToken]);

  return (
    <Fragment>
      <Header />
      <Container maxWidth="md">
        {/* User basic info */}
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LazyLoadImage
            className={classes.avatar}
            alt={"User Logo"}
            src={userInfo && userInfo.avatarUrl}
          />
          <Typography variant="h4" sx={{ mt: 2 }}>
            {userInfo && userInfo.username}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "row" }}>
            <EmailIcon sx={{ mt: "5px", mr: "5px" }} />
            <Typography variant="h5">{userInfo && userInfo.email}</Typography>
            <Button>Send Mail</Button>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default UserDetail;
