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
import GradeBlock from "../../components/Grade/GradeBlock";
import { ExportXLSX } from "../../components/Excel/ExelExporter";
import { Typography } from "@mui/material";
import UserLogo from "../../assets/images/user-logo.png";
import { Box } from "@mui/system";


// Grades where each array is a column
const studentGrades = [
  [
    {
      studentID: 0,
      currentPoint: "",
      status: 'blank',
      gradeStructureId: 0,
      maxPoint: 100
    },
    {
      studentID: 1,
      currentPoint: 17,
      status: 'draft',
      gradeStructureId: 0,
      maxPoint: 100
    }
  ],
  [
    {
      studentID: 0,
      currentPoint: "",
      status: 'blank',
      gradeStructureId: 1,
      maxPoint: 90
    },
    {
      studentID: 1,
      currentPoint: 25,
      status: 'returned',
      gradeStructureId: 1,
      maxPoint: 90
    },
  ]
]

const initialStudents = [
  {
    id: 0,
    fullname: 'Nguyen Van A',
    classroomId: 0
  },
  {
    id: 1,
    fullname: 'Nguyen Thi B',
    classroomId: 0
  }
]

const gradeStructures = [
  {
    id: 0,
    name: "Ex 1",
    maxPoint: 100,
    classroomId: 0
  },
  {
    id: 1,
    name: "Ex 2",
    maxPoint: 90,
    classroomId: 0
  },
]

const addNumber = (n1, n2) => {
  return +n1 + +n2;
}

const ClassroomGrades = () => {
  // eslint-disable-next-line
  const history = useHistory();
  const accessToken = useSelector((state) => state.auth.token);
  // eslint-disable-next-line
  const [students, setStudents] = useState([]);
  // eslint-disable-next-line
  const [gradeRows, setGradeRows] = useState([]);
  const [grades, setGrades] = useState(studentGrades);
  const [isLoading, setIsLoading] = useState(false);
  const { classroomId } = useParams();

  const createTableBody = () => {
    let rows = [];

    students.forEach((student, i) => {
        let row = [];
        row.push(student);
        row.push({
          totalCurrentPoint: 0,
          totalMaxPoint: 0
        })
        grades.forEach(grade => {
          row.push(grade[i]);
          row[1].totalCurrentPoint = addNumber(row[1].totalCurrentPoint, grade[i].currentPoint);
          row[1].totalMaxPoint = addNumber(row[1].totalMaxPoint, grade[i].maxPoint);
          console.log('maxpoint', row[1].totalMaxPoint);
        })
        rows.push(row);
    })
    return rows;
  }

  const tableRows = createTableBody();

  const getGradeStructureFromId = (id) => {
    for (let i = 0; i < gradeStructures.length; i++){
      const structure = gradeStructures[i];
      if (structure['id'] === id){
        return structure;
      }
    }
    return null;
  }

  const setGradeHanler = (rowIndex, gradeStructureIndex) => {
    console.log('previousGrades', grades);
      return (newGrade) => {
        setGrades((previousGrades) => {
          console.log('newGrade', newGrade);
          console.log('previousGrades', previousGrades);
          const newGrades = [...previousGrades];

          console.log('index', rowIndex, gradeStructureIndex);
          
          newGrades[gradeStructureIndex][rowIndex] = newGrade;
          console.log('newGrades', newGrades);

          return newGrades;
        })
      } 
  }


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

        setGrades(studentGrades);
        setStudents(initialStudents);
        setGradeRows(gradeStructures);

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
              {tableRows.map((row, rowIndex) => {
                console.log('tableRows', tableRows);
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row[0].id}
                    style={{
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {row.map((value, index) => {
                      const gradeStructure = getGradeStructureFromId(value['gradeStructureId']);
                      return (
                        <TableCell
                          key={index}
                          style={{
                            width: index === 0 ? 220 : 100,
                            height: 35,
                            textAlign: 'center',
                            borderRight: "1px solid #e0e0e0",
                            position: index === 0 ? "sticky" : "",
                          }}
                        >
                          {
                            index === 0 ?
                            
                            <div style={{display:'flex', alignItems: 'center'}}>
                              <img src={UserLogo} alt="avatar" />
                              <Box ml={2}>
                                <Typography 
                                  variant="p"
                                  gutterBottom
                                  style={{fontWeight:"bold", verticalAlign:'center'}}>
                                  {value.fullname}
                                </Typography>
                              </Box>
                            </div>

                            : index === 1 ?
                            
                            <Typography variant='h6' style={{color:'red'}}>
                              {value.totalCurrentPoint} / {value.totalMaxPoint}
                            </Typography>
                             
                            :

                            <GradeBlock 
                                maxGrade={gradeStructure.maxPoint}
                                currentGrade={value}
                                setGradeHandler={setGradeHanler(rowIndex, index-2)}                              
                              />
                          }
                          
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
