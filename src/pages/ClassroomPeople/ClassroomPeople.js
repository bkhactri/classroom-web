import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UserLogo from "../../assets/images/user-logo.png";
import classes from "./ClassroomPeople.module.css";
import axiosClassroom from "../../api/classroom.axios";
import { Typography, List, Divider, ListItem } from "@mui/material";
import InviteEmailModal from "../../components/Modal/InviteEmailModal";

const ClassroomPeople = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [classroom, setClassroom] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isOpenInviteTeacherModal, setOpenInviteTeacherModal] = useState(false);
  const [isOpenInviteStudentModal, setOpenInviteStudentModal] = useState(false);
  const [role, setRole] = useState("");

  const handleOpenTeacherInviteModal = () => setOpenInviteTeacherModal(true);
  const handleCloseTeacherInviteModal = () => setOpenInviteTeacherModal(false);
  const handleOpenStudentInviteModal = () => setOpenInviteStudentModal(true);
  const handleCloseStudentInviteModal = () => setOpenInviteStudentModal(false);

  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(
          `/participants?classroomID=${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setParticipants(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    const fetchClassroom = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setClassroom(result.data);
        setRole(result.data.participants[0].role);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        navigate("/");
      }
    };

    fetchClassroom();
    fetchParticipants();
  }, [classroomId, accessToken, navigate]);

  const handleCloseSnackBar = () => setSnackBarMessage("");

  const getNumStudent = () => {
    return participants.filter(
      (participant) => participant["role"] === "STUDENT"
    ).length;
  };

  const participantList = (roles) => {
    if (!isLoading) {
      return participants
        .filter((participant) => roles.includes(participant["role"]))
        .map((participant) => {
          return (
            <div key={participant["userId"]}>
              <ListItem>
                <img className={classes.avatar} src={UserLogo} alt="avatar" />
                <Typography variant="p" className={classes.studentName}>
                  {participant["user"]["username"]}
                </Typography>
              </ListItem>
              <Divider />
            </div>
          );
        });
    }
    return null;
  };

  return (
    <>
      <Snackbar
        open={Boolean(snackBarMessage)}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <InviteEmailModal
        isOpen={isOpenInviteTeacherModal}
        handleClose={handleCloseTeacherInviteModal}
        classroom={classroom}
        type={"TEACHER"}
      />

      <InviteEmailModal
        isOpen={isOpenInviteStudentModal}
        handleClose={handleCloseStudentInviteModal}
        classroom={classroom}
        type={"STUDENT"}
      />
      <Header loading={isLoading} classroom={2} classID={classroomId} />
      <Container classes={{ root: classes.classroomPeopleContainer }}>
        <List sx={{ marginBottom: 3 }}>
          <ListItem
            style={{ display: "flex", justifyContent: "space-between" }}
            divider
          >
            <Typography variant="h4" className={classes.bigfont}>
              Teachers
            </Typography>
            {(role === "OWNER" || role === "TEACHER") && (
              <IconButton onClick={handleOpenTeacherInviteModal}>
                <PersonAddAltIcon sx={{ color: "#1967d2" }} />
              </IconButton>
            )}
          </ListItem>
          <Divider className={classes.dividerBlue} />

          {participantList(["OWNER", "TEACHER"])}
        </List>

        <List>
          <ListItem
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            divider
          >
            <Typography variant="h4" className={classes.bigfont}>
              Students
            </Typography>
            <div>
              <Typography variant="p" className={classes.fontNumClass}>
                {getNumStudent()} students
              </Typography>
              <IconButton onClick={handleOpenStudentInviteModal}>
                <PersonAddAltIcon sx={{ color: "#1967d2" }} />
              </IconButton>
            </div>
          </ListItem>
          <Divider className={classes.dividerBlue} />

          {participantList(["STUDENT"])}
        </List>
      </Container>
    </>
  );
};

export default ClassroomPeople;
