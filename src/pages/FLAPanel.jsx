import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FlaApprovalRow } from '../components/LeaveRequestTables';
import { leaveApproveApi } from '../services/leave';


const FLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [slaUsers, setSlaUsers] = useState([]);
  const [selectedSLA, setSelectedSLA] = useState({});
  const [loading, setLoading] = useState(false);
  const [_, setLeaveActionLoading] = useState({});


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
  }

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
            nextApproverEmail: slaEmail
          }
        });
      } else {
        await api.put(`/entry-slip/${action}/${id}?role=FLA`);
      }
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleLeaveApproval = async (id, action, slaId = 0, substitute = "") => {
    setLeaveActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const result = await leaveApproveApi(id, "fla", action, {
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

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">FLA Panel – Entry Slips</h3>

      {entrySlips.length === 0 ? (
        <p className="text-muted">No pending entry slips for FLA.</p>
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

              <div className="mb-3">
                <label className="form-label">Select SLA Approver</label>
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
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={() => handleEntrySlipAction(slip.id, 'approve')} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle me-1"></i> Approve
                    </>
                  )}




                </button>
                <button className="btn btn-danger" onClick={() => handleEntrySlipAction(slip.id, 'reject')} disabled={loading}>


                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
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
        <p className="text-muted">No pending leave applications for FLA.</p>
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
                <th scope="col">SLA Approver</th>
                <th scope="col">Substitute</th>
                <th scope="col" className="text-center">Actions</th>
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
    </div>
  );
};

export default FLAPanel;
