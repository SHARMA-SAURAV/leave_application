import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FlaApprovalRow } from '../components/LeaveRequestTables';
import { FlaPassApprovalRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';

const FLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [slaUsers, setSlaUsers] = useState([]);
  const [selectedSLA, setSelectedSLA] = useState({});
  const [loading, setLoading] = useState(false);
  const [_, setLeaveActionLoading] = useState({});
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

  const handleSLAChange = (slipId, email) => {
    setSelectedSLA((prev) => ({ ...prev, [slipId]: email }));
  };

  const handleEntrySlipAction = async (id, action) => {
    setLoading(true);
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
            nextApproverEmail: slaEmail,
          },
        });
      } else {
        await api.put(`/entry-slip/${action}/${id}?role=FLA`);
      }
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveApproval = async (id, action, slaId = 0, substitute = '') => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const result = await leaveApproveApi(id, 'fla', action, {
        slaSelected: slaId,
        substituteSelected: substitute,
      });
      if (result) {
        setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} leave request`, err);
    } finally {
      setLeaveActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePassApproval = async (id, action, slaId = 0) => {
    try {
      const result = await movementPassApproveApi(id, 'fla', action, {
        slaSelected: slaId,
      });
      if (result) {
        setMovementPasses((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} movement pass`, err);
    }
  };

  return (
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

      {activeTab === 'entry' && (
        <>
          {/* <h4 className="text-secondary mb-3">Entry Slips</h4> */}
          {entrySlips.length === 0 ? (
            <p className="text-muted">No pending entry slips for FLA.</p>
          ) : (
            <div className="table-responsive mb-4">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center">Employee Name</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Department</th>
                    <th className="text-center">Employee ID</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Reason</th>
                    <th className="text-center">SLA Approver</th>
                    <th className="text-center">Actions</th>
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
                      </td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEntrySlipAction(slip.id, 'approve')}
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="spinner-border spinner-border-sm me-2" />
                            ) : (
                              <i className="fas fa-check-circle me-1"></i>
                            )}
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEntrySlipAction(slip.id, 'reject')}
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="spinner-border spinner-border-sm me-2" />
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
        </>
      )}

      {activeTab === 'leave' && (
        <>
          {/* <h4 className="text-secondary mb-3">Leave Requests</h4> */}
          {leaveRequests.length === 0 ? (
            <p className="text-muted">No pending leave applications for FLA.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Dept</th>
                    <th>Leave Period</th>
                    <th>Reason</th>
                    <th>Leave Days</th>
                    <th>SLA Approver</th>
                    <th>Substitute</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request) => (
                    <FlaApprovalRow
                      key={request.id}
                      request={request}
                      approvers={slaUsers}
                      action={handleLeaveApproval}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'pass' && (
        <>
          {/* <h4 className="text-secondary mb-3">Movement Passes</h4> */}
          {movementPasses.length === 0 ? (
            <p className="text-muted">No pending movement passes for FLA.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Dept</th>
                    <th>Date</th>
                    <th>Time Period</th>
                    <th>Reason</th>
                    <th>SLA Approver</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movementPasses.map((request) => (
                    <FlaPassApprovalRow
                      key={request.id}
                      request={request}
                      approvers={slaUsers}
                      action={handlePassApproval}
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

export default FLAPanel;
