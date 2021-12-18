import { Fragment, React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Grade from "../../components/Grade/Grade";

import axiosClassroom from "../../api/classroom.axios";

const GradeStructure = (props) => {
  const accessToken = useSelector((state) => state.auth.token);
  const history = useHistory();
  const { classroomId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [inputName, setInputName] = useState("");
  const [inputPoint, setInputPoint] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setGrades(result.data.grades || []);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchClassroom();
  }, [accessToken, classroomId]);

  const savingGrades = async (latestGrades) => {
    return await axiosClassroom.put(
      `/${classroomId}`,
      { grades: latestGrades },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
  };

  const handleNameChange = (event) => {
    setInputName(event.target.value);
  };

  const handlePointChange = (event) => {
    setInputPoint(event.target.value);
  };

  const addGrade = () => {
    let invalid = false;
    clearTimeout(timer);
    setErrorMessages([]);

    if (grades.find((grade) => inputName === grade.name)) {
      setErrorMessages(
        errorMessages.concat("A grade with that name already exist")
      );
      invalid = true;
    }
    if (!inputName) {
      setErrorMessages(errorMessages.concat("Name is required"));
      invalid = true;
    }
    if (!inputPoint) {
      setErrorMessages(errorMessages.concat("Point is required"));
      invalid = true;
    }
    if (isNaN(inputPoint)) {
      setErrorMessages(errorMessages.concat("Point must be a number"));
      invalid = true;
    }

    if (!invalid) {
      setIsLoading(true);

      const newGrades = grades.concat({ name: inputName, point: inputPoint });
      setGrades(newGrades);
      setInputName("");
      setInputPoint("");

      savingGrades(newGrades).finally(() => setIsLoading(false));
    }

    setTimer(
      setTimeout(() => {
        setErrorMessages([]);
      }, 5000)
    );
  };

  const saveGrade = (originalName, newGrade) => {
    setIsLoading(true);

    const newGrades = grades.map((grade) => {
      return originalName === grade.name ? newGrade : grade;
    });
    setGrades(newGrades);

    savingGrades(newGrades).finally(() => setIsLoading(false));
  };

  const deleteGrade = (name) => {
    setIsLoading(true);

    const newGrades = grades.filter((grade) => name !== grade.name);
    setGrades(newGrades);

    savingGrades(newGrades).finally(() => setIsLoading(false));
  };

  const saveOrder = () => {
    setIsLoading(true);

    savingGrades(grades).finally(() => setIsLoading(false));
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    const items = reorder(
      grades,
      result.source.index,
      result.destination.index
    );

    setGrades(items);
  };

  return (
    <>
      <Header loading={isLoading} />
      <Container component={Card} maxWidth="sm" sx={{ mt: 5 }}>
        <Box
          sx={{
            m: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Fab
            color="primary"
            title="Back to classroom"
            aria-label="back"
            sx={{ mb: 5 }}
            onClick={() => history.goBack()}
          >
            <ArrowBackIcon />
          </Fab>
          <Typography variant="h5" mb={4}>
            Grade Structure
          </Typography>

          <Grid container>
            <Grid item xs={8}>
              <Typography variant="h5" color="blue">
                Grade Name
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" color="crimson">
                Point
              </Typography>
            </Grid>
            {grades.map((grade) => (
              <Fragment key={grade.name}>
                <Grid item xs={8}>
                  <Typography variant="h6">{grade.name}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{grade.point}</Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={saveOrder}
            disabled={isLoading}
          >
            {isLoading && <CircularProgress color="success" size={25} />}
            &nbsp; Save Order
          </Button>
        </Box>
      </Container>

      <Container component={Card} maxWidth="sm" sx={{ mt: 1 }}>
        <Box
          sx={{
            m: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Collapse in={errorMessages.length !== 0}>
            {errorMessages.map((error, index) => (
              <Alert
                key={index}
                severity="error"
                variant="filled"
                sx={{ my: 1 }}
              >
                {error}
              </Alert>
            ))}
          </Collapse>

          <TextField
            fullWidth
            label="Grade Name"
            variant="standard"
            value={inputName}
            onChange={handleNameChange}
          />

          <TextField
            fullWidth
            label="Point"
            variant="standard"
            value={inputPoint}
            onChange={handlePointChange}
            sx={{ mt: 1 }}
          />
          <Button
            onClick={addGrade}
            disabled={!inputName || !inputPoint || isLoading}
            sx={{
              marginTop: 2,
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            Add New Grade
          </Button>
        </Box>
      </Container>

      {grades.length > 0 && (
        <Container component={Card} maxWidth="sm" sx={{ mt: 1, mb: 5 }}>
          <Box
            sx={{
              m: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {grades.map((grade, index) => (
                      <Grade
                        key={grade.name}
                        grade={grade}
                        index={index}
                        saveGrade={saveGrade}
                        deleteGrade={deleteGrade}
                        isLoading={isLoading}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Container>
      )}
    </>
  );
};

export default GradeStructure;
