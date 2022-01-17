import { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  GridColumnMenuContainer,
  SortGridMenuItems,
} from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import classes from "./ColumnMenu.module.css";
import { downloadFile } from "../../utils/index";
import { useTranslation } from "react-i18next";
import axiosGrade from "../../api/grade.axios";
import Swal from "sweetalert2";

const CustomColumnMenuComponent = (props) => {
  const { t } = useTranslation();
  const { classroomId } = useParams();
  const accessToken = useSelector((state) => state.auth.token);
  const { hideMenu, currentColumn, color, uploadGrade, ...other } = props;

  const handleColumnFinalized = async () => {
    const gradeId = currentColumn.field;

    try {
      await axiosGrade.put(
        `/finalizedColumn`,
        {
          gradeId: gradeId,
          classroomId: classroomId,
        },
        {
          headers: { Authorization: "Bearer " + accessToken },
        }
      );

      Swal.fire({
        title: t("success"),
        text: t("notice.completedFinalizedGrade"),
        icon: "success",
      });

      // NOTIFICATION NEEDED
    } catch (err) {
      throw new Error(err);
    }
  };
  const inputFileGradeRef = useRef();

  const chooseGradeFile = () => {
    inputFileGradeRef.current.click();
  };

  const uploadGradeFile = () => {
    const formData = new FormData();
    formData.append("file", inputFileGradeRef.current.files[0]);
    formData.append("classroomId", classroomId);
    formData.append("gradeStructureId", currentColumn.field);

    axiosGrade
      .post("/upload", formData, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resData) => {
        uploadGrade(resData, currentColumn.field);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        inputFileGradeRef.current.files = null;
        inputFileGradeRef.current.value = "";
      });
  };

  const exportColumn = () => {
    axiosGrade
      .get(`/export/${classroomId}/${currentColumn.field}`, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((csvString) => {
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

        downloadFile(blob, `${currentColumn.headerName}-grades.csv`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      ownerState={{ color }}
      {...other}
    >
      <input
        type="file"
        accept=".csv"
        ref={inputFileGradeRef}
        onChange={uploadGradeFile}
        hidden
      />
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      {!["id", "fullName", "total"].includes(currentColumn.field) ? (
        <div>
          <li>
            <Button className={classes.Button} onClick={chooseGradeFile}>
              {t("classroom.importGrade")}
            </Button>
          </li>
          <li>
            <Button className={classes.Button} onClick={exportColumn}>
              {t("classroom.exportGrade")}
            </Button>
          </li>
          <li>
            <Button
              className={classes.Button}
              onClick={() => handleColumnFinalized()}
            >
              {t("classroom.finalized")}
            </Button>
          </li>
        </div>
      ) : null}
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenuComponent;
