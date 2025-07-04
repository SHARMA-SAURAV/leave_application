// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import RoleSwitcher from '../components/RoleSwitcher';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');

//   useEffect(() => {
//     setActiveRole(localStorage.getItem('activeRole') || '');
//   }, []);

//   return (
//     <div>


//       <div className="container mt-4">
//         <h2>Dashboard ({activeRole})</h2>
//         <RoleSwitcher onChange={(r) => setActiveRole(r)} />
//         <hr />
//         {activeRole === 'USER' && (
//           <>
//             <button className="btn btn-outline-primary me-2" onClick={() => navigate('/apply-leave')}>
//               Apply for Leave
//             </button>
//             <button className="btn btn-outline-secondary" onClick={() => navigate('/entry-slip')}>
//               Apply for Entry Slip
//             </button>
//           </>
//         )}
//         {activeRole === 'FLA' && (
//           <button className="btn btn-primary" onClick={() => navigate('/fla-dashboard')}>
//             View Pending Approvals (FLA)
//           </button>
//         )}
//         {activeRole === 'SLA' && (
//           <button className="btn btn-primary" onClick={() => navigate('/sla-dashboard')}>
//             View Pending Approvals (SLA)
//           </button>
//         )}
//         {activeRole === 'HR' && (
//           <button className="btn btn-primary" onClick={() => navigate('/hr-dashboard')}>
//             View HR Approvals
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;











import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import RoleSwitcher from '../components/RoleSwitcher';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveApps, setLeaveApps] = useState([]);

  useEffect(() => {
    setActiveRole(localStorage.getItem('activeRole') || '');

    if (localStorage.getItem('activeRole') === 'USER') {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [entryRes, leaveRes] = await Promise.all([
        api.get('/entry-slip/user'),
        api.get('/leave/user'),
      ]);
      setEntrySlips(entryRes.data);
      setLeaveApps(leaveRes.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mt-4">
        <h2>Dashboard ({activeRole})</h2>
        <RoleSwitcher onChange={(r) => setActiveRole(r)} />
        <hr />

        {activeRole === 'USER' && (
          <>
            <div className="mb-4">
              <button className="btn btn-outline-primary me-2" onClick={() => navigate('/apply-leave')}>
                Apply for Leave
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/entry-slip')}>
                Apply for Entry Slip
              </button>
              <button className="btn btn-outline-success me-2" onClick={() => navigate('/leave-status')}>
                Track Leave
              </button>
              <button className="btn btn-outline-info" onClick={() => navigate('/entry-slip-status')}>
                Track Entry Slip
              </button>
            </div>

            {/* <h4>My Entry Slips</h4>
            {entrySlips.length === 0 ? (
              <p className="text-muted">No entry slips submitted yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Current Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entrySlips.map((slip) => (
                      <tr key={slip.id}>
                        <td>{slip.date}</td>
                        <td>{slip.inTime}</td>
                        <td>{slip.outTime}</td>
                        <td>{slip.reason}</td>
                        <td>{slip.status}</td>
                        <td>{slip.currentLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h4 className="mt-5">My Leave Applications</h4>
            {leaveApps.length === 0 ? (
              <p className="text-muted">No leave applications submitted yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Current Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApps.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.fromDate}</td>
                        <td>{leave.toDate}</td>
                        <td>{leave.leaveType} ({leave.dayType})</td>
                        <td>{leave.reason}</td>
                        <td>{leave.status}</td>
                        <td>{leave.currentLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )} */}
          </>
        )}

        {activeRole === 'FLA' && (
          <button className="btn btn-primary" onClick={() => navigate('/fla-dashboard')}>
            View Pending Approvals (FLA)
          </button>
        )}
        {activeRole === 'SLA' && (
          <button className="btn btn-primary" onClick={() => navigate('/sla-dashboard')}>
            View Pending Approvals (SLA)
          </button>
        )}
        {activeRole === 'HR' && (
          <button className="btn btn-primary" onClick={() => navigate('/hr-dashboard')}>
            View HR Approvals
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
