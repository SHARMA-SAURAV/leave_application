import React, { useEffect, useState } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const HRPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveApps, setLeaveApps] = useState([]);
  const [view, setView] = useState('pending'); // 'pending' or 'approved'

  const fetchData = async () => {
    try {
      const entryRes = await api.get(view === 'pending' ? '/entry-slip/pending/hr' : '/entry-slip/approved');
      setEntrySlips(entryRes.data);

      const leaveRes = await api.get(view === 'pending' ? '/leave/pending/hr' : '/leave/approved');
      setLeaveApps(leaveRes.data);
    } catch (err) {
      console.error('Error fetching HR data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=HR`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      await api.put(`/leave/${action}/${id}?role=HR`);
      alert(`Leave ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} leave`, err);
    }
  };
const downloadEntrySlipPDF = (slip) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text('Entry Slip Details', 14, 20);

  autoTable(doc, {
    startY: 30,
    body: [
      ['Created By', slip.createdBy?.name || 'N/A'],
      ['Email', slip.createdBy?.email || 'N/A'],
      ['Department', slip.createdBy?.department || 'N/A'],
      ['Designation', slip.createdBy?.designation || 'N/A'],
      ['Date', slip.date],
      ['Time', `${slip.inTime} - ${slip.outTime}`],
      ['Reason', slip.reason],
      ['Status', slip.status],
      ['FLA Approver', slip.approvedByFLA?.name || 'N/A'],
      ['SLA Approver', slip.approvedBySLA?.name || 'N/A'],
      ['HR Approver', slip.approvedByHR?.name || 'N/A'],
    ]
  });

  doc.save(`entry-slip-${slip.id}.pdf`);
};


  const downloadLeavePDF = (leave) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Leave Application Details', 14, 20);

    doc.autoTable({
      startY: 30,
      body: [
        ['Employee Name', leave?.requestedBy?.name || 'N/A'],
        ['Email', leave?.requestedBy?.email || 'N/A'],
        ['Start Date', leave.startDate],
        ['End Date', leave.endDate],
        ['Reason', leave.reason],
        ['Type', `${leave.leaveType || ''} (${leave.dayType || ''})`],
        ['Status', leave.status],
        ['FLA Approver', leave.flaApprover?.name || 'N/A'],
        ['SLA Approver', leave.slaApprover?.name || 'N/A'],
        ['HR Approver', leave.hrApprover?.name || 'N/A'],
      ]
    });

    doc.save(`leave-application-${leave.id}.pdf`);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">HR Panel – {view === 'pending' ? 'Pending' : 'Approved'} Applications</h3>

      <div className="mb-4">
        <button
          className={`btn btn-${view === 'pending' ? 'primary' : 'outline-primary'} me-2`}
          onClick={() => setView('pending')}
        >
          View Pending
        </button>
        <button
          className={`btn btn-${view === 'approved' ? 'primary' : 'outline-primary'}`}
          onClick={() => setView('approved')}
        >
          View Approved
        </button>
      </div>

      <h5 className="text-secondary">Entry Slips</h5>
      {entrySlips.length === 0 ? (
        <p className="text-muted">No {view} entry slips.</p>
      ) : (
        entrySlips.map((slip) => (
          <div key={slip.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <p><strong>Created By:</strong> {slip.createdBy?.name} ({slip.createdBy?.email})</p>
              <p><strong>Date:</strong> {slip.date}</p>
              <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
              <p><strong>Reason:</strong> {slip.reason}</p>

              {view === 'pending' ? (
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
                    <i className="fas fa-check me-1"></i> Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
                    <i className="fas fa-times me-1"></i> Reject
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline-dark mt-2" onClick={() => downloadEntrySlipPDF(slip)}>
                  <i className="fas fa-download me-1"></i> Download PDF
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <h5 className="text-secondary mt-5">Leave Applications</h5>
      {leaveApps.length === 0 ? (
        <p className="text-muted">No {view} leave applications.</p>
      ) : (
        leaveApps.map((leave) => (
          <div key={leave.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <p><strong>Requested By:</strong> {leave?.requestedBy?.name} ({leave?.requestedBy?.email})</p>
              <p><strong>Dates:</strong> {leave.startDate} to {leave.endDate}</p>
              <p><strong>Type:</strong> {leave.leaveType} ({leave.dayType})</p>
              <p><strong>Reason:</strong> {leave.reason}</p>

              {view === 'pending' ? (
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-success" onClick={() => handleLeaveAction(leave.id, 'approve')}>
                    <i className="fas fa-check me-1"></i> Approve
                  </button>
                  <button className="btn btn-danger" onClick={() => handleLeaveAction(leave.id, 'reject')}>
                    <i className="fas fa-times me-1"></i> Reject
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline-dark mt-2" onClick={() => downloadLeavePDF(leave)}>
                  <i className="fas fa-download me-1"></i> Download PDF
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HRPanel;


















// import React, { useEffect, useState } from 'react';
// import api from '../services/api';

// const HRPanel = () => {
//   const [entrySlips, setEntrySlips] = useState([]);
//   const [leaveApps, setLeaveApps] = useState([]);

//   const fetchData = async () => {
//     try {
//       const entryRes = await api.get('/entry-slip/pending/hr');
//       setEntrySlips(entryRes.data);

//       const leaveRes = await api.get('/leave/pending/hr');
//       setLeaveApps(leaveRes.data);
//     } catch (err) {
//       console.error('Error fetching HR data:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleEntrySlipAction = async (id, action) => {
//     try {
//       await api.put(`/entry-slip/${action}/${id}?role=HR`);
//       alert(`Entry slip ${action}ed successfully`);
//       fetchData();
//     } catch (err) {
//       console.error(`Failed to ${action} entry slip`, err);
//     }
//   };

//   const handleLeaveAction = async (id, action) => {
//     try {
//       await api.put(`/leave/${action}/${id}?role=HR`);
//       alert(`Leave ${action}ed successfully`);
//       fetchData();
//     } catch (err) {
//       console.error(`Failed to ${action} leave`, err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3 className="text-primary mb-4">HR Panel – Entry Slips</h3>

//       {entrySlips.length === 0 ? (
//         <p className="text-muted">No pending entry slips.</p>
//       ) : (
//         entrySlips.map((slip) => (
//           <div key={slip.id} className="card shadow-sm mb-4">
//             <div className="card-body">
//               <h5 className="card-title text-dark">Entry Slip</h5>
//               <p><strong>Email:</strong> {slip.email}</p>
//               <p><strong>Date:</strong> {slip.date}</p>
//               <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
//               <p><strong>Reason:</strong> {slip.reason}</p>

//               <div className="d-flex gap-2 mt-3">
//                 <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
//                   <i className="fas fa-check me-1"></i> Approve
//                 </button>
//                 <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
//                   <i className="fas fa-times me-1"></i> Reject
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}

//       <h3 className="text-primary mt-5 mb-4">HR Panel – Leave Applications</h3>

//       {leaveApps.length === 0 ? (
//         <p className="text-muted">No pending leave applications.</p>
//       ) : (
//         leaveApps.map((leave) => (
//           <div key={leave.id} className="card shadow-sm mb-4">
//             <div className="card-body">
//               <h5 className="card-title text-dark">Leave Application</h5>
//               <p><strong>Email:</strong> {leave.email}</p>
//               <p><strong>Dates:</strong> {leave.fromDate} to {leave.toDate}</p>
//               <p><strong>Type:</strong> {leave.leaveType} ({leave.dayType})</p>
//               <p><strong>Reason:</strong> {leave.reason}</p>

//               <div className="d-flex gap-2 mt-3">
//                 <button className="btn btn-success" onClick={() => handleLeaveAction(leave.id, 'approve')}>
//                   <i className="fas fa-check me-1"></i> Approve
//                 </button>
//                 <button className="btn btn-danger" onClick={() => handleLeaveAction(leave.id, 'reject')}>
//                   <i className="fas fa-times me-1"></i> Reject
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default HRPanel;
