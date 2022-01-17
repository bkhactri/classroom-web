import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useTranslation } from "react-i18next";
// import classes from "./Account.module.css";

import InformationBlock from "../../../components/AdminDetailBlock/InformationBlock";

import axiosClassroom from "../../../api/classroom.axios";
import { useParams } from "react-router";

const ClassroomDetail = () => {
  const { t } = useTranslation();
  const { classroomID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const results = await axiosClassroom.get(
          `/getClassroom/${classroomID}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        console.log("Info", results);

        let classroomInfo = results.data;

        const values = [
          {
            name: "ID",
            value: classroomInfo.id,
          },
          {
            name: t("user.name"),
            value: classroomInfo.name,
          },
          {
            name: t("classroom.section"),
            value: classroomInfo.section,
          },
          {
            name: t("classroom.subject"),
            value: classroomInfo.subject,
          },
          {
            name: t("classroom.room"),
            value: classroomInfo.room,
          },
          {
            name: t("classroom.author"),
            value: classroomInfo.author,
          },
          {
            name: t("classroom.classCode"),
            value: classroomInfo.classCode,
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
  }, [accessToken, classroomID, t]);

  return (
    <>
      <Header loading={isLoading} />
      <Container maxWidth="lg" sx={{ mt: 1, mb: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, fontWeight: "600" }}>
          {t("admin.classroomDetailInfo")}
        </Typography>
        <InformationBlock accountInfo={info} />
      </Container>
    </>
  );
};

export default ClassroomDetail;
