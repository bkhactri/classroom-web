import { React, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { darken } from "@mui/material/styles";

import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import Input from "@mui/material/Input";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";

import axiosGradeRequest from "../../api/grade-request.axios";
import axiosGrade from "../../api/grade.axios";

import {
  ROLE,
  GRADE_STATUS,
  REVIEW_REQUEST_STATUS,
} from "../../utils/constants";

const GradeDetailModal = ({
  gradeId,
  additionalInfos,
  isOpen,
  handleClose,
  grade,
}) => {
  const accessToken = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.userInfo.role);
  const [isGradeValid, setGradeValid] = useState(false);
  const [isReasonValid, setReasonValid] = useState(false);
  const [isMessageValid, setMessageValid] = useState(false);
  const [isExtraInputsOpen, setExtraInputsOpen] = useState(false);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentPoint, setCurrentPoint] = useState(null);
  const gradeEl = useRef(null);
  const reasonEl = useRef(null);
  const messageEl = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (
        !gradeId?.classroomId ||
        !gradeId?.gradeStructureId ||
        !gradeId?.studentIdentificationId
      ) {
        return;
      }

      try {
        const tempRequests = await axiosGradeRequest.get(
          `/${gradeId?.classroomId}/${gradeId?.gradeStructureId}/${gradeId?.studentIdentificationId}`,
          { headers: { Authorization: "Bearer " + accessToken } }
        );
        setRequests(tempRequests);

        if (tempRequests?.length && !Boolean(tempRequests[0].resolveStatus)) {
          setReviewRequest(tempRequests[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequests();

    setMessages([
      {
        sender: {
          id: "f44a3e81-2e03-4bf1-b805-d9b81678c7b0",
          studentId: "18120291",
          username: "Binh",
        },
        receiver: {
          id: "c00b1514-5146-4f9a-b3ed-77b25eaddf82",
          username: "Tri",
        },
        message:
          "Fuck you man!! you peopl sajdpoijwqpjepwqjepwqjepasdsaaaaaaaaaaaaaaaaaaaaaaaaaa",
        createdAt: "2021-12-18 16:32:42.73+07",
      },
      {
        sender: {
          id: "c00b1514-5146-4f9a-b3ed-77b25eaddf82",
          username: "Tri",
        },
        receiver: {
          id: "f44a3e81-2e03-4bf1-b805-d9b81678c7b0",
          studentId: "18120291",
          username: "Binh",
        },
        message: "Fuck you too!!",
        createdAt: "2021-12-18 16:38:57.789+07",
      },
    ]);
    // eslint-disable-next-line
  }, []);

  const handleGradeChange = (event) => {
    const number = Number(event.target.value || event);
    setGradeValid(
      !isNaN(number) &&
        number >= 0 &&
        number <= grade?.total &&
        number !== Number(grade?.point)
    );
  };

  const handleReasonChange = (event) => {
    setReasonValid(Boolean(event.target.value?.length));
  };

  const handleExtraInputsOpen = (event) => {
    if (!Boolean(reviewRequest)) {
      setExtraInputsOpen(true);
    }
  };

  const handleExtraInputsClose = (event) => {
    setExtraInputsOpen(false);
    gradeEl.current.value = null;
    reasonEl.current.value = "";
  };

  const handleMessageChange = (event) => {
    setMessageValid(Boolean(event.target.value?.length));
  };

  const createReviewRequest = () => {
    if (!isGradeValid || !isReasonValid) {
      return;
    }

    Swal.fire({
      title: "Creating grade review request",
      html:
        `<p>Are you sure you want to create the request?</p>` +
        `<p>You will not able to update or delete the request after</p>`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosGradeRequest
          .post(
            `/${gradeId?.classroomId}/${gradeId?.gradeStructureId}/${gradeId?.studentIdentificationId}`,
            { point: gradeEl.current.value, reason: reasonEl.current.value },
            { headers: { Authorization: "Bearer " + accessToken } }
          )
          .then((resultReviewRequest) => {
            setReviewRequest(resultReviewRequest);
            setRequests(requests.concat(resultReviewRequest));

            setExtraInputsOpen(false);
            setGradeValid(false);
            setReasonValid(false);
            gradeEl.current.value = null;
            reasonEl.current.value = "";

            // NOTIFICATION NEEDED
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const editGrade = (point = null) => {
    if (!isGradeValid && !point) {
      return;
    }

    axiosGrade
      .post(
        "/gradeDraftSingleCell",
        {
          studentId: additionalInfos?.studentId,
          gradeId: gradeId?.gradeStructureId,
          gradePoint: Number(point || gradeEl.current.value),
          classroomId: gradeId?.classroomId,
          status: GRADE_STATUS.FINALIZED,
        },
        { headers: { Authorization: "Bearer " + accessToken } }
      )
      .then(() => {
        setCurrentPoint(Number(point || gradeEl.current.value));
        setReviewRequest(null);
        setExtraInputsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resolveReviewRequest = (status) => {
    if (!Boolean(reviewRequest)) {
      return;
    }

    Swal.fire({
      title: `${
        status === REVIEW_REQUEST_STATUS.ACCEPTED ? "Accept" : "Deny"
      } grade review request`,
      text: "Are you sure you want to do this?",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosGradeRequest
          .put(
            `/${gradeId?.classroomId}/${gradeId?.gradeStructureId}/${gradeId?.studentIdentificationId}/${reviewRequest.id}`,
            { resolveStatus: status },
            { headers: { Authorization: "Bearer " + accessToken } }
          )
          .then((resultReviewRequest) => {
            if (status === REVIEW_REQUEST_STATUS.ACCEPTED) {
              editGrade(resultReviewRequest.point);
              // NOTIFICATION NEEDED
            } else {
              setReviewRequest(null);
              // NOTIFICATION NEEDED
            }

            setRequests(
              requests.map((r) => {
                if (r.id === resultReviewRequest.id) {
                  return resultReviewRequest;
                }

                return r;
              })
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const sendMessage = () => {
    const message = messageEl.current.value;
    console.log("message", message);
    messageEl.current.value = "";
  };

  const determineYourself = (sender) => {
    return sender?.studentId === additionalInfos?.studentId;
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth="lg" component={Card} sx={{ my: 5 }}>
        <Grid container flexDirection="row">
          <Grid item xs={7}>
            <Box
              sx={{
                m: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ alignSelf: "start" }}>
                <Typography color="primary" variant="h4">
                  {additionalInfos?.gradeStructureName}
                </Typography>
                <Typography color="gray">
                  {additionalInfos?.studentId}{" "}
                  <FiberManualRecordIcon sx={{ fontSize: "0.75em" }} />{" "}
                  {additionalInfos?.createdAt &&
                    additionalInfos?.updatedAt &&
                    `${format(
                      new Date(additionalInfos?.createdAt),
                      "PPP"
                    )} (Edited ${format(
                      new Date(additionalInfos?.updatedAt),
                      "PPP"
                    )})`}
                </Typography>
                <Stack direction="row" spacing={2} mt={2}>
                  {isExtraInputsOpen ? (
                    <Input
                      inputRef={gradeEl}
                      onChange={handleGradeChange}
                      error={!isGradeValid}
                      id="grade"
                      name="grade"
                      sx={{
                        width: "80px",
                        fontSize: "1.5em",
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                        alignSelf: "center",
                        "&.MuiInputBase-root": { height: "36px" },
                      }}
                      type="number"
                    />
                  ) : (
                    <Typography
                      color="primary"
                      sx={{ fontSize: "1.5em", alignSelf: "center" }}
                    >
                      {currentPoint || grade?.point}
                    </Typography>
                  )}
                  <Typography
                    color="primary"
                    fontWeight="bold"
                    sx={{ fontSize: "1.5em", alignSelf: "center" }}
                  >
                    / {grade?.total}
                  </Typography>
                  {isExtraInputsOpen && role === ROLE.STUDENT && (
                    <TextField
                      inputRef={reasonEl}
                      id="reason"
                      name="reason"
                      label="Reason"
                      onChange={handleReasonChange}
                      multiline
                      rows={3}
                      sx={{ alignSelf: "center" }}
                    />
                  )}
                  {!isExtraInputsOpen && (
                    <Tooltip
                      arrow
                      title={
                        Boolean(reviewRequest)
                          ? "Cannot edit or create new request until the current one has been resolved"
                          : [ROLE.OWNER, ROLE.TEACHER].includes(role)
                          ? "Edit grade"
                          : "Create grade review request"
                      }
                    >
                      <span style={{ alignSelf: "center" }}>
                        <Fab
                          size="small"
                          color="primary"
                          onClick={handleExtraInputsOpen}
                          disabled={Boolean(reviewRequest)}
                        >
                          <EditIcon />
                        </Fab>
                      </span>
                    </Tooltip>
                  )}

                  {isExtraInputsOpen && role === ROLE.STUDENT && (
                    <Tooltip arrow title="Add grade review request">
                      <span style={{ alignSelf: "center" }}>
                        <Fab
                          size="small"
                          color="secondary"
                          onClick={createReviewRequest}
                          disabled={!isGradeValid || !isReasonValid}
                        >
                          <AddIcon />
                        </Fab>
                      </span>
                    </Tooltip>
                  )}

                  {isExtraInputsOpen &&
                    [ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                      <Tooltip arrow title="Add grade review request">
                        <span style={{ alignSelf: "center" }}>
                          <Fab
                            size="small"
                            color="secondary"
                            onClick={() => editGrade()}
                            disabled={!isGradeValid}
                          >
                            <SaveIcon />
                          </Fab>
                        </span>
                      </Tooltip>
                    )}
                  {isExtraInputsOpen && (
                    <Fab
                      size="small"
                      sx={{
                        backgroundColor: "crimson",
                        color: "white",
                        alignSelf: "center",
                        "&:hover": { backgroundColor: darken("#DC143C", 0.2) },
                      }}
                      onClick={handleExtraInputsClose}
                    >
                      <CloseIcon />
                    </Fab>
                  )}
                </Stack>
              </Box>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  height: "50vh",
                  border: 1,
                  borderColor: "#c5cae9",
                  borderRadius: "5px",
                }}
              >
                {messages.map((mess, index, arr) => {
                  return (
                    <Box
                      key={mess.createdAt}
                      sx={{
                        mx: 2,
                        mt: index === 0 ? 4 : 1,
                        mb: index === arr.length - 1 ? 4 : 1,
                        alignSelf: determineYourself(mess.sender)
                          ? "end"
                          : "start",
                        maxWidth: "40%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          alignSelf: determineYourself(mess.sender)
                            ? "end"
                            : "start",
                          mr: 1,
                        }}
                      >
                        {determineYourself(mess.sender) ? "You" : "They"}
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          maxWidth: "100%",
                          backgroundColor: determineYourself(mess.sender)
                            ? "#2196f3"
                            : "#ab003c",
                          color: "white",
                        }}
                      >
                        <Typography sx={{ wordBreak: "break-all" }}>
                          {mess.message}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })}
              </Box>
              <Grid container flexDirection="row" mt={3} spacing={1}>
                <Grid item xs={10}>
                  <TextField
                    inputRef={messageEl}
                    onChange={handleMessageChange}
                    margin="normal"
                    id="message"
                    label="Private Message"
                    name="message"
                    multiline
                    fullWidth
                    rows={5}
                    sx={{ "&.MuiFormControl-root": { m: 0 } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    sx={{ width: "100%", height: "100%" }}
                    disabled={!isMessageValid}
                    onClick={sendMessage}
                  >
                    SEND
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={1}>
            <Divider orientation="vertical" sx={{ width: "50%" }} />
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                my: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Review request history</Typography>

              <Collapse
                in={Boolean(reviewRequest)}
                sx={{ width: "100%", my: 1 }}
              >
                <Alert severity="info">
                  <Typography>
                    <strong>Grade request:</strong> {reviewRequest?.point}
                  </Typography>
                  <Typography sx={{ wordBreak: "break-all" }}>
                    <strong>Reason:</strong> {reviewRequest?.reason}
                  </Typography>
                  {reviewRequest?.createdAt && (
                    <Typography mt={1}>
                      <strong>Created on</strong>{" "}
                      {format(new Date(reviewRequest.createdAt), "PPP")}
                    </Typography>
                  )}
                  {[ROLE.OWNER, ROLE.TEACHER].includes(role) && (
                    <Stack
                      direction="row"
                      justifyContent="center"
                      spacing={2}
                      sx={{ width: "100%", mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          resolveReviewRequest(REVIEW_REQUEST_STATUS.ACCEPTED)
                        }
                      >
                        ACCEPT
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          resolveReviewRequest(REVIEW_REQUEST_STATUS.DENIED)
                        }
                      >
                        DENY
                      </Button>
                    </Stack>
                  )}
                </Alert>
              </Collapse>

              {requests
                .filter((request) => request.id !== reviewRequest?.id)
                .map((request) => {
                  return (
                    <Paper
                      key={request.id}
                      sx={{
                        boxSizing: "border-box",
                        my: 1,
                        p: 2,
                        width: "100%",
                        color: "white",
                        backgroundColor:
                          request.resolveStatus ===
                          REVIEW_REQUEST_STATUS.ACCEPTED
                            ? "#4caf50"
                            : request.resolveStatus ===
                              REVIEW_REQUEST_STATUS.DENIED
                            ? "#f50057"
                            : "#2196f3",
                      }}
                    >
                      <Typography fontWeight="bold">
                        Grade request:{" "}
                        <span style={{ color: "#6B5B95" }}>
                          {request.point}
                        </span>
                      </Typography>
                      <Typography sx={{ wordBreak: "break-all" }}>
                        <strong>Reason:</strong> {request.reason}
                      </Typography>
                      {request.resolveStatus && (
                        <Typography>
                          <strong>Resolved by:</strong>{" "}
                          {request?.resolver?.username}
                        </Typography>
                      )}
                      {request?.createdAt && (
                        <Typography mt={1}>
                          <strong>Created on</strong>{" "}
                          {format(new Date(request.createdAt), "PPP")}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default GradeDetailModal;
