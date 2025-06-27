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
    try {
      await api.post(`/entry-slip/apply?targetLevel=${approverRole}`, {
        ...form
      });
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply Entry Slip</h2>

      <input type="date" name="date" value={form.date} onChange={handleChange} required />
      <input type="time" name="inTime" value={form.inTime} placeholder="In Time" onChange={handleChange} required />
      <input type="time" name="outTime" value={form.outTime} placeholder="Out Time" onChange={handleChange} required />

      <label>Select Approver Type</label>
      <select value={approverRole} onChange={(e) => setApproverRole(e.target.value)}>
        <option value="FLA">FLA</option>
        <option value="SLA">SLA</option>
      </select>

      <label>Select Approver</label>
      <select name="approverEmail" value={form.approverEmail} onChange={handleChange} required>
        <option value="">Select Approver</option>
        {approverList.map((person) => (
          <option key={person.email} value={person.email}>
            {person.name} ({person.email})
          </option>
        ))}
      </select>

      <textarea name="reason" placeholder="Reason" value={form.reason} onChange={handleChange} required />

      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplyEntrySlip;
