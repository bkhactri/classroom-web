import { React, useState, useEffect, Fragment } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import axiosClassroom from "../../api/classroom.axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const columns = [
  { id: "name", label: "Name" },
  { id: "code", label: "ISO\u00a0Code" },
  {
    id: "population",
    label: "Population",
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354),
  createData("China", "CN", 1403500365),
  createData("Italy", "IT", 60483973),
  createData("India", "IN", 1324171354),
];

const ClassroomGrades = () => {
  const history = useHistory();
  const accessToken = useSelector((state) => state.auth.token);
  const [students, setStudents] = useState([]);
  const [gradeRows, setGradeRows] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { classroomId } = useParams();

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

  return (
    <Fragment>
      <Header loading={isLoading} classroom={3} classID={classroomId} />
      <Paper sx={{ width: "100%", boxShadow: "none" }}>
        <TableContainer sx={{ maxHeight: "90vh" }}>
          <Table stickyHeader sx={{ width: "100%" }}>
            <TableHead>
              <TableRow
                style={{
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <TableCell
                  style={{
                    width: 220,
                    height: 60,
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Grid container flexDirection="column">
                    <Grid
                      item
                      component={Button}
                      sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    >
                      <FileUploadIcon />
                      &nbsp; Upload List
                    </Grid>

                    <Grid
                      item
                      component={Button}
                      sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                    >
                      <FileDownloadIcon />
                      &nbsp; Download List
                    </Grid>
                  </Grid>
                </TableCell>
                {grades.map((grade) => (
                  <TableCell
                    key={grade.name}
                    style={{
                      width: 100,
                      height: 60,
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    {grade.name}
                  </TableCell>
                ))}
                <TableCell style={{ position: "sticky" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.code}
                    style={{
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            width: index === 0 ? 220 : 100,
                            height: 35,
                            borderRight: "1px solid #e0e0e0",
                            position: index === 0 ? "sticky" : "",
                          }}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell style={{ position: "relative" }}></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Fragment>
  );
};

export default ClassroomGrades;
