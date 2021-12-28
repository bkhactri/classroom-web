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
  { field: "id", headerName: "ID", width: 150 },
  {
    field: "fullName",
    headerName: "Name",
    width: 200,
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
  let downloadGradeTemplateVisible = useRef(false);

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

        if (grades.length) {
          downloadGradeTemplateVisible.current = true;
        }

        const gradeBoard = await axiosGrade.get(
          `/getGradeBoard/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const gradeSum = grades.reduce((a, c) => {
          return a + +c.point;
        }, 0);

        // Forming columns
        const gradesArray = grades.map((grade) => ({
          field: grade.id,
          headerName: grade.name,
          width: 150,
          type: "number",
          editable: true,
          renderHeader: (params) => (
            <div>
              {grade.name + " / "}
              <strong>{grade.point}</strong>
            </div>
          ),
          valueFormatter: (params) => {
            return `${
              params.value === null || params.value === undefined
                ? ""
                : params.value
            } / ${grade.point}`;
          },
          preProcessEditCellProps: (params) => {
            const hasError =
              Number(params.props.value) > Number(grade.point) ||
              isNaN(params.props.value);
            return { ...params.props, error: hasError };
          },
          gradePercentage: (grade.point / gradeSum) * 10,
          gradePoint: grade.point,
        }));

        const columns = constantColumns.concat(gradesArray).concat({
          field: "total",
          headerName: "Total",
          width: 150,
          type: "number",
        });

        // Forming rows
        const rows = students.map((student) => {
          return {
            id: student.id,
            fullName: student.name,
            ...mapGradeToStudent(student.id, grades, gradeBoard, columns),
          };
        });

        setGradeColumns(columns);
        setGradeRows(rows);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchStudentsGrades();
  }, [classroomId, accessToken]);

  const mapGradeToStudent = (
    studentId,
    gradeStructures,
    gradeBoards,
    columns
  ) => {
    const row = { total: 0 };

    gradeStructures.forEach((gs) => {
      const grade = gradeBoards.find((gb) => {
        return (
          gb.gradeStructureId === gs.id &&
          gb.studentIdentificationId === studentId
        );
      });
      const gradePercentage = columns.find(
        (col) => col.field === gs.id
      )?.gradePercentage;

      if (grade && gradePercentage) {
        row[grade.gradeStructureId] = grade.point;
        row.total += (+grade.point / +gs.point) * gradePercentage;
      }
    });

    row.total = row.total ? row.total.toFixed(2) : null;

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
      .then((resData) => {
        const idList = gradeRows.map((gradeRow) => gradeRow.id);
        const newGradeRows = resData
          .filter((student) => !idList.includes(student[0]))
          .map((student) => {
            return {
              id: student[0],
              fullName: student[1],
            }
          });

        setGradeRows(
          gradeRows
            .map((gradeRow) => {
              const student = resData.find((item) => item[0] === gradeRow.id);

              if (student?.length === 2) {
                gradeRow.fullName = student[1];
              }

              return gradeRow;
            })
            .concat(newGradeRows)
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        inputFileStudentRef.current.files = null;
        inputFileStudentRef.current.value = "";
      });
  };

  const downloadGradeTemplate = () => {
    axiosGrade
      .get(`/template/${classroomId}`, {
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

  const calculateTotal = (id, field, value) => {
    let total = 0;
    const changedRow = gradeRows.find((row) => row.id === id);
    gradeColumns.forEach((col) => {
      if (col.field === field) {
        total += (+value / +col.gradePoint) * col.gradePercentage;
        return;
      }

      if (col.gradePercentage) {
        total +=
          (+changedRow[col.field] / +col.gradePoint) * col.gradePercentage;
      }
    });

    return total;
  };

  const uploadGrade = (resData, gradeStructureId) => {
    setGradeRows(
      gradeRows.map((gradeRow) => {
        const grade = resData.find((item) => item[0] === gradeRow.id);

        if (grade?.length === 2) {
          gradeRow[gradeStructureId] = grade[1];

          const total = calculateTotal(gradeRow.id, gradeStructureId, grade[1]);
          gradeRow.total = total;
        }

        return gradeRow;
      })
    );
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
        const total = calculateTotal(id, field, value);

        setGradeRows(
          gradeRows.map((row) =>
            row.id === id ? { ...row, [field]: value, total } : row
          )
        );

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
      <Paper
        sx={{
          width: "100%",
          height: "90vh",
          "& .Mui-error": {
            color: "crimson",
            bgcolor: "pink",
          },
        }}
      >
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
                  <Button onClick={chooseStudentFile}>Upload Student</Button>
                  {downloadGradeTemplateVisible.current && (
                    <Button onClick={downloadGradeTemplate}>
                      Download Grade Template
                    </Button>
                  )}
                </GridToolbarContainer>
              );
            },
            ColumnMenu: CustomColumnMenuComponent,
          }}
          componentsProps={{
            columnMenu: { uploadGrade },
          }}
        />
      </Paper>
    </Fragment>
  );
};

export default ClassroomGrades;
