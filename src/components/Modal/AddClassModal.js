import { React, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

import axiosClassroom from "../../api/classroom.axios";
import classes from "./Modal.module.css";

const AddClassModal = ({ isOpen, handleClose }) => {
  const accessToken = useSelector((state) => state.auth.token);
  const isUserActive = useSelector((state) => state.userInfo.isActive);
  const [isValidForm, setValidForm] = useState(false);
  const classNameEl = useRef(null);
  const classSectionEl = useRef(null);
  const classSubjectEl = useRef(null);
  const classRoomIdEl = useRef(null);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setValidForm(event.target.value !== "");
  };

  const handleCreateClass = async () => {
    const className = classNameEl.current.value;
    const classSection = classSectionEl.current.value;
    const classSubject = classSubjectEl.current.value;
    const classRoomId = classRoomIdEl.current.value;

    try {
      const response = await axiosClassroom.post(
        "/create",
        {
          name: className,
          section: classSection,
          subject: classSubject,
          room: classRoomId,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      navigate(`/classroom/${response.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={classes.addModal}>
        <div className={classes.addModalTitle}>Create class</div>
        {!isUserActive && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "rgba(147, 149, 153, .8)",
              borderRadius: "15px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "15px",
                lineHeight: "35px",
                color: "red",
                textAlign: "center",
                position: "relative",
                fontWeight: "bold",
                top: "45%",
              }}
            >
              Your email is not verified, please verify to create new class
            </Typography>
          </Box>
        )}

        <form className={classes.addModalForm}>
          <TextField
            inputRef={classNameEl}
            onChange={handleNameChange}
            id="standard-basic"
            label="Class name (required)"
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classSectionEl}
            id="standard-basic"
            label="Section"
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classSubjectEl}
            id="standard-basic"
            label="Subject"
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classRoomIdEl}
            id="standard-basic"
            label="Room"
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
        </form>
        <div className={classes.addModalTool}>
          <Stack direction="row">
            <Button
              variant="text"
              className={classes.addModalButton}
              color="inherit"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              className={classes.addModalButton}
              disabled={!isValidForm || !isUserActive}
              color="inherit"
              onClick={handleCreateClass}
            >
              Create
            </Button>
          </Stack>
        </div>
      </div>
    </Modal>
  );
};

export default AddClassModal;
