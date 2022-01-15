/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import classes from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import axiosClassroom from "../../api/classroom.axios";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import axiosUser from "../../api/user.axios";

const Sidebar = ({ isOpen, toggleDrawerClose }) => {
  const accessToken = localStorage.getItem("accessToken");
  const currentUserId = useSelector((state) => state.userInfo.userId);
  const [userRole, setUserRole] = useState("NORMAL");

  const [enrolledClass, setEnrolledClass] = useState([]);
  const [teachingClass, setTeachingClass] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const result = await axiosClassroom.get("/get-all", {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const enrolled = result.data.filter(
          (classroom) => classroom.authorId !== currentUserId
        );
        const teaching = result.data.filter(
          (classroom) => classroom.authorId === currentUserId
        );

        setEnrolledClass(enrolled);
        setTeachingClass(teaching);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassrooms();

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
  }, [accessToken, currentUserId]);

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
        <div className={classes.drawerEnrolledTitle}>Teaching</div>
        {teachingClass.length > 0 ? (
          teachingClass.map((classroom) => (
            <NavLink
              key={classroom.id}
              to={`/classroom/${classroom.id}`}
              style={{ textDecoration: "none" }}
              className={classes.drawerItem}
            >
              <div className={classes.drawerItemIcon}>
                <ClassIcon sx={{ fontSize: 25 }} />
              </div>
              <div className={classes.drawerItemTitle}>{classroom.name}</div>
            </NavLink>
          ))
        ) : (
          <h4 style={{ textAlign: "center" }}>
            You haven't teached any Classroom
          </h4>
        )}
      </div>
      <Divider />
      <div className={classes.drawerEnrolled}>
        <div className={classes.drawerEnrolledTitle}>Enrolled</div>
        {enrolledClass.length > 0 ? (
          enrolledClass.map((classroom) => (
            <NavLink
              key={classroom.id}
              to={`/classroom/${classroom.id}`}
              style={{ textDecoration: "none" }}
              className={classes.drawerItem}
            >
              <div className={classes.drawerItemIcon}>
                <SchoolIcon sx={{ fontSize: 25 }} />
              </div>
              <div className={classes.drawerItemTitle}>{classroom.name}</div>
            </NavLink>
          ))
        ) : (
          <h4 style={{ textAlign: "center" }}>
            You have't enrolled any Classroom
          </h4>
        )}
      </div>
    </Drawer>
  );
};

export default Sidebar;
