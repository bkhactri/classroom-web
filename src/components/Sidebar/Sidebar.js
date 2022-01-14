import { React } from "react";
import { useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import classes from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { useState, useEffect } from "react";
import axiosUser from "../../api/user.axios";



const Sidebar = ({ isOpen, toggleDrawerClose}) => {
  const [userRole, setUserRole] = useState("NORMAL");
  const accessToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userRole = await axiosUser.get(`/userRole`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setUserRole(userRole);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [accessToken]);


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

        {userRole === "ADMIN" ? (
          <NavLink
            to="/admin/users"
            style={{ textDecoration: "none" }}
            className={classes.drawerItem}
          >
            <div className={classes.drawerItemIcon}>
              <AdminPanelSettings sx={{ fontSize: 25 }} />
            </div>
            <div className={classes.drawerItemTitle}>Admin Panel</div>
          </NavLink>

        ) : null}

      </div>
      <Divider />
      <div className={classes.drawerEnrolled}>
        <div className={classes.drawerEnrolledTitle}>Enrolled</div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
