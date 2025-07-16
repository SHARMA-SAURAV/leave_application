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
  const [view, setView] = useState('pending');
  const [__, setEntrySlipLoading] = useState({});
  const [_, setLeaveActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState('entry');

  const fetchData = async () => {
    try {
      const entryRes = await api.get(view === 'pending' ? '/entry-slip/pending/hr' : '/entry-slip/approved');
      const data = entryRes.data;
      for (let slip of data) {
        slip.loading = false;
      }
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
  };

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
    } finally {
      setEntrySlipLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleLeaveApproval = async (id, action) => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    const result = await leaveApproveApi(id, 'hr', action);
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
    setLeaveActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handlePassApproval = async (id, action) => {
    try {
      const result = await movementPassApproveApi(id, 'hr', action);
      if (result) {
        setMovementPasses((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} movement pass`, err);
    }
  };

  const downloadPDF = (title, data, fileName) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 20);
    autoTable(doc, {
      startY: 30,
      body: data,
    });
    doc.save(`${fileName}.pdf`);
  };

  const getNotificationBadge = (count) => (
    count > 0 && <span className="badge bg-danger ms-1">{count}</span>
  );

  const getLeavesUsed = (leave) => {
    return leave.leaveTypes.map((type) => (
      (<span key={type} className="badge bg-success ms-1 me-1">{type}</span>)
    ))
  }

  const getEntrySlipButtons = (slip) => {
    if (slip.loading) {
      return (
        <div className="text-center">
          <strong>Please wait...</strong>
        </div>
      )
    }
    return (
      <>
        <button className="btn btn-success btn-sm me-2" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>Approve</button>
        <button className="btn btn-danger btn-sm" onClick={() => handleEntrySlipAction(slip.id, 'reject')}>Reject</button>
      </>
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'entry') {
      const data = view === 'pending' ? entrySlips : entrySlips;
      return (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th><th>Email</th><th>Dept</th><th>Date</th><th>Time</th><th>Reason</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
              ) : (
                data.map((slip) => (
                  <tr key={slip.id}>
                    <td>{slip.createdBy?.name}</td>
                    <td>{slip.createdBy?.email}</td>
                    <td>{slip.createdBy?.department}</td>
                    <td>{slip.date}</td>
                    <td>{slip.inTime} - {slip.outTime}</td>
                    <td>{slip.reason}</td>
                    <td>
                      {view === 'pending' ? (
                        getEntrySlipButtons(slip)
                      ) : (
                        <button className="btn btn-outline-dark btn-sm" onClick={() => downloadPDF('Entry Slip', [
                          ['Created By', slip.createdBy?.name || 'N/A'],
                          ['Email', slip.createdBy?.email || 'N/A'],
                          ['Date', slip.date],
                          ['Time', `${slip.inTime} - ${slip.outTime}`],
                          ['Reason', slip.reason],
                          ['Status', slip.status],
                        ], `entry-slip-${slip.id}`)}>
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'leave') {
      const data = view === 'pending' ? leaveRequests : approvedLeaveRequests;
      return (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Employee</th>
                <th>Email</th>
                <th>Period</th>
                <th>Reason</th>
                <th>Types</th>
                <th>Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No data found.</td></tr>
              ) : (
                data.map((request) => (
                  <tr key={request.id}>
                    <td>{request.requestedBy?.name}</td>
                    <td>{request.requestedBy?.email}</td>
                    <td>{request.startDate} to {request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>{getLeavesUsed(request)}</td>
                    <td>{request.leaveCount}</td>
                    <td>
                      {view === 'pending' ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleLeaveApproval(request.id, 'approve')}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleLeaveApproval(request.id, 'reject')}>Reject</button>
                        </>
                      ) : (
                        <button className="btn btn-outline-dark btn-sm" onClick={() => downloadPDF('Leave Application', [
                          ['Name', request.requestedBy?.name],
                          ['Email', request.requestedBy?.email],
                          ['Dates', `${request.startDate} - ${request.endDate}`],
                          ['Leave Types', request.leaveTypes.join(", ")],
                          ['Leave Count', request.leaveCount],
                          ['Status', request.status],
                        ], `leave-${request.id}`)}>
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'movement') {
      const data = view === 'pending' ? movementPasses : approvedMovementPasses;
      return (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Employee</th><th>Email</th><th>Date</th><th>Time</th><th>Reason</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No data found.</td></tr>
              ) : (
                data.map((request) => (
                  <tr key={request.id}>
                    <td>{request.requestedBy?.name}</td>
                    <td>{request.requestedBy?.email}</td>
                    <td>{request.date}</td>
                    <td>{request.startTime} - {request.endTime}</td>
                    <td>{request.reason}</td>
                    <td>
                      {view === 'pending' ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handlePassApproval(request.id, 'approve')}>Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handlePassApproval(request.id, 'reject')}>Reject</button>
                        </>
                      ) : (
                        <button className="btn btn-outline-dark btn-sm" onClick={() => downloadPDF('Movement Pass', [
                          ['Name', request.requestedBy?.name],
                          ['Email', request.requestedBy?.email],
                          ['Date', request.date],
                          ['Time', `${request.startTime} - ${request.endTime}`],
                          ['Status', request.status],
                        ], `movement-${request.id}`)}>
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h3 className="text-primary mb-3">HR Panel – {view === 'pending' ? 'Pending' : 'Approved'} Applications</h3>
        <div className="mb-3">
          <button className={`btn btn-${view === 'pending' ? 'primary' : 'outline-primary'} me-2`} onClick={() => setView('pending')}>Pending</button>
          <button className={`btn btn-${view === 'approved' ? 'primary' : 'outline-primary'}`} onClick={() => setView('approved')}>Approved</button>
        </div>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'entry' ? 'active' : ''}`} onClick={() => setActiveTab('entry')}>Entry Slips {getNotificationBadge(view === 'pending' ? entrySlips.length : 0)}</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'leave' ? 'active' : ''}`} onClick={() => setActiveTab('leave')}>Leave Requests {getNotificationBadge(view === 'pending' ? leaveRequests.length : 0)}</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'movement' ? 'active' : ''}`} onClick={() => setActiveTab('movement')}>Movement Passes {getNotificationBadge(view === 'pending' ? movementPasses.length : 0)}</button>
          </li>
        </ul>

      </div>
      <div className="me-2 ms-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HRPanel;
