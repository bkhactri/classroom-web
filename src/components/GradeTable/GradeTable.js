import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Fab from "@mui/material/Fab";
import GradingIcon from "@mui/icons-material/Grading";
import FunctionsIcon from "@mui/icons-material/Functions";

import { GRADE_STATUS } from "../../utils/constants";

const GradeTable = ({ myGrades, gradeTotal, clickable }) => {
  return (
    <TableContainer>
      <Table>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "70%" }} />
        </colgroup>
        <TableBody>
          {myGrades.map((myGrade) => {
            return (
              <TableRow
                hover={clickable}
                key={myGrade.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: clickable ? "pointer" : "default",
                }}
              >
                <TableCell>
                  <Fab
                    color="primary"
                    disabled={myGrade.status !== GRADE_STATUS.FINALIZED}
                    sx={{ pointerEvents: "none" }}
                  >
                    <GradingIcon />
                  </Fab>
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      myGrade.status === GRADE_STATUS.FINALIZED
                        ? "black"
                        : "gray"
                    }
                  >
                    {myGrade.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={
                      myGrade.status === GRADE_STATUS.FINALIZED
                        ? "primary"
                        : "gray"
                    }
                  >
                    {myGrade.point} <strong>/ {myGrade.total}</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell>
              <Fab sx={{ backgroundColor: "crimson", pointerEvents: "none" }}>
                <FunctionsIcon sx={{ color: "white" }} />
              </Fab>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontWeight: "bold", color: "crimson" }}>
                TOTAL
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ color: "crimson" }}>
                {gradeTotal} <strong>/ 10.00</strong>
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GradeTable;
