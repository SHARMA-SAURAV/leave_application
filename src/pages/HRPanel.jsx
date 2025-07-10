import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HrApprovalRow, HrApprovedRow } from '../components/LeaveRequestTables';
import { leaveApproveApi } from '../services/leave';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



const HRPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState([]);
  const [view, setView] = useState('pending'); // 'pending' or 'approved'
  const [entrySlipLoading, setEntrySlipLoading] = useState({});
  const [_, setLeaveActionLoading] = useState({});
  const [approvedTab, setApprovedTab] = useState('entryslip'); // 'entryslip' or 'leaverequest'



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

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
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


  const handleLeaveApproval = async (id, action) => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    const result = await leaveApproveApi(id, "hr", action);
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
    setLeaveActionLoading((prev) => ({ ...prev, [id]: false }));
  }

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

      
      {view === 'approved' && (
        <div className="mb-3">
          <button
            className={`btn btn-${approvedTab === 'entryslip' ? 'primary' : 'outline-primary'} me-2`}
            onClick={() => setApprovedTab('entryslip')}
          >
            Approved Entry Slips
          </button>
          <button
            className={`btn btn-${approvedTab === 'leaverequest' ? 'primary' : 'outline-primary'}`}
            onClick={() => setApprovedTab('leaverequest')}
          >
            Approved Leave Requests
          </button>
        </div>
      )}
      {view === 'approved' ? (
        approvedTab === 'entryslip' ? (
          entrySlips.length === 0 ? (
            <p className="text-muted">No approved entry slips.</p>
          ) : (
            <div className="table-responsive mb-4">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="text-center">Employee Name</th>
                    <th scope="col" className="text-center">Email</th>
                    <th scope="col" className="text-center">Department</th>
                    <th scope="col" className="text-center">Employee ID</th>
                    <th scope="col" className="text-center">Date</th>
                    <th scope="col" className="text-center">Time</th>
                    <th scope="col" className="text-center">Reason</th>
                    <th scope="col" className="text-center">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {entrySlips.map((slip) => (
                    <tr key={slip.id}>
                      <td className="align-middle text-center">{slip.createdBy?.name}</td>
                      <td className="align-middle text-center">{slip.createdBy?.email}</td>
                      <td className="align-middle text-center">{slip.createdBy?.department}</td>
                      <td className="align-middle text-center">{slip.createdBy?.employeeId}</td>
                      <td className="align-middle text-center">{slip.date}</td>
                      <td className="align-middle text-center">{slip.inTime} - {slip.outTime}</td>
                      <td className="align-middle text-center">{slip.reason}</td>
                      <td className="align-middle text-center">
                        <button className="btn btn-outline-dark btn-sm" onClick={() => downloadEntrySlipPDF(slip)}>
                          <i className="fas fa-download me-1"></i> Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          approvedLeaveRequests.length === 0 ? (
            <p className="text-muted">No approved leave applications for HR.</p>
          ) : (
            <div className="table-responsive mb-4">
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
                  {approvedLeaveRequests.map((request) => (
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
      ) : (
        <><h5 className="text-secondary">Entry Slips</h5>
          {entrySlips.length === 0 ? (
            <p className="text-muted">No pending entry slips.</p>
          ) : (
            <div className="table-responsive mb-4">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col" className="text-center">Employee Name</th>
                    <th scope="col" className="text-center">Email</th>
                    <th scope="col" className="text-center">Department</th>
                    <th scope="col" className="text-center">Employee ID</th>
                    <th scope="col" className="text-center">Date</th>
                    <th scope="col" className="text-center">Time</th>
                    <th scope="col" className="text-center">Reason</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entrySlips.map((slip) => (
                    <tr key={slip.id}>
                      <td className="align-middle text-center">{slip.createdBy?.name}</td>
                      <td className="align-middle text-center">{slip.createdBy?.email}</td>
                      <td className="align-middle text-center">{slip.createdBy?.department}</td>
                      <td className="align-middle text-center">{slip.createdBy?.employeeId}</td>
                      <td className="align-middle text-center">{slip.date}</td>
                      <td className="align-middle text-center">{slip.inTime} - {slip.outTime}</td>
                      <td className="align-middle text-center">{slip.reason}</td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>
                            {entrySlipLoading[slip.id] ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="fas fa-check-circle me-1"></i>
                            )}
                            Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>
                            {entrySlipLoading[slip.id] ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : (
                              <i className="fas fa-times me-1"></i>
                            )}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h5 className="text-secondary">Leave Requests</h5>
          {leaveRequests.length === 0 ? (
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
          )}
        </>
      )}
    </div>
  );
};

export default HRPanel;