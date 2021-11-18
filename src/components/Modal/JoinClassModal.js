import { React, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

// import axiosClassroom from "../../api/classroom.axios";
import classes from "./Modal.module.css";
import Container from "@mui/material/Container";

const JoinClassModal = ({ isOpen, handleClose }) => {
  const history = useHistory();
  const [isValidId, setValidId] = useState(false);
  const classCodeEl = useRef(null);

  const handleClassCodeChange = (event) => {
    setValidId(event.target.value !== "");
  };

  const handleJoinClass = async () => {
    const classCode = classCodeEl.current.value;
    history.push(`/join/c/${classCode}`);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setValidId(false);
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={classes.joinModal}>
        <div className={classes.joinModalHeader}>
          <div className={classes.joinModalCloseButton}>
            <IconButton
              size="large"
              onClick={() => {
                setValidId(false);
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.joinModalTitle}>Join Class</div>
          <div className={classes.joinModalButtonJoin}>
            <Button
              sx={{
                color: "#fff",
                backgroundColor: "#1a73e8",
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                width: "80px",
                height: "35px",
                ":hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
              classes={{ disabled: classes.disabledButton }}
              disabled={!isValidId}
              onClick={handleJoinClass}
            >
              Join
            </Button>
          </div>
        </div>
        <Divider />
        <Container maxWidth="sm">
          <form className={classes.joinFormInput}>
            <div className={classes.joinFormInputTitle}>Class code</div>
            <div className={classes.joinFormInputSubTitle}>
              Ask your teacher for the class code, then enter it here
            </div>
            <TextField
              inputRef={classCodeEl}
              onChange={handleClassCodeChange}
              margin="normal"
              id="classcode"
              label="Class code"
              name="classcode"
              autoFocus
              style={{ width: 280 }}
            />
          </form>
        </Container>
      </div>
    </Modal>
  );
};

export default JoinClassModal;
