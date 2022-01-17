import { useState } from "react";
import { useSelector } from "react-redux";

import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

import axiosMail from "../../api/mail.axios";
import { validateEmail } from "../../validators/fieldValidator";

const InviteEmailModal = ({ isOpen, handleClose, classroom, type }) => {
  const { t } = useTranslation();
  const accessToken = useSelector((state) => state.auth.token);
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [isFieldValid, setFieldValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setFieldValid(!!event.target.value);
    setInputEmail(event.target.value);
  };

  const addEmail = () => {
    if (emails.some((email) => inputEmail === email)) {
      setErrorMessage("Duplicate email");
      setFieldValid(false);
    } else if (!validateEmail(inputEmail)) {
      setErrorMessage("Not an email");
      setFieldValid(false);
    } else {
      setErrorMessage("");
      setEmails(emails.concat(inputEmail));
      setInputEmail("");
      setFieldValid(false);
    }
  };

  const removeEmail = (email) => {
    setEmails(emails.filter((e) => email !== e));
  };

  const sendMail = () => {
    setLoading(true);

    axiosMail
      .post(
        `/${type.toLowerCase()}`,
        {
          classroomId: classroom.id,
          classCode: classroom.classCode,
          emails,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      )
      .then(() => handleClose())
      .catch((err) => {
        console.error("err=>", err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (isLoading) return;
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      component={Box}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container
        component={Card}
        maxWidth="sm"
        sx={{
          display: "flex",
          height: "75vh",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" mt={5}>
          {t("invite")}{" "}
          {type === "TEACHER" ? t("classroom.teacher") : t("classroom.student")}
        </Typography>

        <Collapse in={!!errorMessage}>
          <Alert severity="error" variant="filled" sx={{ my: 1 }}>
            {errorMessage}
          </Alert>
        </Collapse>

        <Grid container sx={{ mb: 3 }}>
          <Grid item xs>
            <TextField
              fullWidth
              label={t("auth.emailAddress")}
              variant="standard"
              value={inputEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item sx={{ alignSelf: "center" }}>
            <Button onClick={addEmail} disabled={!isFieldValid}>
              {t("add")}
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: "80%" }}>
          <Table>
            <TableBody>
              {emails.map((email) => {
                return (
                  <TableRow hover key={email}>
                    <TableCell>
                      <Typography>{email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => removeEmail(email)}>
                        {t("delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          sx={{ mt: "auto", mb: 3 }}
          fullWidth
          variant="contained"
          color="success"
          disabled={emails.length === 0 || isLoading}
          onClick={sendMail}
        >
          {isLoading && <CircularProgress color="success" size={25} />}
          &nbsp; {t("sendInviteMail")}
        </Button>
      </Container>
    </Modal>
  );
};

export default InviteEmailModal;
