import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import Alert from "@mui/material/Alert";

const BasicInformation = ({ accountInfo }) => {

  return (
    <Box
      component="form"
      noValidate
      sx={{
        mt: 1,
        border: "1px solid #333",
        padding: "20px",
        borderRadius: "20px",
      }}
    >

      {accountInfo.map(info => {
        return (
          <>
            <Typography variant="h6">{info.name}</Typography>
            <TextField
              fullWidth
              margin="none"
              id={info.name}
              name={info.name}
              key={info.name}
              disabled
              value={info.value || ""}
              autoComplete="display-name"
            />
          </>
        )
      })}
      
    </Box>
  );
};

export default React.memo(BasicInformation);
