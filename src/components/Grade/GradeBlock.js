import { React, useState, useEffect, Fragment } from "react";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



const GradeBlock = ({maxGrade, currentGrade, setGradeHandler}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickGradeOption = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseGradeOption = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    const newGradeValue = event.target.value;
    console.log('handleChange', newGradeValue);
    const newGrade = {...currentGrade, currentPoint: newGradeValue};
    setGradeHandler(newGrade);
  };

  const changeGrade = (propName, newValue) => {
    console.log('status change', newValue);
    const newGrade = {...currentGrade, [propName]: newValue};
    setGradeHandler(newGrade);
  }

  const handleOnClickOnBlock = () => {
    console.log('click on block');
    changeGrade('status', 'editing');
  }
  const handleOnClickReturn = () => {
    changeGrade('status', 'returned');
    handleCloseGradeOption();
  }
  const handleOnBlur = (event, relatedTarget) => {
    console.log('on blur change from', currentGrade.status);
    if (currentGrade.currentPoint !== null && currentGrade.status !== 'returned'){
      changeGrade('status', 'draft');
    } else {
      changeGrade('status', 'blank');
    }
  }




  const gradeOption = (
    <div>
        <IconButton
          id="basic-button"
          aria-controls="basic-menu"
          onClick={handleClickGradeOption}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseGradeOption}

          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}

          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            id='return-menu'
            onClick={handleOnClickReturn}
            onMouseDown={(e) => {e.preventDefault()}}
          >Return</MenuItem>
          <MenuItem onClick={handleCloseGradeOption}>View submission</MenuItem>
        </Menu>
    </div>
  )

  const gradeColor = () => {
    if (currentGrade.status === 'draft'){
      return 'green';
    }
    return 'black';
  }

  const isBlank = () => {
    return currentGrade.status === 'blank' || currentGrade.currentPoint === null;
  }

  const gradeCell = (cellState) => (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '5vh', maxWidth: '100%' }}
    >
      <Grid item xs={9} style={{textAlign: "right"}} onClick={handleOnClickOnBlock}>

        {cellState === 'editing' ? 
          <FormControl variant="standard">
            <Input 
              autoFocus
              id="standard-adornment-weight"
              value={currentGrade.currentPoint}
              onChange={handleChange}
              endAdornment={<InputAdornment position="end">/ {maxGrade}</InputAdornment>}
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                'aria-label': 'weight',
                'style': { textAlign: 'right' }
              }}
              onBlur={handleOnBlur}
            />
          </FormControl>
         : cellState === 'draft' || cellState === 'returned'?
        
          <Typography variant="subtitle2" style=
              {{
                fontWeight:'bold', 
                color: gradeColor()
              }}>

            {currentGrade.currentPoint} / {maxGrade}
          </Typography>

          : null
        }

        {cellState === 'draft' ? 
          <Typography variant="caption" display="block">
            Draft
          </Typography>
        : null
        }

        
      </Grid>
      <Grid item xs={3}>
        {gradeOption}
      </Grid>
    </Grid>
  )

  return (
    <div
    >
      {gradeCell(currentGrade.status)}
    </div>
  )

}

export default GradeBlock;