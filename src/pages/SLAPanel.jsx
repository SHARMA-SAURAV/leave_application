import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveApps, setLeaveApps] = useState([]);

  const fetchData = async () => {
    try {
      const entryRes = await api.get('/entry-slip/pending/sla');
      setEntrySlips(entryRes.data);

      const leaveRes = await api.get('/leave/pending/sla');
      setLeaveApps(leaveRes.data);
    } catch (err) {
      console.error('Error fetching SLA data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=SLA`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData(); // Refresh
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      await api.put(`/leave/${action}/${id}?role=SLA`);
      alert(`Leave ${action}ed successfully`);
      fetchData(); // Refresh
    } catch (err) {
      console.error(`Failed to ${action} leave`, err);
    }
  };

  return (
    <div>
      <h2>SLA Panel – Entry Slips</h2>
      {entrySlips.length === 0 ? (
        <p>No pending entry slips.</p>
      ) : (
        entrySlips.map((slip) => (
          <div key={slip.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Email:</strong> {slip.email}</p>
            <p><strong>Date:</strong> {slip.date}</p>
            <p><strong>Time:</strong> {slip.inTime} - {slip.outTime}</p>
            <p><strong>Reason:</strong> {slip.reason}</p>
            <button onClick={() => handleEntrySlipAction(slip.id, 'approve')}>Approve</button>
            <button onClick={() => handleEntrySlipAction(slip.id, 'reject')}>Reject</button>
          </div>
        ))
      )}

      <h2>SLA Panel – Leave Applications</h2>
      {leaveApps.length === 0 ? (
        <p>No pending leave applications.</p>
      ) : (
        leaveApps.map((leave) => (
          <div key={leave.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Email:</strong> {leave.email}</p>
            <p><strong>Dates:</strong> {leave.fromDate} to {leave.toDate}</p>
            <p><strong>Leave Type:</strong> {leave.leaveType} ({leave.dayType})</p>
            <p><strong>Reason:</strong> {leave.reason}</p>
            <button onClick={() => handleLeaveAction(leave.id, 'approve')}>Approve</button>
            <button onClick={() => handleLeaveAction(leave.id, 'reject')}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default SLAPanel;
