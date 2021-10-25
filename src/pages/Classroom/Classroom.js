import { React, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import UserLogo from "../../assets/images/user-logo.png";
import classes from "./Classroom.module.css";
import axiosClassroom from "../../api/classroom.axios";

const Classroom = () => {
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/${classroomId}`);
        setClassroom(result.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassroom();
  }, [classroomId]);

  return (
    <>
      <Header loading={isLoading} />
      <Container classes={{ root: classes.classroomContainer }}>
        <div className={classes.classroomBanner}>
          <div className={classes.classroomBannerImg}>
            <img
              src="https://www.gstatic.com/classroom/themes/img_handcraft.jpg"
              alt="Theme Classroom"
            />
            <div className={classes.classroomInfo}>
              <div className={classes.className}>{classroom.name}</div>
              <div className={classes.classSection}>{classroom.section}</div>
            </div>
          </div>
        </div>
        <div className={classes.classStream}>
          <Grid container spacing={2} rowSpacing={2}>
            <Grid item sm={3} md={3} lg={3}>
              <div className={classes.classUpcoming}>
                <div className={classes.classUpcomingTitle}>Upcoming</div>
                <div className={classes.classUpcomingDetail}>
                  Woohoo, no work due soon!
                </div>
                <NavLink
                  to="/classroom/1/view-all"
                  activeStyle={{
                    backgroundColor: "#e3eefc",
                  }}
                  className={classes.classViewAllWork}
                >
                  View All
                </NavLink>
              </div>
            </Grid>
            <Grid item xs={12} sm={9} md={9} lg={9}>
              <div className={classes.classWork}>
                <div className={classes.classAnnounce}>
                  <img className={classes.avatar} src={UserLogo} alt="logo" />
                  <p>Announce something to your class</p>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Classroom;
