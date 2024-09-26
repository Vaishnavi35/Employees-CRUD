import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useFetchAPI } from '../customHooks/useFetchAPI';
import { Button, Dialog } from '@mui/material';
import { GlobalDialog } from '../General/GlobalDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export const EmployeeTable = ({setUpdateEmployee,employeeupdate}) => {
    const {fetchData,loading} = useFetchAPI();
    const param = {
        url: '/employees',
        method: 'GET'
    };
    const [employeesList, setEmployeesList] = useState([]);
    const headers = ['S.No','Name','View','Update','Delete'];
    const [employee, setEmployee] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState(0);

    useEffect(() => {
        fetchDataCall();
    },[employeeupdate]);

    async function fetchDataCall(){
      const response = await fetchData(param);
      setEmployeesList(response?.data || []);
    }
      
  const showDetails = (employee) => {
    console.log('employee:', employee);
    setOpenEmployeeModal(true);
    setEmployee(employee);
  }

  const updateDetails = (employee) => {
    setUpdateEmployee(employee);
  }

  const deleteEmployeeFn = async (id) => {
      let param = {
        data: id, 
        method: 'DELETE',
        url: `/employees/${id}`,
      };
      const response = await fetchData(param);
      fetchDataCall();
      tostifyNotification('Employee deleted successfully.', 'success');
  }

  const tostifyNotification = (msg, type = 'info') => {
    switch (type) {
        case 'success':
            toast.success(msg, {
              toastId: new Date(),
              autoClose: 3000,});
            break;
        case 'error':
            tostifyNotification(msg);
            break;
        case 'warn':
            toast.warn(msg);
            break;
        default:
            toast.info(msg);
            break;
    }
};

  const handleClose = () => {
    setOpenEmployeeModal(false);
  };

  const openDDeleteEmployeeDialog = (id) => {
    setOpenDeleteDialog(true);
    setDeleteEmployee(id);
  };

  const handleCloseGlobalDialog = (type) => {
      setOpenDeleteDialog(false);
      if(type === 'delete_employee') {
        deleteEmployeeFn(deleteEmployee);
      }
  };

  return (
    <>
    <h4>Employees Details Table</h4>
    {
      employeesList && employeesList.length > 0 && (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            {
              headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))
            }
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <p>Loading...</p>}
            {employeesList.map((row,index) => (
              <TableRow
                key={row.employeeID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell><Button variant="contained" color="primary" onClick={(e) => showDetails(row)}>View</Button></TableCell>
                <TableCell><Button variant="contained" color="secondary" onClick={(e) => updateDetails(row.id)}>Update</Button></TableCell>
                <TableCell><Button variant="contained" color="error"  onClick={(e) => openDDeleteEmployeeDialog(row.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )
    }
    {
      employee && Object.keys(employee).length > 0 &&
      <Dialog open={openEmployeeModal}>
        <div className='space-btw p-16'>
            <h4 className='m0'>{employee.name}'s Details</h4>
            <div onClick={handleClose} className='cp'>X</div>
        </div>
        <div className='center gap-16 p-16'>
            <div>
                <div>Name</div>
                <div>Employee ID</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Role</div>
            </div>
            <div>
                <div>{employee.name}</div>
                <div>{employee.employeeID}</div>
                <div>{employee.email}</div>
                <div>{employee.mobile}</div>
                <div>{employee.jobRole}</div>
            </div>
        </div>
        
    </Dialog>
    }
    {
      <Dialog open={openDeleteDialog}>
        <DialogTitle id="alert-dialog-title">
          Delete Action
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure want to delete employee details?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={(e) => handleCloseGlobalDialog('delete_employee')}>Delete</Button>
          <Button onClick={handleCloseGlobalDialog} autoFocus>
          Cancel
          </Button>
      </DialogActions>
    </Dialog>
    }
    <ToastContainer />
    </>
  )
}
