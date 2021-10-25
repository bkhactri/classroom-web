import { React, useState } from "react";
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
import UserLogo from "../../assets/images/user-logo.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import classes from "./Header.module.css";

const Header = ({ loading }) => {
  const [isOpenUserMenu, setOpenUserMenu] = useState(null);
  const [isOpenUserTool, setOpenUserTool] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState({ left: false });
  const [isOpenModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenUserTool(null);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
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

  return (
    <>
      <AddClassModal isOpen={isOpenModal} handleClose={handleCloseModal} />
      <Sidebar isOpen={isDrawerOpen["left"]} toggleDrawerClose={toggleDrawer} />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "#fff",
            color: "#333",
            boxShadow: "none",
            borderBottom: "1px solid #ede8e8",
          }}
        >
          <Toolbar>
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
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
              alt="Google"
              className={classes.logo}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Classroom
            </Typography>
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
                <MenuItem onClick={handleCloseUserTool}>Join class</MenuItem>
                <MenuItem onClick={handleOpenModal}>Create class</MenuItem>
              </Menu>
            </div>
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
                <MenuItem onClick={handleCloseUserMenu}>My account</MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>Sign out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      {loading ? <LinearProgress /> : null}
    </>
  );
};

export default Header;
