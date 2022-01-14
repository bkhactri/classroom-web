import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { React, useEffect, useState, forwardRef } from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { useSelector } from "react-redux";
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import axiosUser from '../../api/user.axios';
import { useNavigate } from 'react-router';
import moment from 'moment';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

function createData(studentID, email, username, createAt, status, role, id) {
  return {
    studentID,
    email,
    username,
    createAt,
    status,
    role,
    id
  };
}

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


const headCells = [
  {
    id: 'studentID',
    numeric: false,
    disablePadding: true,
    label: 'Student ID',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'username',
    numeric: false,
    disablePadding: false,
    label: 'Username',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all users',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          User
        </Typography>
      )}

      {numSelected > 0 ? (
        <Box display="inline-flex">
          <Tooltip title="Unban">
            <IconButton>
              <LockOpenIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ban">
            <IconButton>
              <BlockIcon />
            </IconButton>
          </Tooltip>

        </Box>
        
      ) : (
        null
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminUsers() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const accessToken = useSelector((state) => state.auth.token);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [confirmationDialog, setConfirmationDialog] = useState("");
  const [banUserSelected, setBanUserSelected] = useState({});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [isBanClicked, setIsBanClicked] = useState(false);


  const navigateToUserPage = (userID) => {
    navigate(`/userDetail/${userID}`);
  }

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleConfirm = async () => {
    if (isBanClicked === false){
      handleConfirmAdmin();
    } else {
      handleConfirmBan();
    }
  }

  const handleConfirmBan = async () => {   
    console.log("banUserSelected", banUserSelected);
    const userID = banUserSelected.id;
    const newBanStatus = !banUserSelected.isBan;
    await axiosUser.put(
      "/updateBanStatus",
      {
        userID,
        newBanStatus,
      },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const newUser = {...banUserSelected, isBan: newBanStatus};
    updateUser(newUser);

    setOpenConfirmation(false);
  };

  const handleConfirmAdmin = async () => {
    console.log('userselected', banUserSelected);
    const userID = banUserSelected.id;

    const newAdminStatus = banUserSelected.role === "ADMIN" ? "NORMAL" : "ADMIN";
    
    await axiosUser.put(
      "/updateAdminStatus",
      {
        userID,
        newAdminStatus,
      },
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );

    const newUser = {...banUserSelected, role: newAdminStatus};
    updateUser(newUser);

    setOpenConfirmation(false);
  };

  const handleClickOpenBanConfirmation = (dialog, user) => {
    setIsBanClicked(true);
    setOpenConfirmation(true);
    setBanUserSelected(user);
    setConfirmationDialog(dialog);
  };

  const handleClickOpenAdminConfirmation = (dialog, user) => {
    setIsBanClicked(false);
    setOpenConfirmation(true);
    setBanUserSelected(user);
    setConfirmationDialog(dialog);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axiosUser.get(`/getAllUsers`, {
          headers: { Authorization: "Bearer " + accessToken },
        });

        function compare( a, b ) {
          if ( a.email < b.email ){
            return -1;
          }
          if ( a.email > b.email ){
            return 1;
          }
          return 0;
        }
        
        result.sort( compare );
        
        setUsers(result);
      } catch (error) {
        navigate("/");
      }

      return () => {
        setUsers([]);
      };
    };

    fetchUsers();
    
  }, [accessToken, navigate])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const calculateUsers = (users) => {
    let userRows = [];
    users.forEach(user => {
      let status = <LockOpenIcon 
          style={{fill: "green"}} 
          onClick={() => handleClickOpenBanConfirmation("Ban user?", user)}/>;
      if (user.isBan){
        status = <BlockIcon 
            style={{fill: "red"}} 
            onClick={() => handleClickOpenBanConfirmation("Unban user?", user)}/>;
      }

      let role = <PersonIcon 
                  style={{fill: "green"}} 
                  onClick={() => handleClickOpenAdminConfirmation("Promote this user to Admin?", user)}
                />;
      if (user.role === "ADMIN"){
        role = <AdminPanelSettingsIcon 
            style={{fill: "blue"}} 
            onClick={() => handleClickOpenAdminConfirmation("Demote this user to a normal user?", user)}
          />;
      }

      const createdAt = moment(user.createdAt).format('L');

      userRows.push(createData(
        user.studentId, user.email, user.username, createdAt, status, role, user.id
      ));
    })
    return userRows;
  }

  const rows = calculateUsers(users);

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const updateUser = (newUser) => {

    let updatedUsers = users.map(user => 
      {
        if (user.id === newUser.id){
          return newUser;
        }
        return user;
      });

    setUsers(updatedUsers);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>

      <Dialog
        open={openConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirmation}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{confirmationDialog}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Close</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.email);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.email)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.email}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.studentID}
                      </TableCell>
                        <TableCell align="left"
                          onClick={() => navigateToUserPage(row.id)}
                        >
                          {row.email}
                        </TableCell>
                        <TableCell align="left">{row.username}</TableCell>
                        <TableCell align="left">{row.createAt}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">{row.role}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}