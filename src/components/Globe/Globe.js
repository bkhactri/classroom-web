import React, { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import i18next from "i18next";

import { Button, Menu, MenuItem, Box } from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import GlobeIcon from "../Icon/GlobeIcon";

import { languages } from "../../utils/languages";

const Globe = () => {
  const currentLanguageCode = localStorage.getItem("language") || "vi-VN";
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageClick = (langCode) => {
    i18next.changeLanguage(langCode);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button aria-controls="fade-menu" onClick={handleClick}>
        <GlobeIcon />
        <ArrowDropDownIcon />
      </Button>
      <Menu
        sx={{ zIndex: 3000 }}
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {languages.map(({ code, name, countryCode }) => (
          <MenuItem
            selected={code === currentLanguageCode}
            key={code}
            onClick={() => handleLanguageClick(code)}
          >
            <ReactCountryFlag
              countryCode={countryCode}
              style={{
                fontSize: "1.5em",
                marginRight: 10,
              }}
              aria-label={name}
              svg
            />
            {name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Globe;
