import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
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
import { List, Divider, ListItem, ListItemText} from "@mui/material";
import { authActions } from "../../stores/authenticationStore";

import axiosAuth from "../../api/auth.axios";

const Header = ({ loading, classroom = 0, classID = '' }) =>
{
  const history = useHistory();
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
    dispatch(authActions.clearUser());
    localStorage.removeItem("accessToken");
    history.replace("/login");
    await axiosAuth.post("/logout");
  };

  const handleNavigateAccountPage = () => {
    history.replace("/account");
  }
  const handleGoToClassroomOption = (location) => {
    return () => {
      history.replace(`/${location}/${classID}`);
    }
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
          <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ display: 'flex' , flexDirection: 'row' , alignItems: 'center'}}>
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
              <div className={classes.logo}>
                <SchoolIcon />
              </div>
              <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                eClassroom
              </Typography>
            </div>

            {classroom !== 0 ? 
              <List
                sx={{ display: 'flex' ,flexGrow: 0, flexDirection: 'row' }}>
                <ListItem button onClick={handleGoToClassroomOption('classroom')}>
                  <ListItemText primary="Stream" 
                    className={classroom === 1 ? classes.classOptions : null}/>
                </ListItem>
                <Divider orientation="vertical" flexItem />
                <ListItem button onClick={handleGoToClassroomOption('classroom-people')}>
                  <ListItemText primary="People" 
                    className={classroom === 2 ? classes.classOptions : null}/>
                </ListItem>
              </List>
            : null}

            <div style={{ display: 'flex' , flexDirection: 'row' , alignItems: 'center'}}>
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
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      {loading ? <LinearProgress /> : null}
    </>
  );
}

export default Header;
