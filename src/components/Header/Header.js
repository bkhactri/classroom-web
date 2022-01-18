import { React, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// import Container from "@mui/material/Container";
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
import axiosUser from "../../api/user.axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Globe from "../Globe/Globe";
import { useTranslation } from "react-i18next";
import { ROLE } from "../../utils/constants";
import socketIOClient from "socket.io-client";

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
  const { t } = useTranslation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.userInfo.userId);
  const role = useSelector((state) => state.userInfo.role);
  const avatarUrl = useSelector((state) => state.userInfo.avatarUrl);
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newNotifications, setNewNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isOpenUserMenu, setOpenUserMenu] = useState(null);
  const [isOpenNofitications, setIsOpenNofitications] = useState(null);
  const [isOpenUserTool, setOpenUserTool] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState({ left: false });
  const [isOpenAddClassModal, setOpenAddClassModal] = useState(false);
  const [isOpenJoinClassModal, setOpenJoinClassModal] = useState(false);
  const isHomePage = window.location.pathname === "/";
  const isInsideClassroom = window.location.pathname.includes("classroom/");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(
      process.env.REACT_APP_API_END_POINT
    );

    if (isAuthenticated) {
      socketRef.current.emit("newUser", { userId });

      socketRef.current.on("gradeFinalized", (data) => {
        const userNotification = data.result.filter(
          (notice) => notice.userId === userId
        );
        setNotifications(notifications.concat(userNotification));
        setNewNotifications(newNotifications.concat(userNotification));
      });

      socketRef.current.on("createReviewRequest", (data) => {
        const userNotification = data.result.filter(
          (notice) => notice.userId === userId
        );
        setNotifications(notifications.concat(userNotification));
        setNewNotifications(newNotifications.concat(userNotification));
      });

      socketRef.current.on("gradeReviewResolved", (data) => {
        const userNotification = data.result.filter(
          (notice) => notice.userId === userId
        );
        setNotifications(notifications.concat(userNotification));
        setNewNotifications(newNotifications.concat(userNotification));
      });
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, isAuthenticated, notifications, newNotifications]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const notifications = await axiosUser.get(`/notifications/${userId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const newNotifications = notifications.filter(
          (notification) => notification.viewStatus === false
        );
        setNewNotifications(newNotifications);
        setNotifications(notifications);
      } catch (error) {
        throw new Error(error);
      }
    };

    if (isAuthenticated && userId) {
      getNotifications();
    }
  }, [accessToken, isAuthenticated, userId]);

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
  const showNoficationsList = async (event) => {
    setIsOpenNofitications(event.currentTarget);
  };

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

  const onClickNotification = async (link, noticeId) => {
    try {
      if (newNotifications?.length > 0) {
        await axiosUser.put(
          `/notifications/`,
          { userId, noticeId },
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setNewNotifications([]);
        const newNotifications = notifications.map((notification) => {
          return notification.id === noticeId
            ? { ...notification, viewStatus: true }
            : { ...notification };
        });
        setNotifications(newNotifications);
      }

      navigate(link);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <>
      {isOpenAddClassModal && (
        <AddClassModal
          isOpen={isOpenAddClassModal}
          handleClose={handleCloseAddClassModal}
        />
      )}
      {isOpenJoinClassModal && (
        <JoinClassModal
          isOpen={isOpenJoinClassModal}
          handleClose={handleCloseJoinClassModal}
        />
      )}
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
                  <ListItemText primary={t("classroom.stream")} />
                </ListItemButton>
                <ListItemButton
                  selected={classroom === 2}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("people")}
                >
                  <ListItemText primary={t("classroom.people")} />
                </ListItemButton>
                {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                  <ListItemButton
                    selected={classroom === 3}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("grades")}
                  >
                    <ListItemText primary={t("classroom.grades")} />
                  </ListItemButton>
                )}
                {role === ROLE.STUDENT && (
                  <ListItemButton
                    selected={classroom === 4}
                    classes={{ selected: styles.selected }}
                    onClick={handleGoToClassroomOption("myGrades")}
                  >
                    <ListItemText primary={t("classroom.myGrades")} />
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
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <MenuItem onClick={handleOpenJoinClassModal}>
                      {t("classroom.joinClass")}
                    </MenuItem>
                    <MenuItem onClick={handleOpenAddClassModal}>
                      {t("classroom.createClass")}
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
                    <Badge
                      badgeContent={newNotifications?.length}
                      max={99}
                      color="error"
                    >
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
                        width: "300px",
                        maxWidth: "500px",
                        bgcolor: "background.paper",
                        overflow: "auto",
                        padding: "6px",
                      }}
                    >
                      {notifications?.length > 0 ? (
                        notifications?.map((notification, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              bgcolor: !notification.viewStatus
                                ? "#7aaff0"
                                : "transparent",
                              cursor: "pointer",
                              "&:hover": { bgcolor: "#b5d6ff" },
                            }}
                          >
                            <ListItemText
                              primary={`${notification.message}`}
                              onClick={() =>
                                onClickNotification(
                                  notification.link,
                                  notification.id
                                )
                              }
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography sx={{ textAlign: "center" }}>
                          {t("notice.noNotifications")}
                        </Typography>
                      )}
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
                      {t("accountPage.myAccount")}
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>
                      {t("auth.signOut")}
                    </MenuItem>
                  </Menu>
                </div>
              )}
              <Globe />
            </div>
          </Toolbar>

          {isInsideClassroom && (
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
          )}
        </AppBar>
      </Box>
      {loading ? <LinearProgress /> : null}
    </>
  );
};

export default Header;
