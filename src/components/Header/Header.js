import { React, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import AddClassModal from "../Modal/AddClassModal";
import JoinClassModal from "../Modal/JoinClassModal";
import Badge from "@mui/material/Badge";
import Sidebar from "../../components/Sidebar/Sidebar";
import classes from "./Header.module.css";
import SchoolIcon from "@mui/icons-material/School";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { List, ListItem, ListItemText } from "@mui/material";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { classroomActions } from "../../stores/classroomsStore";
import { makeStyles } from "@mui/styles";
import axiosAuth from "../../api/auth.axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ROLE } from "../../utils/constants";

const useStyles = makeStyles({
  selected: {
    backgroundColor: "transparent !important",
    borderRadius: "5px !important",
    borderBottom: "4px solid #1967d2 !important",
    color: "#1967d2 !important",
    fontWeight: "bold !important",
    "&:hover": {
      backgroundColor: "#c9deff !important",
    },
  },
});

const Header = ({ loading, classroom = 0, classID = "", classrooms }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.userInfo.role);
  const avatarUrl = useSelector((state) => state.userInfo.avatarUrl);
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpenUserMenu, setOpenUserMenu] = useState(null);
  const [isOpenNofitications, setIsOpenNofitications] = useState(null);
  const [isOpenUserTool, setOpenUserTool] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState({ left: false });
  const [isOpenAddClassModal, setOpenAddClassModal] = useState(false);
  const [isOpenJoinClassModal, setOpenJoinClassModal] = useState(false);
  const isHomePage = window.location.pathname === "/";

  const handleOpenAddClassModal = () => {
    setOpenUserTool(null);
    setOpenAddClassModal(true);
  };

  const handleOpenJoinClassModal = () => {
    setOpenUserTool(null);
    setOpenJoinClassModal(true);
  };

  const handleCloseAddClassModal = () => setOpenAddClassModal(false);
  const handleCloseJoinClassModal = () => setOpenJoinClassModal(false);
  const handleCloseUserMenu = () => setOpenUserMenu(null);
  const handleUserMenu = (event) => setOpenUserMenu(event.currentTarget);
  const handleUserTool = (event) => setOpenUserTool(event.currentTarget);
  const handleCloseUserTool = () => setOpenUserTool(null);
  const showNoficationsList = (event) =>
    setIsOpenNofitications(event.currentTarget);
  const handleCloseNofiticationsList = () => setIsOpenNofitications(null);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen({ ...isDrawerOpen, [anchor]: open });
  };

  const handleSignOut = async () => {
    dispatch(authActions.loggedOut());
    dispatch(userInfoActions.clearUser());
    dispatch(classroomActions.clearCurrentUserClasses());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUrl");
    navigate("/login");
    await axiosAuth.post("/logout");
  };

  const handleNavigateAccountPage = () => {
    navigate("/account");
  };
  const handleGoToClassroomOption = (location) => {
    return () => {
      navigate(`/classroom/${classID}/${location}`);
    };
  };

  return (
    <>
      <AddClassModal
        isOpen={isOpenAddClassModal}
        handleClose={handleCloseAddClassModal}
      />
      <JoinClassModal
        isOpen={isOpenJoinClassModal}
        handleClose={handleCloseJoinClassModal}
      />
      <Sidebar
        isOpen={isDrawerOpen["left"]}
        toggleDrawerClose={toggleDrawer}
        classrooms={classrooms}
      />
      <Box sx={{ flexGrow: 0 }}>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "#fff",
            color: "#333",
            boxShadow: "none",
            borderBottom: "1px solid #ede8e8",
          }}
        >
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isAuthenticated && (
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 1 }}
                  onClick={toggleDrawer("left", true)}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <div className={classes.logo}>
                <SchoolIcon />
              </div>
              <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                eClassroom
              </Typography>
            </div>

            {classroom !== 0 ? (
              <List
                sx={{ display: "flex", flexGrow: 0, flexDirection: "row" }}
                className={classes.ListDesktop}
              >
                <ListItemButton
                  selected={classroom === 1}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("")}
                >
                  <ListItemText primary="Stream" />
                </ListItemButton>
                <ListItemButton
                  selected={classroom === 2}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("people")}
                >
                  <ListItemText primary="People" />
                </ListItemButton>
                {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                  <ListItemButton
                    selected={classroom === 3}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("grades")}
                  >
                    <ListItemText primary="Grades" />
                  </ListItemButton>
                )}
                {role === ROLE.STUDENT && (
                  <ListItemButton
                    selected={classroom === 4}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("myGrades")}
                  >
                    <ListItemText primary="My Grades" />
                  </ListItemButton>
                )}
              </List>
            ) : null}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {isHomePage && (
                <div className={classes.AddMoreClass}>
                  <IconButton
                    size="large"
                    aria-controls="add-class"
                    aria-haspopup="true"
                    onClick={handleUserTool}
                  >
                    <AddIcon />
                  </IconButton>
                  <Menu
                    id="add-class"
                    anchorEl={isOpenUserTool}
                    open={Boolean(isOpenUserTool)}
                    onClose={handleCloseUserTool}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <MenuItem onClick={handleOpenJoinClassModal}>
                      Join class
                    </MenuItem>
                    <MenuItem onClick={handleOpenAddClassModal}>
                      Create class
                    </MenuItem>
                  </Menu>
                </div>
              )}
              {isAuthenticated && (
                <div className={classes.userNofitications}>
                  <IconButton
                    size="large"
                    aria-controls="nofitications-appbar"
                    aria-haspopup="true"
                    onClick={showNoficationsList}
                  >
                    <Badge badgeContent={0} max={99} color="error">
                      <NotificationsIcon
                        sx={{ color: "#6e6e6e", fontSize: "30px" }}
                      />
                    </Badge>
                  </IconButton>
                  <Menu
                    id="nofitications-appbar"
                    anchorEl={isOpenNofitications}
                    open={Boolean(isOpenNofitications)}
                    onClose={handleCloseNofiticationsList}
                  >
                    <List
                      sx={{
                        width: "250px",
                        maxWidth: "400px",
                        bgcolor: "background.paper",
                        overflow: "auto",
                      }}
                    >
                      {[1, 2, 3].map((value) => (
                        <ListItem
                          key={value}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#ebebeb" },
                          }}
                        >
                          <ListItemText primary={`Line item ${value}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Menu>
                </div>
              )}
              {isAuthenticated && (
                <div className={classes.userSettings}>
                  <IconButton
                    size="large"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleUserMenu}
                  >
                    <LazyLoadImage
                      className={classes.avatar}
                      alt={"User Logo"}
                      src={avatarUrl}
                    />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={isOpenUserMenu}
                    open={Boolean(isOpenUserMenu)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleNavigateAccountPage}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </Toolbar>

          <Toolbar sx={{ margin: "0 auto" }} className={classes.ListMobile}>
            {classroom !== 0 ? (
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <ListItemButton
                  selected={classroom === 1}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("")}
                >
                  <ListItemText primary="Stream" />
                </ListItemButton>
                <ListItemButton
                  selected={classroom === 2}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("people")}
                >
                  <ListItemText primary="People" />
                </ListItemButton>
                {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                  <ListItemButton
                    selected={classroom === 3}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("grades")}
                  >
                    <ListItemText primary="Grades" />
                  </ListItemButton>
                )}
                {role === ROLE.STUDENT && (
                  <ListItemButton
                    selected={classroom === 4}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("myGrades")}
                  >
                    <ListItemText primary="My Grades" />
                  </ListItemButton>
                )}
              </List>
            ) : null}
          </Toolbar>
        </AppBar>
      </Box>
      {loading ? <LinearProgress /> : null}
    </>
  );
};

export default Header;
