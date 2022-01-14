import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { LazyLoadImage } from "react-lazy-load-image-component";

import classes from "./Classroom.module.css";
import axiosClassroom from "../../api/classroom.axios";
import axiosGrade from "../../api/grade.axios";

import { userInfoActions } from "../../stores/userInfoStore";

import { ROLE } from "../../utils/constants";

const Classroom = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.token);
  const avatarUrl = useSelector((state) => state.userInfo.avatarUrl);
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState({});
  const [gradesStructure, setGradesStructure] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteMenuAnchorEl, setInviteMenuAnchorEl] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [role, setRole] = useState("");

  const currentUrl = window.location.pathname;
  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const fetchClassroom = async () => {
      setIsLoading(true);
      try {
        const classroom = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const grades = await axiosGrade.get(`/structure/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        setGradesStructure(grades);
        setClassroom(classroom.data);

        dispatch(
          userInfoActions.setRole({ role: classroom.data.participants[0].role })
        );
        setRole(classroom.data.participants[0].role);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        navigate("/");
      }
    };

    fetchClassroom();
  }, [classroomId, accessToken, navigate, dispatch]);

  const handleOpenInviteMenu = (e) => setInviteMenuAnchorEl(e.currentTarget);
  const handleCloseInviteMenu = () => setInviteMenuAnchorEl(null);

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/join/${classroom.id}/${classroom.classCode}`
    );
    setSnackBarMessage("Invite link copied");
    setInviteMenuAnchorEl(null);
  };

  const copyClassCode = async () => {
    await navigator.clipboard.writeText(classroom.classCode);
    setSnackBarMessage("Class code copied");
    setInviteMenuAnchorEl(null);
  };

  const handleCloseSnackBar = () => setSnackBarMessage("");

  return (
    <>
      <Snackbar
        open={Boolean(snackBarMessage)}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <Header loading={isLoading} classroom={1} classID={classroomId} />
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
            <Grid item xs={12} sm={3} md={3} lg={3}>
              <div className={classes.classLeft}>
                <div className={classes.classLeftTitle}>
                  <div style={{ height: "100%" }}>Class Code</div>
                  <IconButton
                    onClick={handleOpenInviteMenu}
                    sx={{ position: "absolute", top: "10px", right: "5px" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    open={Boolean(inviteMenuAnchorEl)}
                    onClose={handleCloseInviteMenu}
                    anchorEl={inviteMenuAnchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem
                      className={classes.classInviteMenuItem}
                      onClick={copyInviteLink}
                    >
                      <LinkIcon />
                      &nbsp; Copy class invite link
                    </MenuItem>
                    <MenuItem
                      className={classes.classInviteMenuItem}
                      onClick={copyClassCode}
                    >
                      <ContentCopyIcon />
                      &nbsp; Copy class code
                    </MenuItem>
                  </Menu>
                </div>
                <div className={classes.classLeftDetail}>
                  {classroom.classCode}
                </div>
              </div>

              {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                <div className={classes.classLeft}>
                  <div className={classes.classLeftTitle}>
                    <div style={{ height: "100%" }}>Grade Structure</div>
                  </div>
                  <div className={classes.classLeftDetail}>
                    {gradesStructure && gradesStructure.length > 0
                      ? gradesStructure?.map((grade) => (
                          <div key={grade.name}>
                            <b>{grade.name}:</b> {grade.point}
                          </div>
                        ))
                      : "No Grade Found"}
                  </div>
                  <div style={{ width: "100%" }}>
                    <Button
                      component={NavLink}
                      to={`/grade-structure/${classroomId}`}
                      sx={{
                        width: "100%",
                        fontWeight: "bold",
                        color: "#3c4043",
                        margin: "0 auto",
                        paddingBottom: "10px",
                        textTransform: "capitalize",
                      }}
                    >
                      {gradesStructure && gradesStructure.length > 0
                        ? "Edit"
                        : "Add Grade"}
                    </Button>
                  </div>
                </div>
              )}

              <div className={classes.classUpcoming}>
                <div className={classes.classUpcomingTitle}>Upcoming</div>
                <div className={classes.classUpcomingDetail}>
                  No work due soon
                </div>
                <NavLink
                  to="/classroom/1/view-all"
                  className={classes.classViewAllWork}
                >
                  View All
                </NavLink>
              </div>
            </Grid>
            <Grid item xs={12} sm={9} md={9} lg={9}>
              <div className={classes.classWork}>
                <div className={classes.classAnnounce}>
                  <LazyLoadImage
                    className={classes.avatar}
                    alt={"User Logo"}
                    src={avatarUrl}
                  />
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
