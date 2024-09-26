import React, { useEffect, useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useFetchAPI } from '../customHooks/useFetchAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EmployeeForm = ({updateEmployeeId,handleEmployeeUpdate}) => {
    const {fetchData} = useFetchAPI();
    const roles = [
        { value: 'None', label: '' },
        { value: 'Developer', label: 'Developer' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Journalist', label: 'Journalist' }
    ];
    const [employee, setEmployee] = useState({
        id: 0,
        name: "",
        email: "",
        employeeID: "",
        mobile: "",
        jobRole: ""
    });
    const [formType, setFormType] = useState('insert');
    const [formError, setFormError] = useState({
        name: false,
        email: false,
        employeeID: false,
        mobile: false,
        jobRole: false
    });
    
    useEffect(() => {
        console.log('udpate employee id : ', updateEmployeeId);
        
        async function fetchEmployee(){
            const param = {
                url: `/employees/${updateEmployeeId}`,
                method: 'GET'
            };
            const response = await fetchData(param);
            setEmployee(response?.data || []);
        }
        if(updateEmployeeId){
            setFormType('update');
            fetchEmployee();
        }
    },[updateEmployeeId]);

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function validateMobileNumber(mobileNumber) {
        const mobilePattern = /^\d{10}$/; // Validates a 10-digit mobile number
        return mobilePattern.test(mobileNumber);
    }

    function validateLettersAndSpaces(input) {
        const regex = /^[A-Za-z\s]+$/;
        return regex.test(input);
    }

    function validateNumbersOnly(input) {
        const regex = /^[0-9]+$/;
        return regex.test(input);
    }

    const validateFormFields = () => {

        if(employee.name.trim().length === 0 && employee.email.trim().length === 0 && employee.employeeID.length === 0
            || employee.mobile.trim().length === 0 && employee.jobRole === 'None'){
            tostifyNotification('All fields are required.','error');
            return false;
        }

        if(!validateLettersAndSpaces(employee.name)){
            tostifyNotification('Name should have characters & space only.','error');
            return false;
        }else if(employee.name.trim().length < 3 || employee.name.trim().length > 15){
            tostifyNotification('Name should be between 3 and 15 characters long.','error');
            return false;
        }else if(!validateEmail(employee.email)){
            tostifyNotification('Invalid email format.','error');
            return false;
        }else if(!validateNumbersOnly(employee.employeeID)){
            tostifyNotification('Name should have numbers only.','error');
            return false;
        }else if(employee.employeeID.trim().length < 4){
            tostifyNotification('Employee ID should be greater than 4 characters.','error');
            return false;
        }else if(!validateMobileNumber(employee.mobile)){
            tostifyNotification('Invalid mobile number format. It should be 10 digits.','error');
            return false;
        }else if(employee.jobRole === 'None'){
            tostifyNotification('Invalid role selected.','error');
            return false;
        }
        return true;
    }

    const submitForm = async() => {

        if(!validateFormFields()){
            return;
        }
        console.log('again return not working');

        if(formType == 'update'){
            const param = {
                url: `/employees/${updateEmployeeId}`,
                method: 'PATCH',
                data: employee
            };
            const response = await fetchData(param);
            console.log('updated value response:', response);
            setFormType('insert');
            resetFormValues();
            tostifyNotification('Employee details updated successfully.','success');
            handleEmployeeUpdate();
        }else{
            const val = {
                ...employee
            };
            delete val.id;
            const param = {
                url: `/employees`,
                method: 'POST',
                data: val
            };
            const response = await fetchData(param);
            resetFormValues();
            console.log('new value inserted:', response);
            tostifyNotification('Employee details added successfully.','success');
            handleEmployeeUpdate();
        }
    }

    const resetFormValues = () => {
        setEmployee({
            id: 0,
            name: "",
            email: "",
            employeeID: "",
            mobile: "",
            jobRole: ""
        });
    }

    const changeFormValue = (e) => {
        setEmployee({
            name: e.target.name === 'nameVal'? e.target.value.trim() : employee.name,
            email: e.target.name === 'emailVal'? e.target.value.trim() : employee.email,
            employeeID: e.target.name === 'empIdVal'? e.target.value.trim() : employee.employeeID,
            mobile: e.target.name ==='mobVal'? e.target.value.trim() : employee.mobile,
            jobRole: e.target.name === 'roleVal'? e.target.value : employee.jobRole
        });
    };

    const tostifyNotification = (msg, type = 'info') => {
        switch (type) {
            case 'success':
                toast.success(msg,
                    {
                        toastId: new Date(),
                        autoClose: 3000
                    }
                );
                break;
            case 'error':
                tostifyNotification(msg,
                    {
                        toastId: new Date(),
                        autoClose: 3000
                    }
                );
                break;
            case 'warn':
                toast.warn(msg);
                break;
            default:
                toast.info(msg);
                break;
        }
    };
    

  return (
    <>
        <form className='w-100 h-100 grid align-itm-center'>
        <h4>
            {formType == 'update'? `${employee.name}`: 'Employee'}
        </h4>
        <FormControl className='w-100'>
            <TextField error={formError.name}  onChange={changeFormValue}  value={employee.name} name='nameVal' variant="outlined"  label="Name" className='w-100' />
        </FormControl>
        <FormControl className='w-100'>
            <TextField error={formError.email} onChange={changeFormValue}  value={employee.email} name='emailVal' variant="outlined" type='email'  label="Email" />
        </FormControl>
        <FormControl className='w-100'>
            <TextField error={formError.employeeID} onChange={changeFormValue}  value={employee.employeeID} name='empIdVal' variant="outlined" label="Employee ID" />
        </FormControl>
        <FormControl className='w-100'>
            <TextField error={formError.mobile} onChange={changeFormValue}  value={employee.mobile} name='mobVal' variant="outlined"  label="Mobile" />
        </FormControl>
        <FormControl className='w-100' fullWidth>
            <InputLabel id="job-role-label">Job Role</InputLabel>
            <Select
            labelId="job-role-label"
            label="Job Role"
            value={employee.jobRole}
            name='roleVal'
            onChange={changeFormValue} 
            error={formError.jobRole}
            >
            {roles.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        <Button type="button" variant="contained" color="primary" onClick={submitForm}>Submit</Button>
        </form>
        <ToastContainer />
    </>
    
  )
}
