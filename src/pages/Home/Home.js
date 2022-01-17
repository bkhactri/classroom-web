import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import classes from "./Home.module.css";
import ClassBlock from "../../components/ClassBlock/ClassBlock";
import { useTranslation } from "react-i18next";

import axiosClassroom from "../../api/classroom.axios";

const Home = () => {
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentUrl = window.location.pathname;

  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }

    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get("/get-all", {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setClassrooms(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchClassrooms();
  }, [accessToken, navigate]);

  return (
    <>
      <Header loading={isLoading} />
      {!isLoading ? (
        <div className={classes.classList}>
          {classrooms.length > 0 ? (
            <Container maxWidth="xl">
              <Grid
                container
                spacing={2}
                columns={{ xs: 4, sm: 8, md: 12 }}
                rowSpacing={4}
                columnSpacing={{ xs: 1, sm: 2, md: 6 }}
              >
                {classrooms.length > 0
                  ? classrooms.map((classroom) => (
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={3}
                        key={classroom.id}
                      >
                        <ClassBlock data={classroom} />
                      </Grid>
                    ))
                  : null}
              </Grid>
            </Container>
          ) : (
            <div className={classes.noClasses}>
              <div className={classes.noClassesWarning}>
                {t("error.noClassFound")}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Home;
