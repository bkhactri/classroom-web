import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// import classes from "./Account.module.css";

import InformationBlock from "../../../components/AdminDetailBlock/InformationBlock";

import axiosClassroom from "../../../api/classroom.axios";
import { useParams } from "react-router";
import moment from "moment";

const ClassroomDetail = () => {
  const { classroomID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const results = await axiosClassroom.get(`/getClassroom/${classroomID}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        console.log('Info', results);

        let classroomInfo = results.data;

        const values = [
          {
            name: "ID",
            value: classroomInfo.id
          },
          {
            name: "Name",
            value: classroomInfo.name
          },
          {
            name: "Section",
            value: classroomInfo.section
          },
          {
            name: "Subject",
            value: classroomInfo.subject
          },
          {
            name: "Room",
            value: classroomInfo.room
          },
          {
            name: "Author",
            value: classroomInfo.author
          },
          {
            name: "Class Code",
            value: classroomInfo.classCode
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
  }, [accessToken, classroomID]);

  return (
    <>
      <Header loading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "600" }}>
          Classroom Detail Infomation
        </Typography>
        <InformationBlock accountInfo={info} />
      </Container>
    </>
  );
};

export default ClassroomDetail;
