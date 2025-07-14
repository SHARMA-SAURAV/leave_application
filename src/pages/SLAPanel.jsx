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

  const fetchMovementPasses = async () => {
    try {
      const res = await api.get('/movement/sla/all');
      setMovementPasses(res.data);
    } catch (err) {
      console.error('Error fetching movement passes:', err);
    }
  }

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
    }
    finally {
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
  }

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
    <div className="container mt-4">
      <h3 className="text-primary mb-4">SLA Panel – Entry Slips</h3>

      {entrySlips.length === 0 ? (
        <p className="text-muted">No pending entry slips.</p>
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

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')}>

                  {loading ? (
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
                  {loading ? (
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
            </div>
          </div>
        ))
      )}

      <h3 className="text-primary mb-4">Leave Requests</h3>
      {leaveRequests.length === 0 ? (
        <p className="text-muted">No pending leave applications for SLA.</p>
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


      <h3 className="text-primary mb-4">Movement Passes</h3>
      {movementPasses.length === 0 ? (
        <p className="text-muted">No pending movement passes for SLA.</p>
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
    </div>
  );
};

export default SLAPanel;
