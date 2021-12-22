import { React, useState, useEffect, Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Paper from "@mui/material/Paper";
import {
  GridToolbarContainer,
  DataGridPro,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
// import axiosClassroom from "../../api/classroom.axios";
import axiosGrade from "../../api/grade.axios";
import axiosStudentIdentifcation from "../../api/student-identification.axios";
import { downloadFile } from "../../utils/index";
import CustomColumnMenuComponent from "../../components/ColumnMenu/ColumnMenu";

const constantColumns = [
  { field: "id", headerName: "ID", width: 80 },
  {
    field: "fullName",
    headerName: "Name",
    width: 150,
  },
];

const ClassroomGrades = () => {
  const accessToken = useSelector((state) => state.auth.token);
  const [gradeRows, setGradeRows] = useState([]);
  const [gradeColumns, setGradeColumns] = useState([]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { classroomId } = useParams();
  const inputFileStudentRef = useRef();

  useEffect(() => {
    const fetchStudentsGrades = async () => {
      setIsLoading(true);
      try {
        const students = await axiosStudentIdentifcation.get(
          `/getByClass/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const grades = await axiosGrade.get(`/structure/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        const gradeBoard = await axiosGrade.get(
          `/getGradeBoard/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const gradesArray = grades.map((grade) => ({
          field: grade.id,
          headerName: `${grade.name} / ${grade.point}`,
          width: 150,
          type: "number",
          editable: true,
        }));

        const gradeColumns = constantColumns.concat(gradesArray);

        const gradeRows = students.map((student) => {
          return {
            id: student.id,
            fullName: student.name,
            ...mapGradeToStudent(student.id, grades, gradeBoard),
          };
        });

        setGradeColumns(gradeColumns);
        setGradeRows(gradeRows);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchStudentsGrades();
  }, [classroomId, accessToken]);

  const mapGradeToStudent = (studentId, gradeStructures, gradeBoards) => {
    const row = {};
    gradeStructures.forEach((gs) => {
      const grade = gradeBoards.find((gb) => {
        return (
          gb.gradeStructureId === gs.id &&
          gb.studentIdentificationId === studentId
        );
      });

      if (grade) {
        row[grade.gradeStructureId] = grade.point;
      }
    });

    return row;
  };

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

  const uploadStudentFile = async () => {
    const formData = new FormData();
    formData.append("file", inputFileStudentRef.current.files[0]);
    formData.append("classroomId", classroomId);

    await axiosStudentIdentifcation
      .post("/upload", formData, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        inputFileStudentRef.current.files = null;
        inputFileStudentRef.current.value = "";
      });

    const students = await axiosStudentIdentifcation.get(
      `/getByClass/${classroomId}`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const grades = await axiosGrade.get(`/structure/${classroomId}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const gradeBoard = await axiosGrade.get(`/getGradeBoard/${classroomId}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const tempGradeRows = students.map((student) => {
      return {
        id: student[0],
        fullName: student[1],
        ...mapGradeToStudent(student.id, grades, gradeBoard),
      };
    });

    setGradeRows(tempGradeRows);
  };

  const downloadGradeTemplate = () => {
    axiosGrade
      .get("/template", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((csvString) => {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

        downloadFile(blob, "grade-template.csv");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCellChange = async (event) => {
    const { id, field, value } = event;

    try {
      const response = await axiosGrade.post(
        "/gradeDraftSingleCell",
        {
          studentId: id,
          gradeId: field,
          gradePoint: value,
          classroomId: classroomId,
          status: "DRAFT",
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      if (response) {
        setSnackBarMessage(`Add grade in for ${id}`);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleCloseSnackBar = () => setSnackBarMessage("");

  return (
    <Fragment>
      <Snackbar
        open={Boolean(snackBarMessage)}
        autoHideDuration={5000}
        onClose={handleCloseSnackBar}
        message={snackBarMessage}
      />
      <input
        type="file"
        accept=".csv"
        ref={inputFileStudentRef}
        onChange={uploadStudentFile}
        hidden
      />
      <Header loading={isLoading} classroom={3} classID={classroomId} />
      <Paper sx={{ width: "100%", height: "90vh" }}>
        <DataGridPro
          rows={gradeRows}
          columns={gradeColumns}
          rowsPerPageOptions={[gradeRows.length]}
          hideFooterPagination
          hideFooterSelectedRowCount
          hideFooter
          pinnedColumns={{ left: ["id", "fullName"] }}
          initialState={{ pinnedColumns: { left: ["id", "fullName"] } }}
          showCellRightBorder
          onCellEditCommit={(e) => onCellChange(e)}
          components={{
            Toolbar: () => {
              return (
                <GridToolbarContainer>
                  <GridToolbarExport />
                  <Button onClick={downloadStudentTemplate}>
                    Download Student Template
                  </Button>
                  <Button onClick={downloadGradeTemplate}>
                    Download Grade Template
                  </Button>
                  <Button onClick={chooseStudentFile}>Upload Student</Button>
                </GridToolbarContainer>
              );
            },
            ColumnMenu: CustomColumnMenuComponent
          }}
        />
      </Paper>
    </Fragment>
  );
};

export default ClassroomGrades;
