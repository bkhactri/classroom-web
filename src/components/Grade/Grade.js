import { React, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import { Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";

const Grade = ({ grade, index, saveGrade, deleteGrade, isLoading }) => {
  const [inputName, setInputName] = useState(grade.name);
  const [inputPoint, setInputPoint] = useState(grade.point);
  const [editEnabled, setEditEnabled] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [pointHelperText, setPointHelperText] = useState("");
  const [timer, setTimer] = useState(null);

  const handleNameChange = (event) => {
    setInputName(event.target.value);
  };

  const handlePointChange = (event) => {
    setInputPoint(event.target.value);
  };

  const cancelEdit = () => {
    setInputName(grade.name);
    setInputPoint(grade.point);
    setEditEnabled(false);
  };

  const saveEdit = () => {
    let invalid = false;

    clearTimeout(timer);
    setNameHelperText("");
    setPointHelperText("");

    if (!inputName) {
      setNameHelperText("This field is required");
      invalid = true;
    }

    if (!inputPoint) {
      setPointHelperText("This field is required");
      invalid = true;
    }

    if (isNaN(inputPoint)) {
      setPointHelperText("This field require a number");
      invalid = true;
    }

    if (!invalid) {
      saveGrade(grade.name, { name: inputName, point: inputPoint });
      setEditEnabled(false);
    }

    setTimer(
      setTimeout(() => {
        setNameHelperText("");
        setPointHelperText("");
      }, 5000)
    );
  };

  const confirmDeleteGrade = () => {
    Swal.fire({
      title: `Do you really want to delete ${grade.name}?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGrade(grade.name);
      }
    });
  };

  return (
    <Draggable draggableId={grade.name} index={index}>
      {(provided) => (
        <Box
          component={Card}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box>
              <TextField
                variant="filled"
                label="Name"
                value={inputName}
                onChange={handleNameChange}
                disabled={!editEnabled}
                helperText={nameHelperText}
              ></TextField>
              <TextField
                variant="filled"
                label="Point"
                value={inputPoint}
                onChange={handlePointChange}
                disabled={!editEnabled}
                helperText={pointHelperText}
              ></TextField>
            </Box>

            <Collapse in={editEnabled}>
              <Button
                sx={{ width: "50%" }}
                onClick={saveEdit}
                disabled={!inputName || !inputPoint}
              >
                Save
              </Button>
              <Button sx={{ width: "50%" }} onClick={cancelEdit}>
                Cancel
              </Button>
            </Collapse>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => setEditEnabled(true)}
              disabled={isLoading}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={confirmDeleteGrade} disabled={isLoading}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <DragHandleIcon sx={{ alignSelf: "center" }} />
        </Box>
      )}
    </Draggable>
  );
};

export default Grade;
