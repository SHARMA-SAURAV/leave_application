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

  const getLeavesUsed = (leave) => {
    const leavesUsed = [['CL', leave.clLeaves], ['PL', leave.plLeaves], ['RH', leave.rhLeaves], ['Other', leave.otherLeaves]];
    return leavesUsed.map(([type, count]) => (
      (count > 0) && (<span key={type} className="badge bg-success ms-1 me-1">{type}:{count}</span>)
    ))
  }

  return (
    <div className="container mt-4">
      <h3>Your Leave Application Status</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Dates</th>
            <th>Leaves Used</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.startDate} to {leave.endDate}</td>
              <td>{getLeavesUsed(leave)}</td>
              <td>{leave.reason}</td>
              <td>{renderProgress(leave.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveStatus;