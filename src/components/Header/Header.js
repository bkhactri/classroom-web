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
import UserLogo from "../../assets/images/user-logo.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import classes from "./Header.module.css";
import SchoolIcon from "@mui/icons-material/School";
import { List, ListItem, ListItemText } from "@mui/material";
import { authActions } from "../../stores/authenticationStore";
import { userInfoActions } from "../../stores/userInfoStore";
import { makeStyles } from "@mui/styles";
import axiosAuth from "../../api/auth.axios";

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

const Header = ({ loading, classroom = 0, classID = "" }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const styles = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpenUserMenu, setOpenUserMenu] = useState(null);
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
    localStorage.removeItem("accessToken");
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
      <Sidebar isOpen={isDrawerOpen["left"]} toggleDrawerClose={toggleDrawer} />
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
                <ListItem
                  button
                  selected={classroom === 1}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("")}
                >
                  <ListItemText primary="Stream" />
                </ListItem>
                <ListItem
                  button
                  selected={classroom === 2}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("people")}
                >
                  <ListItemText primary="People" />
                </ListItem>
                <ListItem
                  button
                  selected={classroom === 3}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("grades")}
                >
                  <ListItemText primary="Grades" />
                </ListItem>
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
                <div className={classes.userSettings}>
                  <IconButton
                    size="large"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleUserMenu}
                  >
                    <img className={classes.avatar} src={UserLogo} alt="logo" />
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
                <ListItem
                  button
                  selected={classroom === 1}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("")}
                >
                  <ListItemText primary="Stream" />
                </ListItem>
                <ListItem
                  button
                  selected={classroom === 2}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("people")}
                >
                  <ListItemText primary="People" />
                </ListItem>
                <ListItem
                  button
                  selected={classroom === 3}
                  classes={{ selected: styles.selected }}
                  onClick={handleGoToClassroomOption("grades")}
                >
                  <ListItemText primary="Grades" />
                </ListItem>
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
