// EntrySlipStatus.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Status.css'; // Assuming you have a CSS file for styling

const EntrySlipStatus = () => {
  const [slips, setSlips] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/entry-slip/user');
        setSlips(res.data);
      } catch (err) {
        console.error('Failed to fetch status:', err);
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
        : steps.findIndex((step) => status.includes(step)) + 1;

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
      <h3>Your Entry Slip Status</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {slips.map((slip) => (
            <tr key={slip.id}>
              <td>{slip.date}</td>
              <td>{slip.inTime} - {slip.outTime}</td>
              <td>{slip.reason}</td>
              <td>{slip.status}</td>
              <td>{renderProgress(slip.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntrySlipStatus;
