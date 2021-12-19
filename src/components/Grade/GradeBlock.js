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



const GradeBlock = ({maxGrade, currentGrade, blockState}) => {

  const [status, setStatus] = useState('normal');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickGradeOption = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseGradeOption = () => {
    setAnchorEl(null);
  };

  const [values, setValues] = useState({
    weight: currentGrade
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


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
          <MenuItem onClick={handleCloseGradeOption}>Return</MenuItem>
          <MenuItem onClick={handleCloseGradeOption}>View submission</MenuItem>
        </Menu>
    </div>
  )

  const gradeCell = (cellState) => (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '5vh', maxWidth: '100%' }}
    >
      <Grid item xs={9} style={{textAlign: "right"}}>

        {cellState === 'editing' ? 
          <FormControl variant="standard">
            <Input 
              id="standard-adornment-weight"
              value={values.weight}
              onChange={handleChange('weight')}
              InputProps={{
                inputProps: {
                    style: { textAlign: "right" },
                }
              }}
              style={{textAlign: "center"}}
              endAdornment={<InputAdornment position="end">/ {maxGrade}</InputAdornment>}
              aria-describedby="standard-weight-helper-text"
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </FormControl>
        : <Typography variant="subtitle2" style={{fontWeight:'bold'}}>
            {currentGrade} / {maxGrade}
          </Typography>
        }

        {cellState === 'normal' ? 
          <Typography variant="caption" display="block">
            Not turned in
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
    <>
      {gradeCell(status)}
    </>
  )

}

export default GradeBlock;