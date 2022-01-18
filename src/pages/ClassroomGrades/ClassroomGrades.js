import {
  React,
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import Paper from "@mui/material/Paper";
import {
  GridToolbarContainer,
  DataGridPro,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import SettingsIcon from "@mui/icons-material/Settings";

import axiosClassroom from "../../api/classroom.axios";
import axiosGrade from "../../api/grade.axios";
import axiosStudentIdentifcation from "../../api/student-identification.axios";
import axiosGradeRequest from "../../api/grade-request.axios";

import CustomColumnMenuComponent from "../../components/ColumnMenu/ColumnMenu";
import GradeDetailModal from "../../components/Modal/GradeDetailModal";

import { userInfoActions } from "../../stores/userInfoStore";

import { downloadFile } from "../../utils/index";
import { GRADE_STATUS } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const constantColumns = [
  { field: "id", headerName: t("id"), width: 150 },
  {
    field: "fullName",
    headerName: t("name"),
    width: 200,
  },
];

const ClassroomGrades = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.token);
  const [gradeRows, setGradeRows] = useState([]);
  const [gradeColumns, setGradeColumns] = useState([]);
  const [students, setStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [gradeSum, setGradeSum] = useState(null);
  const [gradeRequests, setGradeRequests] = useState([]);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGradeDetailOpen, setGradeDetailOpen] = useState(false);
  const [gradeIds, setGradeIds] = useState({});
  const [additionalInfos, setAdditionalInfos] = useState({});
  const [gradeInfos, setGradeInfos] = useState({});
  const [selectedGrade, setSelectedGrade] = useState({});
  // eslint-disable-next-line
  const [queryParams, setQueryParams] = useSearchParams();
  const { classroomId } = useParams();
  const inputFileStudentRef = useRef();
  let downloadGradeTemplateVisible = useRef(false);

  const currentUrl = window.location.pathname;
  useEffect(() => {
    localStorage.setItem("currentUrl", currentUrl);
  }, [currentUrl]);

  const mapGradeToStudent = useCallback(
    (
      studentId,
      studentName,
      gradeStructures,
      gradeBoards,
      tempGradeRequests,
      columns
    ) => {
      const row = { total: 0 };

      gradeStructures.forEach((gs) => {
        const grade = gradeBoards.find((gb) => {
          return (
            gb.gradeStructureId === gs.id &&
            gb.studentIdentificationId === studentId &&
            gb.classroomId === classroomId
          );
        });
        const gradePercentage = columns.find(
          (col) => col.field === gs.id
        )?.gradePercentage;

        if (gradePercentage) {
          const request = tempGradeRequests.find((r) => {
            return (
              r.gradeStructureId === gs.id &&
              r.studentIdentificationId === studentId &&
              r.classroomId === classroomId
            );
          });

          row[gs.id] = [
            grade?.point || null,
            request ? true : false,
            {
              studentId,
              studentName,
              gradeCreatedAt: grade?.createdAt,
              gradeUpdatedAt: grade?.updatedAt,
            },
          ];

          if (grade) {
            row.total +=
              (Number(grade.point) / Number(gs.point)) * gradePercentage;
          }
        }
      });

      row.total = row.total ? row.total.toFixed(2) : null;

      return row;
    },
    [classroomId]
  );

  const fetchStudentsGrades = useCallback(
    async (tempStudents, tempGradeSum, tempStructures) => {
      setIsLoading(true);
      try {
        const gradeBoard = await axiosGrade.get(
          `/getGradeBoard/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );

        const tempGradeRequests = await axiosGradeRequest.get(
          `/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setGradeRequests(tempGradeRequests);

        // Forming columns
        const gradesArray = tempStructures.map((grade) => ({
          field: grade.id,
          headerName: grade.name,
          width: 250,
          type: "number",
          editable: true,
          renderHeader: (params) => (
            <div>
              {grade.name + " / "}
              <strong>{grade.point}</strong>
            </div>
          ),
          renderCell: (params) => {
            return (
              <Fragment>
                <Typography
                  sx={{
                    color:
                      selectedGrade?.gradeStructureId === grade.id &&
                      selectedGrade?.studentId === params.value?.[2]?.studentId
                        ? "crimson"
                        : "black",
                  }}
                >
                  {params.value?.[0] === null || params.value?.[0] === undefined
                    ? ""
                    : params.value?.[0]}{" "}
                  / {grade.point}
                </Typography>
                <Fab
                  size="small"
                  color={params.value?.[1] ? "primary" : null}
                  sx={{ ml: 1 }}
                  onClick={() =>
                    handleOpenGradeDetail(
                      {
                        classroomId,
                        gradeStructureId: grade.id,
                        studentIdentificationId: params.value?.[2]?.studentId,
                      },
                      {
                        studentId: params.value?.[2]?.studentId,
                        studentName: params.value?.[2]?.studentName,
                        gradeStructureName: grade.name,
                        createdAt: params.value?.[2]?.gradeCreatedAt,
                        updatedAt: params.value?.[2]?.gradeUpdatedAt,
                      },
                      {
                        point: params.value?.[0],
                        total: grade.point,
                      }
                    )
                  }
                >
                  <SettingsIcon />
                </Fab>
              </Fragment>
            );
          },
          preProcessEditCellProps: (params) => {
            const hasError =
              Number(params.props.value) > Number(grade.point) ||
              isNaN(params.props.value);
            return { ...params.props, error: hasError };
          },
          gradePercentage: (grade.point / tempGradeSum) * 10,
          gradePoint: grade.point,
        }));

        const columns = constantColumns.concat(gradesArray).concat({
          field: "total",
          headerName: t("total"),
          width: 150,
          type: "number",
          renderCell: (params) => {
            return <Typography>{params.value}</Typography>;
          },
        });

        // Forming rows
        const rows = tempStudents.map((student) => {
          return {
            id: student.id,
            fullName: student.name,
            ...mapGradeToStudent(
              student.id,
              student.name,
              tempStructures,
              gradeBoard,
              tempGradeRequests,
              columns
            ),
          };
        });

        setGradeColumns(columns);
        setGradeRows(rows);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    },
    [
      accessToken,
      classroomId,
      mapGradeToStudent,
      t,
      selectedGrade?.gradeStructureId,
      selectedGrade?.studentId,
    ]
  );

  useEffect(() => {
    const fetchInfos = async () => {
      setIsLoading(true);
      try {
        const result = await axiosClassroom.get(`/${classroomId}`, {
          headers: { Authorization: "Bearer " + accessToken },
        });
        dispatch(
          userInfoActions.setRole({ role: result.data.participants[0].role })
        );

        const tempStudents = await axiosStudentIdentifcation.get(
          `/getByClass/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setStudents(tempStudents);

        const gradeStructures = await axiosGrade.get(
          `/structure/${classroomId}`,
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        setStructures(gradeStructures);

        if (gradeStructures.length) {
          downloadGradeTemplateVisible.current = true;
        }

        const tempGradeSum = gradeStructures.reduce((a, c) => {
          return a + Number(c.point);
        }, 0);
        setGradeSum(tempGradeSum);

        fetchStudentsGrades(tempStudents, tempGradeSum, gradeStructures);

        const tempSelectedGrade = {
          gradeStructureId: queryParams.get("gradeStructureId"),
          studentId: queryParams.get("studentId"),
        };
        setSelectedGrade(tempSelectedGrade);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchInfos();
  }, [
    classroomId,
    accessToken,
    dispatch,
    fetchStudentsGrades,
    queryParams,
  ]);

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
            };
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
        total += (Number(value) / Number(col.gradePoint)) * col.gradePercentage;
        return;
      }

      if (col.gradePercentage) {
        total +=
          (Number(changedRow[col.field]?.[0]) / Number(col.gradePoint)) *
          col.gradePercentage;
      }
    });

    return total.toFixed(2);
  };

  const uploadGrade = (resData, gradeStructureId) => {
    const gradeStructure = structures.find((gs) => gs.id === gradeStructureId);

    setGradeRows(
      gradeRows.map((gradeRow) => {
        const grade = resData.find((item) => item[0] === gradeRow.id);

        if (grade?.length === 2 && grade[1] <= gradeStructure.point) {
          const requestOpen = gradeRow[gradeStructureId]?.[1];
          const requestInfo = gradeRow[gradeStructureId]?.[2];

          gradeRow[gradeStructureId] = [grade[1], requestOpen, requestInfo];

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
          status: GRADE_STATUS.DRAFT,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      if (response) {
        const total = calculateTotal(id, field, value);

        setGradeRows(
          gradeRows.map((row) => {
            const requestOpen = gradeRequests.find(
              (gr) =>
                gr.studentIdentificationId === id &&
                gr.gradeStructureId === field
            );
            const student = students.find((st) => st.id === id);

            return row.id === id
              ? {
                  ...row,
                  [field]: [
                    value.toFixed(2),
                    requestOpen ? true : false,
                    {
                      studentId: id,
                      studentName: student.name,
                      gradeCreatedAt: response?.createdAt,
                      gradeUpdatedAt: response?.updatedAt,
                    },
                  ],
                  total,
                }
              : row;
          })
        );

        setSnackBarMessage(`${t("classroom.addEditGradeFor")} ${id}`);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleCloseSnackBar = () => setSnackBarMessage("");

  const handleCloseGradeDetailModal = () => {
    setGradeDetailOpen(false);
    fetchStudentsGrades(students, gradeSum, structures);
  };

  const handleOpenGradeDetail = (
    tempGradeIds,
    tempAdditionalInfos,
    tempGradeInfos
  ) => {
    setGradeIds(tempGradeIds);
    setAdditionalInfos(tempAdditionalInfos);
    setGradeInfos(tempGradeInfos);
    setGradeDetailOpen(true);
  };

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
          disableSelectionOnClick
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
                    {t("classroom.downloadStudentTemplate")}
                  </Button>
                  <Button onClick={chooseStudentFile}>
                    {t("classroom.uploadStudent")}
                  </Button>
                  {downloadGradeTemplateVisible.current && (
                    <Button onClick={downloadGradeTemplate}>
                      {t("classroom.downloadGradeTemplate")}
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

      {isGradeDetailOpen && (
        <GradeDetailModal
          gradeId={gradeIds}
          additionalInfos={additionalInfos}
          grade={gradeInfos}
          isOpen={isGradeDetailOpen}
          handleClose={handleCloseGradeDetailModal}
        />
      )}
    </Fragment>
  );
};

export default ClassroomGrades;
