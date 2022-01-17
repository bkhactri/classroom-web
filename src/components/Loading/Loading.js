import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

const Loading = ({ isOverlay = false }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        backgroundColor: isOverlay ? alpha("#000", 0.5) : "transparent",
        zIndex: 1403
      }}
    >
      <CircularProgress
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
        size="80px"
      />
    </Box>
  );
};

export default Loading;
