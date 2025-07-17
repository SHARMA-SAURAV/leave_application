import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FlaApprovalRow } from '../components/LeaveRequestTables';
import { FlaPassApprovalRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';
import BaseTable from '../components/BaseTable';
import { FlaEntrySlipApprovalRow } from '../components/EntrySlipTables';

const FLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [slaUsers, setSlaUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('entry');

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
  };

  const fetchMovementPasses = async () => {
    try {
      const res = await api.get('/movement/fla/all');
      setMovementPasses(res.data);
    } catch (err) {
      console.error('Error fetching movement passes:', err);
    }
  };

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
    fetchMovementPasses();
    fetchSLAs();
  }, []);

  const handleEntrySlipAction = async (id, action, slaId = 0) => {
    try {
      if (action === 'approve') {
        const slaEmail = slaId ? slaUsers.find(user => user.id === parseInt(slaId))?.email : '';
        if (!slaEmail) {
          alert('Please select an SLA approver before approving the entry slip.');
          return;
        }
        await api.put(`/entry-slip/${action}/${id}`, null, {
          params: {
            role: 'FLA',
            nextApproverEmail: slaEmail,
          },
        });
        setEntrySlips((prev) => prev.filter((slip) => slip.id !== id));
      } else {
        await api.put(`/entry-slip/${action}/${id}?role=FLA`);
      }
      alert(`Entry slip ${action}ed successfully`);
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveApproval = async (id, action, slaId = 0, substitute = '') => {
    const result = await leaveApproveApi(id, 'fla', action, {
      slaSelected: slaId,
      substituteSelected: substitute,
    });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const handlePassApproval = async (id, action, slaId = 0) => {
    const result = await movementPassApproveApi(id, 'fla', action, {
      slaSelected: slaId,
    });
    if (result) {
      setMovementPasses((prev) => prev.filter((request) => request.id !== id));
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h3 className="text-primary mb-4">FLA Panel</h3>
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
            columns={["Employee", "Email", "Department", "Date", "Times", "Reason", "SLA Approver", "Actions"]}
            rows={
              entrySlips.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted">No data found.</td></tr>
              ) : (
                entrySlips.map((slip) => (
                  <FlaEntrySlipApprovalRow key={slip.id} slip={slip} action={handleEntrySlipAction} approvers={slaUsers} />
                ))
              )
            }
          />
        )}
        {activeTab === 'leave' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Dates", "Reason", "Types", "Count", "SLA Approver", "Substitute", "Actions"]}
            rows={
              leaveRequests.length === 0 ? (
                <tr><td colSpan="10" className="text-center text-muted">No data found.</td></tr>
              ) : (
                leaveRequests.map((request) => (
                  <FlaApprovalRow key={request.id} request={request} action={handleLeaveApproval} approvers={slaUsers} />
                ))
              )
            }
          />
        )}
        {activeTab === 'pass' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Date", "Time Period", "Reason", "SLA Approver", "Actions"]}
            rows={
              movementPasses.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted">No data found.</td></tr>
              ) : (
                movementPasses.map((pass) => (
                  <FlaPassApprovalRow key={pass.id} request={pass} action={handlePassApproval} approvers={slaUsers} />
                ))
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default FLAPanel;
