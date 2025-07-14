import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');
  const [userRoles, setUserRoles] = useState([]);
  const [_, setEntrySlips] = useState([]);
  const [__, setLeaveApps] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('activeRole') || '';
    const storedRoles = JSON.parse(localStorage.getItem('roles')) || [];

    setActiveRole(storedRole);
    setUserRoles(storedRoles);

    if (storedRole === 'USER') {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [entryRes, leaveRes] = await Promise.all([
        api.get('/entry-slip/user'),
        api.get('/leave/user'),
      ]);
      setEntrySlips(entryRes.data);
      setLeaveApps(leaveRes.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    localStorage.setItem('activeRole', role);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Dashboard ({activeRole})</h2>

      {/* 🎯 Dynamic Role Switcher */}
      <div className="d-flex justify-content-center mb-4 gap-3 flex-wrap">
        {userRoles.map((role) => (
          <div
            key={role}
            onClick={() => handleRoleChange(role)}
            className={`card px-4 py-2 text-center shadow-sm ${activeRole === role ? 'bg-primary text-white' : 'bg-light'
              }`}
            style={{ cursor: 'pointer', minWidth: '120px', borderRadius: '12px' }}
          >
            <div className="card-body p-2">
              <h6 className="m-0">{role}</h6>
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* 🎯 Role-based Dashboard Actions */}
      <div className="text-center">
        {activeRole === 'USER' && (
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-primary" onClick={() => navigate('/apply-leave')}>
              Apply for Leave
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/entry-slip')}>
              Apply for Entry Slip
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/apply-movement-pass')}>
              Apply for Movement Pass
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate('/leave-status')}>
              Track Leave
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate('/entry-slip-status')}>
              Track Entry Slip
            </button>
            <button className="btn btn-outline-success" onClick={() => navigate('/movement-pass-status')}>
              Track Movement Pass
            </button>
          </div>
        )}

        {activeRole === 'FLA' && (

          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/fla-dashboard')}>
              View Pending Approvals (FLA)
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate('/fla-upcoming')}>
              View Upcoming Leaves (FLA)
            </button>
          </div>
        )}

        {activeRole === 'SLA' && (
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/sla-dashboard')}>
              View Pending Approvals (SLA)
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate('/sla-upcoming')}>
              View Upcoming Leaves (SLA)
            </button>
          </div>
        )}

        {activeRole === 'HR' && (
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => navigate('/hr-dashboard')}>
              View Pending Approvals (HR)
            </button>
            <button className="btn btn-outline-info" onClick={() => navigate('/hr-upcoming')}>
              View Upcoming Leaves (HR)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

