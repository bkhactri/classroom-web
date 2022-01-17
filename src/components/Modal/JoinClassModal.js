import { React, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";

// import axiosClassroom from "../../api/classroom.axios";
import classes from "./Modal.module.css";
import Container from "@mui/material/Container";

const JoinClassModal = ({ isOpen, handleClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isValidId, setValidId] = useState(false);
  const classCodeEl = useRef(null);

  const handleClassCodeChange = (event) => {
    setValidId(event.target.value !== "");
  };

  const handleJoinClass = async () => {
    const classCode = classCodeEl.current.value;
    navigate(`/join/c/${classCode}`);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={classes.joinModal}>
        <div className={classes.joinModalHeader}>
          <div className={classes.joinModalCloseButton}>
            <IconButton size="large" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.joinModalTitle}>
            {t("classroom.joinClass")}
          </div>
          <div className={classes.joinModalButtonJoin}>
            <Button
              sx={{
                color: "#fff",
                backgroundColor: "#1a73e8",
                textTransform: "none",
                fontSize: 15,
                fontWeight: "bold",
                width: "90px",
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
              {t("join")}
            </Button>
          </div>
        </div>
        <Divider />
        <Container maxWidth="sm">
          <form className={classes.joinFormInput}>
            <div className={classes.joinFormInputTitle}>
              {t("classroom.classCode")}
            </div>
            <div className={classes.joinFormInputSubTitle}>
              {t("classroom.classCodeHint")}
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
