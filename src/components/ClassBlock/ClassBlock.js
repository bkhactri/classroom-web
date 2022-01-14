import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import classes from "./ClassBlock.module.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ClassBlock = ({ data }) => {
  const avatarUrl = useSelector((state) => state.userInfo.avatarUrl);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.item}>
      <div className={classes.userAvatar}>
        <LazyLoadImage alt={"User Logo"} src={avatarUrl} />
      </div>
      <Link to={`/classroom/${data.id}`}>
        <div className={classes.itemContent}>
          <img
            src="https://www.gstatic.com/classroom/themes/img_handcraft.jpg"
            alt="Theme"
          />
          <div className={classes.itemInfo}>
            <div className={classes.itemInfoTop}>
              <div className={classes.classTitle} to={`/classroom/${data.id}`}>
                {data.name}
              </div>
            </div>
            <div className={classes.classSection}>{data.section}</div>
            <div className={classes.classAuthor}>{data.author}</div>
          </div>
        </div>
      </Link>
      <div className={classes.classFunc}>
        <MoreVertIcon
          aria-controls="class-function"
          aria-haspopup="true"
          onClick={handleMenu}
        />
        <Menu
          id="class-function"
          anchorEl={anchorEl}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Invite person</MenuItem>
          <MenuItem onClick={handleClose}>Unenroll</MenuItem>
        </Menu>
      </div>
      <div className={classes.itemLink}>
        <Tooltip title="Open your work for 18CTT">
          <IconButton sx={{ width: "60px", height: "60px" }}>
            <AssignmentIndIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default ClassBlock;
