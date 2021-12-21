import { React, useState, useEffect, Fragment, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { DataGridPro, GridToolbarContainer } from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";

import axiosClassroom from "../../api/classroom.axios";
import axiosStudentIdentifcation from "../../api/student-identification.axios";

import { downloadFile } from "../../utils/index";

const columns = [
  { field: "id", headerName: "ID", width: 220 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    width: 150,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    editable: true,
    width: 150,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 11, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 12, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 13, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 14, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 15, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 16, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 17, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 18, lastName: "Lannister", firstName: "Jaime", age: 45 },
];

const ClassroomGrades = () => {
  // eslint-disable-next-line
  const history = useHistory();
  const accessToken = useSelector((state) => state.auth.token);
  // eslint-disable-next-line
  const [students, setStudents] = useState([]);
  // eslint-disable-next-line
  const [gradeRows, setGradeRows] = useState([]);
  // eslint-disable-next-line
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { classroomId } = useParams();
  const inputFileStudentRef = useRef();

  useEffect(() => {
    const fetchStudentsGrades = async () => {
      setIsLoading(true);
      try {
        const classroomStudents = await axiosClassroom.get(
          `/participants?classroomID=${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const classroomGrades = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const students = classroomStudents.data.filter(
          (participant) => participant["role"] === "STUDENT"
        );

        setGrades(classroomGrades.data.grades || []);
        setStudents(students);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchStudentsGrades();
  }, [classroomId, accessToken]);

  // Student Identification
  const downloadStudentTemplate = () => {
    axiosStudentIdentifcation
      .get("/template", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((csvString) => {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

        downloadFile(blob, "student-identification-template.csv");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const chooseStudentFile = () => {
    inputFileStudentRef.current.click();
  };

  const uploadStudentFile = () => {
    const formData = new FormData();
    formData.append("file", inputFileStudentRef.current.files[0]);
    formData.append("classroomId", classroomId);

    axiosStudentIdentifcation
      .post("/upload", formData, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        console.log("upload student complete");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        inputFileStudentRef.current.files = null;
        inputFileStudentRef.current.value = "";
      });
  };

  // console.log(grades, "grades");
  // console.log(students, "students");
  const cellChange = (e) => {
    console.log(e);
  };

  return (
    <Fragment>
      <input
        type="file"
        accept=".csv"
        ref={inputFileStudentRef}
        onChange={uploadStudentFile}
        hidden
      ></input>

      <Header loading={isLoading} classroom={3} classID={classroomId} />
      <Paper sx={{ width: "100%", height: "90vh" }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[rows.length]}
          hideFooterPagination
          hideFooterSelectedRowCount
          hideFooter
          pinnedColumns={{ left: ["id"] }}
          initialState={{ pinnedColumns: { left: ["id"] } }}
          showCellRightBorder
          onCellEditCommit={(e) => cellChange(e)}
          components={{
            Toolbar: () => {
              return (
                <GridToolbarContainer>
                  <Button onClick={downloadStudentTemplate}>
                    Download Template
                  </Button>
                  <Button onClick={chooseStudentFile}>Upload Student</Button>
                </GridToolbarContainer>
              );
            },
          }}
        />
      </Paper>
    </Fragment>
  );
};

export default ClassroomGrades;
