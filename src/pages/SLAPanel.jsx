import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SlaApprovalRow } from '../components/LeaveRequestTables';
import { SlaPassApprovalRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';

const SLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_, setLeaveActionLoading] = useState({});
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
    setLoading(true);
    try {
      await api.put(`/entry-slip/${action}/${id}?role=SLA`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData(); // Refresh
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveApproval = async (id, action, substitute = null) => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    const result = await leaveApproveApi(id, "sla", action, { substituteSelected: substitute });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
    setLeaveActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handlePassApproval = async (id, action) => {
    try {
      const result = await movementPassApproveApi(id, "sla", action);
      if (result) {
        setMovementPasses((prev) => prev.filter((request) => request.id !== id));
      }
    } catch (err) {
      console.error(`Failed to ${action} movement pass`, err);
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
          <>
            {entrySlips.length === 0 ? (
              <p className="text-muted">No pending entry slips.</p>
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
                        <td className="align-middle text-center">
                          {slip.inTime} - {slip.outTime}
                        </td>
                        <td className="align-middle text-center">{slip.reason}</td>
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
            {leaveRequests.length === 0 ? (
              <p className="text-muted">No pending leave applications for SLA.</p>
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
                      <th>Leave Types</th>
                      <th>Leave Count</th>
                      <th>Substitute</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <SlaApprovalRow
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
        {activeTab === 'pass' && (
          <>
            {movementPasses.length === 0 ? (
              <p className="text-muted">No pending movement passes for SLA.</p>
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
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movementPasses.map((request) => (
                      <SlaPassApprovalRow
                        key={request.id}
                        request={request}
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
    </div>
  );
};

export default SLAPanel;
