import { React, useState, useRef, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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

import Loading from "../Loading/Loading";

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
  const currentLanguageCode = localStorage.getItem("language") || "vi-VN";
  const { t: translation } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.userInfo.role);
  const userId = useSelector((state) => state.userInfo.userId);
  const [isLoading, setIsLoading] = useState(false);
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
    if (
      !gradeId?.classroomId ||
      !gradeId?.gradeStructureId ||
      !gradeId?.studentIdentificationId
    ) {
      return;
    }

    setIsLoading(true);

    const fetchRequests = async () => {
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

    const fetchMessages = async () => {
      try {
        const tempMessages = await axiosGradeRequest.get(
          `/message/${gradeId?.classroomId}/${gradeId?.gradeStructureId}/${gradeId?.studentIdentificationId}`,
          { headers: { Authorization: "Bearer " + accessToken } }
        );

        let currentSenderId = tempMessages?.[0].sender.id;
        setMessages(tempMessages.map((message, index) => {
          if (index === 0 || currentSenderId !== message.sender.id) {
            message.willDisplayName = true;
          } else {
            message.willDisplayName = false;
          }

          return message;
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();

    setIsLoading(false);
  }, [
    accessToken,
    gradeId?.classroomId,
    gradeId?.gradeStructureId,
    gradeId?.studentIdentificationId,
  ]);

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
  };

  const handleMessageChange = (event) => {
    setMessageValid(Boolean(event.target.value?.length));
  };

  const createReviewRequest = () => {
    if (!isGradeValid || !isReasonValid) {
      return;
    }

    setIsLoading(true);

    Swal.fire({
      title: translation("gradeDetail.creatingRequestConfirm1"),
      showCancelButton: true,
      confirmButtonText: translation("confirm"),
      cancelButtonText: translation("cancel"),
      html:
        `<p>${translation("gradeDetail.creatingRequestConfirm2")}</p>` +
        `<p>${translation("gradeDetail.creatingRequestConfirm3")}</p>`,
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

            setIsLoading(false);
            // NOTIFICATION NEEDED
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      }

      setIsLoading(false);
    });
  };

  const editGrade = (point = null) => {
    if (!isGradeValid && !point) {
      return;
    }

    setIsLoading(true);

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

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const resolveReviewRequest = (status) => {
    if (!Boolean(reviewRequest)) {
      return;
    }

    setIsLoading(true);

    Swal.fire({
      title: `${
        status === REVIEW_REQUEST_STATUS.ACCEPTED ? translation("gradeDetail.accept") : translation("gradeDetail.deny")
      } ${translation("gradeDetail.gradeReviewRequest")}`,
      showCancelButton: true,
      confirmButtonText: translation("confirm"),
      cancelButtonText: translation("cancel"),
      text: translation("gradeDetail.resolveRequestConfirm"),
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

            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      }

      setIsLoading(false);
    });
  };

  const sendMessage = () => {
    if (!Boolean(messageEl.current.value?.length)) {
      return;
    }
    console.log("huh,", { privateMessage: messageEl.current.value });

    setIsLoading(true);

    axiosGradeRequest
      .post(
        `/message/${gradeId?.classroomId}/${gradeId?.gradeStructureId}/${gradeId?.studentIdentificationId}`,
        { privateMessage: messageEl.current.value },
        { headers: { Authorization: "Bearer " + accessToken } }
      )
      .then((resultPrivateMessage) => {
        if (
          messages[messages.length - 1]?.sender?.id !==
          resultPrivateMessage?.sender?.id || messages.length === 0
        ) {
          resultPrivateMessage.willDisplayName = true;
        } else {
          resultPrivateMessage.willDisplayName = false;
        }
        setMessages(messages.concat(resultPrivateMessage));
        messageEl.current.value = "";

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const determineYourself = (senderId) => {
    return senderId === userId;
  };

  const formatDate = (date) => {
    return format(new Date(date), currentLanguageCode === "vi-VN" ? "dd/MM/yyyy" : "PPP");
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ zIndex: 1402 }}
    >
      <Container maxWidth="lg" component={Card} sx={{ my: 5 }}>
        {isLoading && <Loading isOverlay={true} />}

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
                  {additionalInfos?.createdAt && additionalInfos?.updatedAt && (
                    <Fragment>
                      <FiberManualRecordIcon sx={{ fontSize: "0.75em" }} />{" "}
                      {formatDate(additionalInfos?.createdAt)}{" "}
                      ({translation("gradeDetail.edited") + " "}
                      {formatDate(additionalInfos?.updatedAt)})
                    </Fragment>
                  )}
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
                      label={translation("gradeDetail.reasonLabel")}
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
                          ? translation("gradeDetail.extraInputsTooltipError")
                          : [ROLE.OWNER, ROLE.TEACHER].includes(role)
                          ? translation("gradeDetail.extraInputsTooltipTeacher")
                          : translation("gradeDetail.extraInputsTooltipStudent")
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
                    <Tooltip arrow title={translation("gradeDetail.addReviewRequest")}>
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
                      <Tooltip arrow title={translation("gradeDetail.saveGrade")}>
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
                        alignSelf: determineYourself(mess.senderId)
                          ? "end"
                          : "start",
                        maxWidth: "40%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {mess?.willDisplayName && (
                        <Typography
                          sx={{
                            alignSelf: determineYourself(mess.senderId)
                              ? "end"
                              : "start",
                            mr: 1,
                          }}
                        >
                          {determineYourself(mess.senderId)
                            ? translation("you")
                            : mess.sender?.username}
                        </Typography>
                      )}

                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: "10px",
                          maxWidth: "100%",
                          backgroundColor: determineYourself(mess.senderId)
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
                    label={translation("gradeDetail.privateMessageLavel")}
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
                    {translation("gradeDetail.SEND")}
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
              <Typography variant="h6">{translation("gradeDetail.reviewRequestHistory")}</Typography>

              <Collapse
                in={Boolean(reviewRequest)}
                sx={{ width: "100%", my: 1 }}
              >
                <Alert severity="info">
                  <Typography>
                    <strong>{translation("gradeDetail.gradeRequested")}:</strong> {reviewRequest?.point}
                  </Typography>
                  <Typography sx={{ wordBreak: "break-all" }}>
                    <strong>{translation("gradeDetail.reasonLabel")}:</strong> {reviewRequest?.reason}
                  </Typography>
                  {reviewRequest?.createdAt && (
                    <Typography mt={1}>
                      <strong>{translation("gradeDetail.createdOn")}</strong>{" "}
                      {formatDate(reviewRequest.createdAt)}
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
                        {translation("gradeDetail.ACCEPT")}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          resolveReviewRequest(REVIEW_REQUEST_STATUS.DENIED)
                        }
                      >
                        {translation("gradeDetail.DENY")}
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
                        {translation("gradeDetail.gradeRequested")}:{" "}
                        <span style={{ color: "#6B5B95" }}>
                          {request.point}
                        </span>
                      </Typography>
                      <Typography sx={{ wordBreak: "break-all" }}>
                        <strong>{translation("gradeDetail.reasonLabel")}:</strong> {request.reason}
                      </Typography>
                      {request.resolveStatus && (
                        <Typography>
                          <strong>{translation("gradeDetail.resolvedBy")}:</strong>{" "}
                          {request?.resolver?.username}
                        </Typography>
                      )}
                      {request?.createdAt && (
                        <Typography mt={1}>
                          <strong>{translation("gradeDetail.createdOn")}</strong>{" "}
                          {formatDate(request.createdAt)}
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
