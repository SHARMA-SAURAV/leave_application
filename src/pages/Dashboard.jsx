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
    <div
      className="container-fluid py-5"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f0f7ff, #f8fbff)',
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center text-dark fw-bold" style={{ color: '#1a1a1a' }}>
          Dashboard ({activeRole})
        </h2>

        {/* 🎯 Role Switcher */}
        <div className="d-flex justify-content-center mb-4 gap-3 flex-wrap">
          {userRoles.map((role) => (
            <div
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`shadow-sm px-4 py-2 text-center ${activeRole === role
                ? 'text-white'
                : 'text-dark bg-white border border-light'
                }`}
              style={{
                backgroundColor: activeRole === role ? '#0056b3' : '#fff',
                cursor: 'pointer',
                borderRadius: '12px',
                minWidth: '130px',
                transition: 'all 0.3s ease',
                borderColor: activeRole === role ? '#0056b3' : '#e2e8f0'
              }}
            >
              <h6 className="m-0 fw-semibold">{role}</h6>
            </div>
          ))}
        </div>

        <hr className="text-secondary" style={{ borderColor: 'rgba(0, 48, 135, 0.2)' }} />

        {/* 🎯 Role Based Actions */}
        <div className="text-center">
          {activeRole === 'USER' && (
            <div className="row justify-content-center g-4">
              {[
                { label: 'Apply for Leave', icon: 'calendar-plus', route: '/apply-leave' },
                { label: 'Entry Slip', icon: 'door-open', route: '/entry-slip' },
                { label: 'Movement Pass', icon: 'route', route: '/apply-movement-pass' },
                { label: 'Track Leave', icon: 'clipboard-check', route: '/leave-status' },
                { label: 'Entry Slip Status', icon: 'history', route: '/entry-slip-status' },
                { label: 'Movement Pass Status', icon: 'road', route: '/movement-pass-status' },
              ].map(({ label, icon, route }) => (
                <div className="col-md-4" key={label}>
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{ 
                      cursor: 'pointer', 
                      borderRadius: '16px',
                      borderColor: 'rgba(0, 86, 179, 0.1)',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate(route)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 86, 179, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="card-body d-flex align-items-center gap-3 p-4">
                      <i
                        className={`fas fa-${icon} fa-lg`}
                        style={{ color: '#0056b3', minWidth: '30px' }}
                      ></i>
                      <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>{label}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeRole === 'FLA' && (
            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/fla-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-tasks fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Pending Approvals (FLA)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/fla-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Upcoming Leaves (FLA)</h6>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'SLA' && (
            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/sla-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-tasks fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Pending Approvals (SLA)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/sla-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Upcoming Leaves (SLA)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/leave-calender')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Attendance | Leave Record</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/attendance-analytics')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-chart-line fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Attendance Analytics</h6>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'HR' && (
            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/hr-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-user-check fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Pending Approvals (HR)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/hr-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Upcoming Leaves (HR)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/register-user')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-user-plus fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Register New User</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/attendance-analytics')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-chart-line fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Attendance Analytics</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/leave-calender')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Attendance | Leave Record</h6>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px', borderColor: 'rgba(0, 86, 179, 0.1)' }}
                  onClick={() => navigate('/hr-leaveData')}
                >
                  <div className="card-body d-flex align-items-center gap-3 p-4">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: '#0056b3' }}></i>
                    <h6 className="mb-0 text-dark fw-semibold" style={{ color: '#1a1a1a' }}>Leaves Data (HR)</h6>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
