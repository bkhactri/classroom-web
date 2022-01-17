import { React, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axiosClassroom from "../../api/classroom.axios";
import classes from "./Modal.module.css";

const AddClassModal = ({ isOpen, handleClose }) => {
  const { t } = useTranslation();
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
        <div className={classes.addModalTitle}>
          {t("classroom.createClass")}
        </div>
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
              {t("classroom.emailNotVerify")}
            </Typography>
          </Box>
        )}

        <form className={classes.addModalForm}>
          <TextField
            inputRef={classNameEl}
            onChange={handleNameChange}
            id="standard-basic"
            label={t("classroom.className")}
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classSectionEl}
            id="standard-basic"
            label={t("classroom.section")}
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classSubjectEl}
            id="standard-basic"
            label={t("classroom.subject")}
            variant="filled"
            fullWidth
            margin="dense"
            disabled={!isUserActive}
          />
          <TextField
            inputRef={classRoomIdEl}
            id="standard-basic"
            label={t("classroom.room")}
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
              {t("cancel")}
            </Button>
            <Button
              variant="text"
              className={classes.addModalButton}
              disabled={!isValidForm || !isUserActive}
              color="inherit"
              onClick={handleCreateClass}
            >
              {t("create")}
            </Button>
          </Stack>
        </div>
      </div>
    </Modal>
  );
};

export default AddClassModal;
