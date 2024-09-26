import React, { useState } from 'react';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeTable } from '../components/EmployeeTable';

export const Employess = () => {
  const [updateEmployeeId, setUpdateEmployeeId] = useState();
  const [employeeupdate, setEmployeeUpdate] = useState(true);

  const setUpdateEmployee = (id) => {   
    setUpdateEmployeeId(id);
  };
  
  const handleEmployeeUpdate = () => {
    setEmployeeUpdate(!employeeupdate);
  }

  return (
    <div className='p-16 grid gap-16'>
        <section className='employee-form-container'>
            <EmployeeForm updateEmployeeId={updateEmployeeId} handleEmployeeUpdate={handleEmployeeUpdate}/>
        </section>
        <section>
            <EmployeeTable setUpdateEmployee={setUpdateEmployee} employeeupdate={employeeupdate}/>
        </section>
    </div>
  )
}
