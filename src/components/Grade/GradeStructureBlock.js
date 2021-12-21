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
import Divider from '@mui/material/Divider';
import { Box } from "@mui/system";




const GradeStructureBlock = ({gradeStructure, returnAllGrades}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickGradeOption = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseGradeOption = () => {
    setAnchorEl(null);
  };

  const handleOnClickReturn = () => {
    returnAllGrades();
    handleCloseGradeOption();
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
          >Return</MenuItem>
          <MenuItem onClick={handleCloseGradeOption}>View submission</MenuItem>
        </Menu>
    </div>
  )

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '5vh', maxWidth: '100%' }}
    >
      <Grid item xs={9} style={{textAlign: "left"}}>
        <div>
            <Typography variant="caption" display="block" gutterBottom>
                No due date
            </Typography>

            <Typography variant="h6" display="block" gutterBottom style={{color: 'blue'}}>
                {gradeStructure.name}
            </Typography>
            
            <Box mb={1}>
              <Divider />
            </Box>

            <Typography variant="caption" display="block" gutterBottom>
                out of {gradeStructure.maxPoint}
            </Typography>
        </div>

      </Grid>
      <Grid item xs={3}>
        {gradeOption}
      </Grid>
    </Grid>
  )

}

export default GradeStructureBlock;