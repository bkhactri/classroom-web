import { React } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import classes from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, toggleDrawerClose }) => {
  return (
    <Drawer
      anchor={"left"}
      open={isOpen}
      onClose={toggleDrawerClose("left", false)}
      transitionDuration={{ enter: 250, exit: 200 }}
      classes={{ paper: classes.drawer }}
      style={{zIndex: 1401}}
    >
      <div className={classes.drawerLink}>
        <NavLink
          exact="true"
          to="/"
          style={{ textDecoration: "none" }}
          className={classes.drawerItem}
        >
          <div className={classes.drawerItemIcon}>
            <HomeOutlinedIcon sx={{ fontSize: 25 }} />
          </div>
          <div className={classes.drawerItemTitle}>Classes</div>
        </NavLink>
        <NavLink
          to="/to-do"
          style={{ textDecoration: "none" }}
          className={classes.drawerItem}
        >
          <div className={classes.drawerItemIcon}>
            <FactCheckOutlinedIcon sx={{ fontSize: 25 }} />
          </div>
          <div className={classes.drawerItemTitle}>To-do</div>
        </NavLink>
      </div>
      <Divider />
      <div className={classes.drawerEnrolled}>
        <div className={classes.drawerEnrolledTitle}>Enrolled</div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
