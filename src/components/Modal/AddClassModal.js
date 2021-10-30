import { React, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { withRouter } from "react-router";

import axiosClassroom from "../../api/classroom.axios";
import classes from "./Modal.module.css";

const AddClassModal = ({ isOpen, handleClose, history }) => {
  const [isValidForm, setValidForm] = useState(false);
  const classNameEl = useRef(null);
  const classSectionEl = useRef(null);
  const classSubjectEl = useRef(null);
  const classRoomIdEl = useRef(null);

  const handleNameChange = (event) => {
    setValidForm(event.target.value !== "");
  };
  const handleCreateClass = async () => {
    const className = classNameEl.current.value;
    const classSection = classSectionEl.current.value;
    const classSubject = classSubjectEl.current.value;
    const classRoomId = classRoomIdEl.current.value;

    try {
      const response = await axiosClassroom.post("/create", {
        name: className,
        section: classSection,
        subject: classSubject,
        room: classRoomId,
        author: "ANCD",
      });
      
      history.push(`/classroom/${response.data.id}`);
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
      <div className={classes.modal}>
        <div className={classes.modalTitle}>Create class</div>
        <form className={classes.modalForm}>
          <TextField
            inputRef={classNameEl}
            onChange={handleNameChange}
            id="standard-basic"
            label="Class name (required)"
            variant="filled"
            fullWidth
            margin="dense"
          />
          <TextField
            inputRef={classSectionEl}
            id="standard-basic"
            label="Section"
            variant="filled"
            fullWidth
            margin="dense"
          />
          <TextField
            inputRef={classSubjectEl}
            id="standard-basic"
            label="Subject"
            variant="filled"
            fullWidth
            margin="dense"
          />
          <TextField
            inputRef={classRoomIdEl}
            id="standard-basic"
            label="Room"
            variant="filled"
            fullWidth
            margin="dense"
          />
        </form>
        <div className={classes.modalTool}>
          <Stack direction="row">
            <Button
              variant="text"
              className={classes.modalButton}
              color="inherit"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="text"
              className={classes.modalButton}
              disabled={!isValidForm}
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

export default withRouter(AddClassModal);
