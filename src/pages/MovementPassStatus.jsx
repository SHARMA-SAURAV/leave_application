// LeaveStatus.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Status.css';

const MovementPassStatus = () => {
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/movement/user');
        setPasses(res.data);
      } catch (err) {
        console.error('Failed to fetch movement pass status:', err);
      }
    };
    fetchStatus();
  }, []);

  const renderProgress = (status) => {
    switch (status) {
      case 'FLA':
        return <span className="badge bg-warning text-dark">Pending with FLA</span>;
      case 'SLA':
        return <span className="badge bg-warning text-dark">Pending with SLA</span>;
      case 'HR':
        return <span className="badge bg-warning text-dark">Pending with HR</span>;
      case 'APPROVED':
        return <span className="badge bg-success">Approved</span>;
      case 'REJECTED':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h3>Your Movement Pass Status</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Period</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((pass) => (
            <tr key={pass.id}>
              <td>{pass.date}</td>
              <td>{pass.startTime} to {pass.endTime}</td>
              <td>{pass.reason}</td>
              <td>{renderProgress(pass.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementPassStatus;