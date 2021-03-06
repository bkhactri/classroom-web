import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import classes from "./ClassroomPeople.module.css";
import axiosClassroom from "../../api/classroom.axios";
import { Typography, List, Divider, ListItem } from "@mui/material";
import InviteEmailModal from "../../components/Modal/InviteEmailModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTranslation } from "react-i18next";
import { userInfoActions } from "../../stores/userInfoStore";

import { ROLE } from "../../utils/constants";

const ClassroomPeople = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.userInfo.userId);
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

  const currentUrl = window.location.pathname;
  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

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
        dispatch(
          userInfoActions.setRole({ role: result.data.participants[0].role })
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        navigate("/");
      }
    };

    fetchClassroom();
    fetchParticipants();
  }, [classroomId, accessToken, navigate, dispatch]);

  const handleCloseSnackBar = () => setSnackBarMessage("");

  const getNumStudent = () => {
    return participants.filter(
      (participant) => participant["role"] === ROLE.STUDENT
    ).length;
  };

  const participantList = (roles) => {
    if (!isLoading) {
      return participants
        .filter((participant) => roles.includes(participant["role"]))
        .map((participant) => {
          const isCurrentUser = participant["user"]["id"] === currentUserId;
          return (
            <div key={participant["userId"]}>
              <ListItem>
                <LazyLoadImage
                  className={classes.avatar}
                  alt={"User Logo"}
                  src={participant["user"]["avatarUrl"]}
                />
                {!isCurrentUser ? (
                  <Link
                    variant="p"
                    className={classes.studentName}
                    to={`/${classroomId}/user/${participant["user"]["id"]}`}
                    style={{
                      fontWeight: isCurrentUser && "bold",
                    }}
                  >
                    {participant["user"]["username"]}
                  </Link>
                ) : (
                  <Typography
                    variant="p"
                    className={classes.studentName}
                    style={{ fontWeight: "bold" }}
                  >
                    {participant["user"]["username"]} ({t("you")})
                  </Typography>
                )}
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
      {isOpenInviteTeacherModal && (
        <InviteEmailModal
          isOpen={isOpenInviteTeacherModal}
          handleClose={handleCloseTeacherInviteModal}
          classroom={classroom}
          type={"TEACHER"}
        />
      )}

      {isOpenInviteStudentModal && (
        <InviteEmailModal
          isOpen={isOpenInviteStudentModal}
          handleClose={handleCloseStudentInviteModal}
          classroom={classroom}
          type={"STUDENT"}
        />
      )}

      <Header loading={isLoading} classroom={2} classID={classroomId} />
      <Container classes={{ root: classes.classroomPeopleContainer }}>
        <List sx={{ marginBottom: 3 }}>
          <ListItem
            style={{ display: "flex", justifyContent: "space-between" }}
            divider
          >
            <Typography variant="h4" className={classes.bigfont}>
              {t("classroom.teacher")}
            </Typography>
            {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
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
              {t("classroom.student")}
            </Typography>
            <div>
              <Typography variant="p" className={classes.fontNumClass}>
                {getNumStudent()} {t("classroom.student")}
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
