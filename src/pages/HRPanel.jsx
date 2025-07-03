import React, { useEffect, useState } from 'react';
import api from '../services/api';

const HRPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveApps, setLeaveApps] = useState([]);

  const fetchData = async () => {
  try {
    const entryRes = await api.get('/entry-slip/pending/hr');
    console.log('EntrySlips from backend:', entryRes.data); // 🔍 See this output
    setEntrySlips(entryRes.data);

    const leaveRes = await api.get('/leave/pending/hr');
    console.log('LeaveApps from backend:', leaveRes.data);
    setLeaveApps(leaveRes.data);
  } catch (err) {
    console.error('Error fetching HR data:', err);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=HR`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      await api.put(`/leave/${action}/${id}?role=HR`);
      alert(`Leave ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} leave`, err);
    }
  };

  return (
    <div>
      <h2>HR Panel – Entry Slips</h2>
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

      <h2>HR Panel – Leave Applications</h2>
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

export default HRPanel;
