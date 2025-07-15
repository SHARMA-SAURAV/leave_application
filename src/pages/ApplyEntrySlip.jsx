import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApplyEntrySlip = () => {
  const [form, setForm] = useState({
    date: '',
    inTime: '',
    outTime: '',
    reason: '',
    approverEmail: ''
  });
  const [approverRole, setApproverRole] = useState('FLA');
  const [approverList, setApproverList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await api.get(`/users?role=${approverRole}`);
        setApproverList(res.data);
      } catch (err) {
        console.error('Error fetching approvers:', err);
      }
    };
    fetchApprovers();
  }, [approverRole]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        `/entry-slip/apply?targetLevel=${approverRole}&approverEmail=${form.approverEmail}`,
        { ...form }
      );
      alert('Entry slip submitted!');
      setForm({
        date: '',
        inTime: '',
        outTime: '',
        reason: '',
        approverEmail: ''
      });
    } catch (err) {
      alert('Failed to submit entry slip.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const primaryBlue = 'rgb(13, 110, 253)';

  return (
    <div className="container my-5">
      <div
        className="card shadow p-4 mx-auto"
        style={{
          maxWidth: '600px',
          borderRadius: '16px',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0'
        }}
      >
        <h4 className="mb-4 text-center" style={{ color: primaryBlue }}>
          <i className="fas fa-door-open me-2"></i>
          Apply Entry Slip
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">In Time</label>
              <input
                type="time"
                name="inTime"
                className="form-control"
                value={form.inTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Out Time</label>
              <input
                type="time"
                name="outTime"
                className="form-control"
                value={form.outTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Select Approver Type</label>
            <select
              className="form-select"
              value={approverRole}
              onChange={(e) => setApproverRole(e.target.value)}
            >
              <option value="FLA">FLA</option>
              <option value="SLA">SLA</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Select Approver</label>
            <select
              name="approverEmail"
              className="form-select"
              value={form.approverEmail}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Approver --</option>
              {approverList.map((person) => (
                <option key={person.email} value={person.email}>
                  {person.name} ({person.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Reason</label>
            <textarea
              name="reason"
              className="form-control"
              rows="3"
              placeholder="Enter reason..."
              value={form.reason}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{
                backgroundColor: primaryBlue,
                color: '#fff',
                fontWeight: '500',
                borderRadius: '8px'
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>Submit Entry Slip
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyEntrySlip;
