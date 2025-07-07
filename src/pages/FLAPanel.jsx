// import React, { useEffect, useState } from 'react';
// import api from '../services/api';

// const FLAPanel = () => {
//   const [entrySlips, setEntrySlips] = useState([]);
//   const [leaveApps, setLeaveApps] = useState([]);
//   const [slaUsers, setSlaUsers] = useState([]);
//   const [selectedSLA, setSelectedSLA] = useState({});

//   const fetchData = async () => {
//     try {
//       const [entryRes, leaveRes] = await Promise.all([
//         api.get('/entry-slip/pending/fla'),
//         // api.get('/leave/pending/fla')
//       ]);
//       setEntrySlips(entryRes.data);
//       setLeaveApps(leaveRes.data);
//     } catch (err) {
//       console.error('Error fetching FLA data:', err);
//     }
//   };

//   const fetchSLAs = async () => {
//     try {
//       const res = await api.get('/users?role=SLA');
//       setSlaUsers(res.data);
//     } catch (err) {
//       console.error('Failed to fetch SLA users', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchSLAs();
//   }, []);

//   const handleSLAChange = (slipId, email) => {
//     setSelectedSLA(prev => ({
//       ...prev,
//       [slipId]: email
//     }));
//   };

//   const handleEntrySlipAction = async (id, action) => {
//     try {
//       if (action === 'approve') {
//         const slaEmail = selectedSLA[id];
//         if (!slaEmail) {
//           alert('Please select an SLA before approving.');
//           return;
//         }
//         {console.log(`Approving entry slip ${id} with SLA: ${slaEmail}`);}
//         await api.put(`/entry-slip/${action}/${id}`, null, {
//           params: {
//             role: 'FLA',
//             nextApproverEmail: slaEmail
//           }
//         });
//       } else {
//         await api.put(`/entry-slip/${action}/${id}?role=FLA`);
//       }
//       alert(`Entry slip ${action}ed successfully`);
//       fetchData();
//     } catch (err) {
//       console.error(`Failed to ${action} entry slip`, err);
//     }
//   };

//   const handleLeaveAction = async (id, action) => {
//     try {
//       await api.put(`/leave/${action}/${id}?role=FLA`);
//       alert(`Leave ${action}ed successfully`);
//       fetchData();
//     } catch (err) {
//       console.error(`Failed to ${action} leave`, err);
//     }
//   };

//   return (
//     <div>
//       <h2>FLA Panel – Entry Slips</h2>
//       {entrySlips.length === 0 ? (
//         <p>No pending entry slips for FLA.</p>
//       ) : (
//         entrySlips.map((slip) => (
//           <div key={slip.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <p><strong>Created By:</strong> {slip.createdBy?.email}</p>
//             <p><strong>Date:</strong> {slip.date}</p>
//             <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
//             <p><strong>Reason:</strong> {slip.reason}</p>

//             <label>Select SLA Approver:</label>
//             <select
//               value={selectedSLA[slip.id] || ''}
//               onChange={(e) => handleSLAChange(slip.id, e.target.value)}
//             >
//               <option value="">Select SLA</option>
//               {slaUsers.map(sla => (
//                 <option key={sla.email} value={sla.email}>
//                   {sla.name} ({sla.email})
//                 </option>
//               ))}
//             </select>

//             <button onClick={() => handleEntrySlipAction(slip.id, 'approve')}>Approve</button>
//             <button onClick={() => handleEntrySlipAction(slip.id, 'reject')}>Reject</button>
//           </div>
//         ))
//       )}

//       <h2>FLA Panel – Leave Applications</h2>
//       {leaveApps.length === 0 ? (
//         <p>No pending leave applications for FLA.</p>
//       ) : (
//         leaveApps.map((leave) => (
//           <div key={leave.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <p><strong>Email:</strong> {leave.email}</p>
//             <p><strong>Dates:</strong> {leave.fromDate} to {leave.toDate}</p>
//             <p><strong>Leave Type:</strong> {leave.leaveType} ({leave.dayType})</p>
//             <p><strong>Reason:</strong> {leave.reason}</p>
//             <button onClick={() => handleLeaveAction(leave.id, 'approve')}>Approve</button>
//             <button onClick={() => handleLeaveAction(leave.id, 'reject')}>Reject</button>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default FLAPanel;



















import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FlaApprovalCard } from '../components/LeaveRequestTables';
import { leaveApproveApi } from '../services/leave';


const FLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [slaUsers, setSlaUsers] = useState([]);
  const [selectedSLA, setSelectedSLA] = useState({});

  const fetchData = async () => {
    try {
      const [entryRes] = await Promise.all([
        api.get('/entry-slip/pending/fla'),
      ]);
      setEntrySlips(entryRes.data);
    } catch (err) {
      console.error('Error fetching FLA data:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await api.get('/leave/fla/all');
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
    }
  }

  const fetchSLAs = async () => {
    try {
      const res = await api.get('/users?role=SLA');
      setSlaUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch SLA users', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
    fetchSLAs();
  }, []);

  const handleSLAChange = (slipId, email) => {
    setSelectedSLA((prev) => ({ ...prev, [slipId]: email }));
  };

  const handleEntrySlipAction = async (id, action) => {
    try {
      if (action === 'approve') {
        const slaEmail = selectedSLA[id];
        if (!slaEmail) {
          alert('Please select an SLA before approving.');
          return;
        }
        await api.put(`/entry-slip/${action}/${id}`, null, {
          params: {
            role: 'FLA',
            nextApproverEmail: slaEmail
          }
        });
      } else {
        await api.put(`/entry-slip/${action}/${id}?role=FLA`);
      }
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveApproval = async (id, action, slaId, substitute) => {
    const result = await leaveApproveApi(id, "fla", action, {
      slaSelected: slaId,
      substituteSelected: substitute,
    });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  }

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">FLA Panel – Entry Slips</h3>

      {entrySlips.length === 0 ? (
        <p className="text-muted">No pending entry slips for FLA.</p>
      ) : (
        entrySlips.map((slip) => (
          <div key={slip.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-dark">Entry Slip</h5>
              <p><strong>Employee Name:</strong> {slip.createdBy?.name}</p>
              <p><strong>Email:</strong> {slip.createdBy?.email}</p>
              <p><strong>Department:</strong> {slip.createdBy?.department}</p>
              <p><strong>Employee ID:</strong> {slip.createdBy?.employeeId}</p>

              <p><strong>Date:</strong> {slip.date}</p>
              <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
              <p><strong>Reason:</strong> {slip.reason}</p>

              <div className="mb-3">
                <label className="form-label">Select SLA Approver</label>
                <select
                  className="form-select"
                  value={selectedSLA[slip.id] || ''}
                  onChange={(e) => handleSLAChange(slip.id, e.target.value)}
                >
                  <option value="">-- Select SLA --</option>
                  {slaUsers.map((sla) => (
                    <option key={sla.email} value={sla.email}>
                      {sla.name} ({sla.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
                  <i className="fas fa-check-circle me-1"></i> Approve
                </button>
                <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
                  <i className="fas fa-times-circle me-1"></i> Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <h3 className="text-primary mb-4">Leave Requests</h3>
      {leaveRequests.length === 0 ? (
        <p className="text-muted">No pending leave applications for FLA.</p>
      ) : (
        leaveRequests.map((request) => (
          <FlaApprovalCard
            key={request.id}
            request={request}
            action={handleLeaveApproval}
            approvers={slaUsers}
          />
        ))
      )}
    </div>
  );
};

export default FLAPanel;
