import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HrApprovalRow, HrApprovedRow } from '../components/LeaveRequestTables';
import { HrPassApprovalRow, HrPassApprovedRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



const HRPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState([]);
  const [approvedMovementPasses, setApprovedMovementPasses] = useState([]);
  const [view, setView] = useState('pending'); // 'pending' or 'approved'
  const [entrySlipLoading, setEntrySlipLoading] = useState({});
  const [_, setLeaveActionLoading] = useState({});



  const fetchData = async () => {
    try {
      const entryRes = await api.get(view === 'pending' ? '/entry-slip/pending/hr' : '/entry-slip/approved');
      setEntrySlips(entryRes.data);
    } catch (err) {
      console.error('Error fetching HR data:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const pendingRequests = await api.get('/leave/hr/all');
      const approvedRequests = await api.get('/leave/hr/approved');
      setLeaveRequests(pendingRequests.data);
      setApprovedLeaveRequests(approvedRequests.data);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
    }
  };

  const fetchMovementPasses = async () => {
    try {
      const res = await api.get('/movement/hr/all');
      const approvedRes = await api.get('/movement/hr/approved');
      setMovementPasses(res.data);
      setApprovedMovementPasses(approvedRes.data);
    } catch (err) {
      console.error('Error fetching movement passes:', err);
    }
  }

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
    fetchMovementPasses();
  }, [view]);

  const handleEntrySlipAction = async (id, action) => {
    setEntrySlipLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await api.put(`/entry-slip/${action}/${id}?role=HR`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
    finally {
      setEntrySlipLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // const handleLeaveAction = async (id, action) => {
  //   try {
  //     await api.put(`/leave/${action}/${id}?role=HR`);
  //     alert(`Leave ${action}ed successfully`);
  //     fetchData();
  //   } catch (err) {
  //     console.error(`Failed to ${action} leave`, err);
  //   }
  // };
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


  const downloadLeavePDF = async (leave) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Leave Application Details', 14, 20);
    const types = [];
    if (leave.clLeaves > 0) types.push("CL: " + leave.clLeaves);
    if (leave.plLeaves > 0) types.push("PL: " + leave.plLeaves);
    if (leave.rhLeaves > 0) types.push("RH: " + leave.rhLeaves);
    if (leave.otherLeaves > 0) types.push("Other: " + leave.otherLeaves);
    autoTable(doc, {
      startY: 30,
      body: [
        ['Employee Name', leave?.requestedBy?.name || 'N/A'],
        ['Email', leave?.requestedBy?.email || 'N/A'],
        ['Start Date', leave.startDate],
        ['End Date', leave.endDate],
        ['Reason', leave.reason],
        ['Substitute', leave.substitute || 'N/A'],
        ['Type', types.join(', ')],
        ['Status', leave.status],
        ['FLA Approver', leave.flaApprover?.name || 'N/A'],
        ['SLA Approver', leave.slaApprover?.name || 'N/A'],
      ]
    });
    doc.save(`leave-application-${leave.id}.pdf`);
  };

  const downloadPassPDF = async (pass) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Movement Pass Details', 14, 20);
    autoTable(doc, {
      startY: 30,
      body: [
        ['Employee Name', pass?.requestedBy?.name || 'N/A'],
        ['Email', pass?.requestedBy?.email || 'N/A'],
        ['Date', pass.date],
        ['Start Time', pass.startTime],
        ['End Time', pass.endTime],
        ['Reason', pass.reason],
        ['Status', pass.status],
        ['FLA Approver', pass.flaApprover?.name || 'N/A'],
        ['SLA Approver', pass.slaApprover?.name || 'N/A'],
      ]
    });
    doc.save(`movement-pass-${pass.id}.pdf`);
  };


  const handleLeaveApproval = async (id, action) => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    const result = await leaveApproveApi(id, "hr", action);
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
    setLeaveActionLoading((prev) => ({ ...prev, [id]: false }));
  }

  const handlePassApproval = async (id, action) => {
    try {
      const result = await movementPassApproveApi(id, "hr", action);
      if (result) {
        setMovementPasses((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} movement pass`, err);
    }
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
              <p><strong>Employee Name:</strong> {slip.createdBy?.name}</p>
              <p><strong>Email:</strong> {slip.createdBy?.email}</p>
              <p><strong>Department:</strong> {slip.createdBy?.department}</p>
              <p><strong>Employee ID:</strong> {slip.createdBy?.employeeId}</p>
              <p><strong>Date:</strong> {slip.date}</p>
              <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
              <p><strong>Reason:</strong> {slip.reason}</p>

              {view === 'pending' ? (
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
                    {entrySlipLoading[slip.id] ? (

                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Approving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-1"></i> Approve
                      </>
                    )}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
                    {entrySlipLoading[slip.id] ? (

                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times me-1"></i> Reject
                      </>
                    )}
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

      <h5 className="text-secondary">Leave Requests</h5>
      {
        view === 'pending' ? (
          leaveRequests.length === 0 ? (
            <p className="text-muted">No pending leave applications for HR.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Email</th>
                    <th scope="col">ID</th>
                    <th scope="col">Dept</th>
                    <th scope="col">Leave Period</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Leave Days</th>
                    <th scope="col">Substitute</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <HrApprovalRow
                      key={request.id}
                      request={request}
                      action={handleLeaveApproval}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          approvedLeaveRequests.length === 0 ? (
            <p className="text-muted">No approved applications for HR.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Email</th>
                    <th scope="col">ID</th>
                    <th scope="col">Dept</th>
                    <th scope="col">Leave Period</th>
                    <th scope="col">Reason</th>
                    <th scope="col">Leave Days</th>
                    <th scope="col">Substitute</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <HrApprovedRow
                      key={request.id}
                      request={request}
                      downloadPdf={downloadLeavePDF}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      }

      <h5 className="text-secondary">Movement Passes</h5>
      {
        view === 'pending' ? (
          movementPasses.length === 0 ? (
            <p className="text-muted">No pending movement passes for HR.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Email</th>
                    <th scope="col">ID</th>
                    <th scope="col">Dept</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time Period</th>
                    <th scope="col">Reason</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movementPasses.map((request) => (
                    <HrPassApprovalRow
                      key={request.id}
                      request={request}
                      action={handlePassApproval}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          approvedMovementPasses.length === 0 ? (
            <p className="text-muted">No approved movement passes for HR.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Email</th>
                    <th scope="col">ID</th>
                    <th scope="col">Dept</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time Period</th>
                    <th scope="col">Reason</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedMovementPasses.map((request) => (
                    <HrPassApprovedRow
                      key={request.id}
                      request={request}
                      downloadPdf={downloadPassPDF}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      }

    </div>
  );
};

export default HRPanel;