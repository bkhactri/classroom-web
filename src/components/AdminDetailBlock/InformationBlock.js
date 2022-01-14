import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import Alert from "@mui/material/Alert";

const BasicInformation = ({ accountInfo }) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [isFieldChange, setIsFieldChange] = useState(false);
  // const [currentInfo, setCurrentInfo] = useState({
  //   displayName: "",
  //   username: "",
  //   email: "",
  // });

  // useEffect(() => {
  //   setCurrentInfo({
  //     displayName: accountInfo ? accountInfo.displayName : "",
  //     username: accountInfo ? accountInfo.username : "",
  //     email: accountInfo ? accountInfo.email : "",
  //   });
  // }, [accountInfo]);


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const email = data.get("email");
  //   const displayName = data.get("displayName");
  //   const username = data.get("username");

  //   const newUserData = {
  //     email: email !== accountInfo.email ? email : null,
  //     displayName: displayName !== accountInfo.displayName ? displayName : null,
  //     username: username !== accountInfo.username ? username : null,
  //   };

  //   setIsLoading(true);

  //   try {
  //     await axiosUser.put(
  //       "/basic-info",
  //       {
  //         newUserData,
  //       },
  //       {
  //         headers: { Authorization: "Bearer " + accessToken },
  //       }
  //     );

  //     setIsLoading(false);
  //     setCurrentInfo((prevState) => ({
  //       ...prevState,
  //       newUserData,
  //     }));
  //     setIsFieldChange(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     setError(error.response.data);
  //   }
  // };

  // const handleFieldChange = (key, event) => {
  //   setCurrentInfo((prevState) => ({
  //     ...prevState,
  //     [key]: event.target.value,
  //   }));
  //   if (accountInfo[key] !== event.target.value && event.target.value !== "") {
  //     setIsFieldChange(true);
  //   } else {
  //     setIsFieldChange(false);
  //   }
  // };

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
      {/* {error && (
        <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Alert>
      )} */}

      {accountInfo.map(info => {
        return (
          <>
            <Typography variant="h6">{info.name}</Typography>
            <TextField
              fullWidth
              margin="none"
              id={info.name}
              name={info.name}
              disabled
              value={info.value || ""}
              autoComplete="display-name"
            />
          </>
        )
      })}
      
{/* 
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={isLoading || !isFieldChange}
        >
          {!isLoading ? "Update" : <CircularProgress sx={{ color: "#fff" }} />}
        </Button>
      </Box> */}
    </Box>
  );
};

export default React.memo(BasicInformation);
