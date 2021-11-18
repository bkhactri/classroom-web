import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';

import UserLogo from "../../assets/images/user-logo.png";
import classes from "./ClassroomPeople.module.css";
import { makeStyles } from "@mui/styles";
import axiosClassroom from "../../api/classroom.axios";
import { Typography, List, Divider, ListItem, ListItemText } from "@mui/material";

const ClassroomPeople = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/participants?classroomID=${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setParticipants(result.data);
        console.log(result.data)
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchParticipants();
  }, [classroomId, accessToken]);

  const handleCloseSnackBar = () => setSnackBarMessage("");

  const getNumStudent = () => {
    return participants.filter((participant) => participant["role"] === "STUDENT").length;
  }

  const participantList = (roles) => {
    if (!isLoading){
      return participants.map((participant) => {
        if (roles.includes(participant["role"])){
          return(
            <>
              <ListItem key={participant["userID"]}>
                <img className={classes.avatar} src={UserLogo} alt="avatar"/>
                <Typography variant="p" className={classes.studentName}>{participant["user"]["username"]}</Typography>
              </ListItem>
              <Divider/>                  
            </>
          )             
        }
      })
    } 
    return null;
  }

  return (
    <>  
      <Snackbar
        open={Boolean(snackBarMessage)}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <Header loading={isLoading} />
      <Container classes={{ root: classes.classroomPeopleContainer }}>

        <List>
          <ListItem divider>
            <Typography variant="h4" className={classes.bigfont}>Teachers</Typography>
          </ListItem>
          <Divider className={classes.dividerBlue}/>

          {participantList(["OWNER", "TEACHER"])}
          
        </List>


        <List>
          <ListItem style={{display:'flex', alignItems:'start'}} divider>
            <Typography variant="h4" className={classes.bigfont}>Classmates</Typography>
            <Typography variant="h5" className={classes.bigfont}>Classmates</Typography>
          </ListItem>
          <Divider className={classes.dividerBlue}/>

          {participantList(["STUDENT"])}
        </List>
      </Container>
    </>
  );
};

export default ClassroomPeople;
