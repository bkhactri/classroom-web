import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const Loading = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress size="80px" />
      </Box>
    </Container>
  );
};

export default Loading;
