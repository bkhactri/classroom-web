import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';

import UserLogo from "../../assets/images/user-logo.png";
import classes from "./Classroom.module.css";
import axiosClassroom from "../../api/classroom.axios";

const Classroom = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [inviteMenuAnchorEl, setInviteMenuAnchorEl] = useState(null);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  useEffect(() => {
    const fetchClassroom = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setClassroom(result.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchClassroom();
  }, [classroomId, accessToken]);

  const handleOpenInviteMenu = (e) => setInviteMenuAnchorEl(e.currentTarget);
  const handleCloseInviteMenu = () => setInviteMenuAnchorEl(null);
  
  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/join/${classroom.classCode}`);
    setSnackBarMessage("Invite link copied");
    setInviteMenuAnchorEl(null);
  }

  const copyClassCode = async () => {
    await navigator.clipboard.writeText(classroom.classCode);
    setSnackBarMessage("Class code copied");
    setInviteMenuAnchorEl(null);
  }

  const handleCloseSnackBar = () => setSnackBarMessage("");

  return (
    <>
      <Snackbar
        open={Boolean(snackBarMessage)}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <Header loading={isLoading} classroom={1} classID={classroomId}/>
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
              <div className={classes.classInvite}>
                <div className={classes.classInviteTitle}>
                  <div style={{ height: "100%" }}>Class Code</div>
                  <IconButton onClick={handleOpenInviteMenu}>
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
                    <MenuItem onClick={copyInviteLink}><LinkIcon />&nbsp; Copy class invite link</MenuItem>
                    <MenuItem onClick={copyClassCode}><ContentCopyIcon />&nbsp; Copy class code</MenuItem>
                  </Menu>
                </div>
                <div className={classes.classInviteDetail}>
                  {classroom.classCode}
                </div>
              </div>
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
