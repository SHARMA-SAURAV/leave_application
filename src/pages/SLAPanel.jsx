// import React, { useEffect, useState } from 'react';
// import api from '../services/api';

// const SLAPanel = () => {
//   const [entrySlips, setEntrySlips] = useState([]);
//   const [leaveApps, setLeaveApps] = useState([]);

//   const fetchData = async () => {
//     try {
//       const entryRes = await api.get('/entry-slip/pending/sla');
//       setEntrySlips(entryRes.data);

//       const leaveRes = await api.get('/leave/pending/sla');
//       setLeaveApps(leaveRes.data);
//     } catch (err) {
//       console.error('Error fetching SLA data:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleEntrySlipAction = async (id, action) => {
//     try {
//       await api.put(`/entry-slip/${action}/${id}?role=SLA`);
//       alert(`Entry slip ${action}ed successfully`);
//       fetchData(); // Refresh
//     } catch (err) {
//       console.error(`Failed to ${action} entry slip`, err);
//     }
//   };

//   const handleLeaveAction = async (id, action) => {
//     try {
//       await api.put(`/leave/${action}/${id}?role=SLA`);
//       alert(`Leave ${action}ed successfully`);
//       fetchData(); // Refresh
//     } catch (err) {
//       console.error(`Failed to ${action} leave`, err);
//     }
//   };

//   return (
//     <div>
//       <h2>SLA Panel – Entry Slips</h2>
//       {entrySlips.length === 0 ? (
//         <p>No pending entry slips.</p>
//       ) : (
//         entrySlips.map((slip) => (
//           <div key={slip.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//             <p><strong>Email:</strong> {slip.email}</p>
//             <p><strong>Date:</strong> {slip.date}</p>
//             <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
//             <p><strong>Reason:</strong> {slip.reason}</p>
//             <button onClick={() => handleEntrySlipAction(slip.id, 'approve')}>Approve</button>
//             <button onClick={() => handleEntrySlipAction(slip.id, 'reject')}>Reject</button>
//           </div>
//         ))
//       )}

//       <h2>SLA Panel – Leave Applications</h2>
//       {leaveApps.length === 0 ? (
//         <p>No pending leave applications.</p>
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

// export default SLAPanel;


















import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SlaApprovalCard } from '../components/LeaveRequestTables';
import { leaveApproveApi } from '../services/leave';

const SLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const fetchData = async () => {
    try {
      const entryRes = await api.get('/entry-slip/pending/sla');
      setEntrySlips(entryRes.data);
    } catch (err) {
      console.error('Error fetching SLA data:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await api.get('/leave/sla/all');
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
  }, []);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=SLA`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData(); // Refresh
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveApproval = async (id, action, substitute = null) => {
    const result = await leaveApproveApi(id, "sla", action, { substituteSelected: substitute });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  }

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">SLA Panel – Entry Slips</h3>

      {entrySlips.length === 0 ? (
        <p className="text-muted">No pending entry slips.</p>
      ) : (
        entrySlips.map((slip) => (
          <div key={slip.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title text-dark">Entry Slip</h5>
              <p><strong>Email:</strong> {slip.email}</p>
              <p><strong>Date:</strong> {slip.date}</p>
              <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
              <p><strong>Reason:</strong> {slip.reason}</p>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
                  <i className="fas fa-check me-1"></i> Approve
                </button>
                <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
                  <i className="fas fa-times me-1"></i> Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <h3 className="text-primary mb-4">Leave Requests</h3>
      {leaveRequests.length === 0 ? (
        <p className="text-muted">No pending leave applications for SLA.</p>
      ) : (
        leaveRequests.map((request) => (
          <SlaApprovalCard
            key={request.id}
            request={request}
            action={handleLeaveApproval}
          />
        ))
      )}

    </div>
  );
};

export default SLAPanel;
