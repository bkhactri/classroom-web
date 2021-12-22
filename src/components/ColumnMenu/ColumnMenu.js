import {
  GridColumnMenuContainer,
  SortGridMenuItems,
} from "@mui/x-data-grid-pro";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import classes from "./ColumnMenu.module.css";
import { useParams } from "react-router-dom";
import axiosGrade from "../../api/grade.axios";

const CustomColumnMenuComponent = (props) => {
  const { classroomId } = useParams();
  const accessToken = useSelector((state) => state.auth.token);
  const { hideMenu, currentColumn, color, ...other } = props;

  const handleColumnFinalized = async () => {
    const gradeId = currentColumn.field;

    try {
      const response = await axiosGrade.put(
        `/finalizedColumn`,
        {
          gradeId: gradeId,
          classroomId: classroomId,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      console.log(response);
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      ownerState={{ color }}
      {...other}
    >
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      {currentColumn.field !== "id" && currentColumn.field !== "fullName" ? (
        <div>
          <li>
            <Button
              className={classes.Button}
              onClick={() => handleColumnFinalized()}
            >
              Finalized
            </Button>
          </li>
          <li>
            <Button className={classes.Button}>Import Grade</Button>
          </li>
          <li>
            <Button className={classes.Button}>Export Column</Button>
          </li>
        </div>
      ) : null}
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenuComponent;
