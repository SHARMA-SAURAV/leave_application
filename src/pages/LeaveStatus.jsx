// LeaveStatus.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Status.css';

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/leave/all');
        setLeaves(res.data);
      } catch (err) {
        console.error('Failed to fetch leave status:', err);
      }
    };
    fetchStatus();
  }, []);

  const renderProgress = (status) => {
    const steps = ['FLA', 'SLA', 'HR'];
    const currentIndex =
      status === 'COMPLETED'
        ? 3
        : status === 'REJECTED'
        ? -1
        : steps.findIndex((step) => status === step) + 1;

    return (
      <div className="progress-tracker">
        {steps.map((step, index) => (
          <div key={step} className={`step ${index < currentIndex ? 'active' : ''}`}>
            {step}
          </div>
        ))}
        {status === 'COMPLETED' && <div className="step active">DONE</div>}
        {status === 'REJECTED' && <div className="step rejected">REJECTED</div>}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h3>Your Leave Application Status</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Dates</th>
            <th>Leave Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.startDate} to {leave.endDate}</td>
              <td>
                {leave.plLeave ? 'PL ' : ''}
                {leave.clLeave ? 'CL ' : ''}
                {leave.rhLeave ? 'RH' : ''}
              </td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>{renderProgress(leave.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveStatus;