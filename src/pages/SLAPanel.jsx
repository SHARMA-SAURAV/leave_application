import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SlaApprovalRow } from '../components/LeaveRequestTables';
import { SlaPassApprovalRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';
import { SlaEntrySlipApprovalRow } from '../components/EntrySlipTables';
import BaseTable from '../components/BaseTable';

const SLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [activeTab, setActiveTab] = useState('entry');

  const fetchData = async () => {
    try {
      const entryRes = await api.get('/entry-slip/pending/sla');
      setEntrySlips(entryRes.data);
    } catch (err) {
      console.error('Error fetching SLA entry slips:', err);
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

  const fetchMovementPasses = async () => {
    try {
      const res = await api.get('/movement/sla/all');
      setMovementPasses(res.data);
    } catch (err) {
      console.error('Error fetching movement passes:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
    fetchMovementPasses();
  }, []);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=SLA`);
      alert(`Entry slip ${action}ed successfully`);
      setEntrySlips((prev) => prev.filter((slip) => slip.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveApproval = async (id, action, substitute = null) => {
    const result = await leaveApproveApi(id, "sla", action, { substituteSelected: substitute });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const handlePassApproval = async (id, action) => {
    const result = await movementPassApproveApi(id, "sla", action);
    if (result) {
      setMovementPasses((prev) => prev.filter((request) => request.id !== id));
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h3 className="text-primary mb-4">SLA Panel</h3>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'entry' ? 'active' : ''}`}
              onClick={() => setActiveTab('entry')}
            >
              Entry Slips{' '}
              {entrySlips.length > 0 && (
                <span className="badge bg-danger ms-1">{entrySlips.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'leave' ? 'active' : ''}`}
              onClick={() => setActiveTab('leave')}
            >
              Leave Requests{' '}
              {leaveRequests.length > 0 && (
                <span className="badge bg-danger ms-1">{leaveRequests.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'pass' ? 'active' : ''}`}
              onClick={() => setActiveTab('pass')}
            >
              Movement Passes{' '}
              {movementPasses.length > 0 && (
                <span className="badge bg-danger ms-1">{movementPasses.length}</span>
              )}
            </button>
          </li>
        </ul>
      </div>
      <div className="me-2 ms-2">
        {activeTab === 'entry' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Date", "Times", "Reason", "Actions"]}
            rows={
              entrySlips.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
              ) : (
                entrySlips.map((slip) => (
                  <SlaEntrySlipApprovalRow key={slip.id} slip={slip} action={handleEntrySlipAction} />
                ))
              )
            }
          />
        )}
        {activeTab === 'leave' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Dates", "Reason", "Types", "Count", "Substitute", "Actions"]}
            rows={
              leaveRequests.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted">No data found.</td></tr>
              ) : (
                leaveRequests.map((request) => (
                  <SlaApprovalRow key={request.id} request={request} action={handleLeaveApproval} />
                ))
              )
            }
          />
        )}
        {activeTab === 'pass' && (
          <BaseTable
            columns={["Employee", "Email", "Dept", "Date", "Time Period", "Reason", "Actions"]}
            rows={
              movementPasses.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
              ) : (
                movementPasses.map((pass) => (
                  <SlaPassApprovalRow key={pass.id} request={pass} action={handlePassApproval} />
                ))
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default SLAPanel;
