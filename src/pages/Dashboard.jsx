import React, { useState, useEffect } from 'react';
import RoleSwitcher from '../components/RoleSwitcher';
import { useNavigate } from 'react-router-dom';
// import navigate from 

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');

   const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    setActiveRole(localStorage.getItem('activeRole') || '');
  }, []);

  return (
    <div>
      <h2>Dashboard ({activeRole})</h2>
      <RoleSwitcher onChange={(r) => setActiveRole(r)} />
         <button onClick={handleLogout}>Logout</button>
      {activeRole === 'USER' && (
        <>
          <button onClick={() => navigate('/apply-leave')}>Apply for Leave</button>
          <button onClick={() => navigate('/entry-slip')}>Apply for Entry Slip</button>
        </>
      )}
      {activeRole === 'FLA' && <button onClick={()=> navigate('/fla-dashboard')}>View Pending Approvals (FLA)</button>}
      {activeRole === 'SLA' && <button onClick={()=> navigate('/sla-dashboard')} >View Pending Approvals (SLA)</button>}
      {activeRole === 'HR' &&  <button onClick={()=> navigate('/hr-dashboard')} >View HR Approvals</button>}
    </div>
  );
};

export default Dashboard;











// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const email = localStorage.getItem('email');

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div>
//       <h2>Welcome, {email}</h2>
//       <button onClick={() => navigate('/apply-leave')}>Apply for Leave</button>
//       <button onClick={() => navigate('/entry-slip')}>Apply for Entry Slip</button>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;
