import { React, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import classes from "./Home.module.css";
import ClassBlock from "../../components/ClassBlock/ClassBlock";

import axiosClassroom from "../../api/classroom.axios";

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClassrooms = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get("/get-all");
        setClassrooms(result.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <>
      <Header loading={isLoading} />
      {!isLoading ? (
        <div className={classes.classList}>
          {classrooms ? (
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
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Home;
