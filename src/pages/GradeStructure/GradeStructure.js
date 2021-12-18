import { Fragment, React, useEffect, useState, useCallback } from "react";
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
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import debounce from "lodash/debounce";

import Grade from "../../components/Grade/Grade";

import axiosGrade from "../../api/grade.axios";

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
        const result = await axiosGrade.get(`/structure/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        setGrades(result || []);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchClassroom();
  }, [accessToken, classroomId]);

  // eslint-disable-next-line
  const debounceSaveOrder = useCallback(debounce((latestGrades) => saveOrder(latestGrades), 1000), []);

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

      axiosGrade.post(
        '/structure',
        { name: inputName, point: inputPoint, classroomId },
        { headers: { Authorization: "Bearer " + accessToken } }
      )
        .then((gradeStructure) => {
          const newGrades = grades.concat(gradeStructure);
          setGrades(newGrades);
        })
        .finally(() => {
          setInputName("");
          setInputPoint("");
          setIsLoading(false);
        });
    }

    setTimer(
      setTimeout(() => {
        setErrorMessages([]);
      }, 5000)
    );
  };

  const saveGrade = (newGrade) => {
    setIsLoading(true);

    axiosGrade.put(
      `/structure/${newGrade.id}`,
      newGrade,
      { headers: { Authorization: "Bearer " + accessToken } }
    )
      .then(() => {
        const newGrades = grades.map((grade) => {
          return newGrade.id === grade.id ? newGrade : grade;
        });
        setGrades(newGrades);
      })
      .finally(() => setIsLoading(false));
  };

  const deleteGrade = (toBeDeleteGradeId) => {
    setIsLoading(true);

    axiosGrade.delete(
      `/structure/${toBeDeleteGradeId}`,
      { headers: { Authorization: "Bearer " + accessToken } }
    )
      .then(() => {
        let count = 0;
        const newGrades = grades
          .filter((grade) => toBeDeleteGradeId !== grade.id)
          .map((grade) => {
            grade.order = count++;

            return grade;
          });

        // Finalize the order numbers
        saveOrder(newGrades);
      })
      .finally(() => setIsLoading(false));
  };

  const saveOrder =  (latestGrades = grades) => {
    setIsLoading(true);

    // Ensure all grade structures have the correct order numnber
    let count = 0;
    const finalizedGrades = latestGrades.map((grade) => {
      grade.order = count++;

      return grade;
    })

    setGrades(finalizedGrades);

    axiosGrade.put(
      '/structure',
      { gradeStructures: finalizedGrades },
      { headers: { Authorization: "Bearer " + accessToken } }
    ).finally(() => setIsLoading(false));
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

    debounceSaveOrder(items);
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
                        key={grade.id}
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
