import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const adminLink = [
    {
      text: t("admin.users"),
      icon: <AdminPanelSettingsIcon />,
      link: "users",
    },
    {
      text: t("admin.admins"),
      icon: <ManageAccountsIcon />,
      link: "adminAccounts",
    },
    {
      text: t("admin.classes"),
      icon: <ListAltIcon />,
      link: "adminClasses",
    },
  ];

  const handleNavigate = (link) => {
    navigate(`/admin/${link}`);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {adminLink.map((item, index) => {
          const { text, icon, link } = item;

          return (
            <ListItem button key={text} onClick={() => handleNavigate(link)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );


  return (
    <Box sx={{ display: "flex" , }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        style={{zIndex: 10}}
      >
        <Drawer
          variant="permanent"
          style={{zIndex: 1400}}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
