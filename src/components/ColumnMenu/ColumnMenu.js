import {
  GridColumnMenuContainer,
  SortGridMenuItems,
} from "@mui/x-data-grid-pro";
import Button from "@mui/material/Button";
import classes from "./ColumnMenu.module.css";

const CustomColumnMenuComponent = (props) => {
  const { hideMenu, currentColumn, color, ...other } = props;
  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      ownerState={{ color }}
      {...other}
    >
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      <li>
        <Button className={classes.Button}>Finalized</Button>
      </li>
      <li>
        <Button className={classes.Button}>Import Grade</Button>
      </li>
      <li>
        <Button className={classes.Button}>Export Column</Button>
      </li>
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenuComponent;
