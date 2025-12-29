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
        background: 'linear-gradient(to right, #e0f2ff, #f0f8ff)',
      }}
    >
      <div className="container">
        <h2 className="mb-4 text-center text-dark fw-bold">
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
                backgroundColor: activeRole === role ? 'rgb(13, 110, 253)' : '#fff',
                cursor: 'pointer',
                borderRadius: '12px',
                minWidth: '130px',
                transition: 'all 0.3s ease',
              }}
            >
              <h6 className="m-0">{role}</h6>
            </div>
          ))}
        </div>

        <hr className="text-secondary" />

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
                    style={{ cursor: 'pointer', borderRadius: '16px' }}
                    onClick={() => navigate(route)}
                  >
                    <div className="card-body d-flex align-items-center gap-3">
                      <i
                        className={`fas fa-${icon} fa-lg`}
                        style={{ color: 'rgb(13, 110, 253)', minWidth: '30px' }}
                      ></i>
                      <h6 className="mb-0 text-dark">{label}</h6>
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
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/fla-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-tasks fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Pending Approvals (FLA)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/fla-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Upcoming Leaves (FLA)</h6>
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
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/sla-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-tasks fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Pending Approvals (SLA)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/sla-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Upcoming Leaves (SLA)</h6>
                  </div>
                </div>
              </div>



              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/leave-calender')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Attendance | Leave Record</h6>
                  </div>
                </div>
              </div>

                 <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/attendance-analytics')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-chart-line fa-lg"
                      style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Attendance Analytics</h6>
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
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/hr-dashboard')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-user-check fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Pending Approvals (HR)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/hr-upcoming')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Upcoming Leaves (HR)</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/register-user')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-user-plus fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Register New User</h6>
                  </div>
                </div>
              </div>



              <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/attendance-analytics')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-chart-line fa-lg"
                      style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Attendance Analytics</h6>
                  </div>
                </div>
              </div>


                 <div className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderRadius: '16px' }}
                  onClick={() => navigate('/leave-calender')}
                >
                  <div className="card-body d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-alt fa-lg" style={{ color: 'rgb(13, 110, 253)' }}></i>
                    <h6 className="mb-0 text-dark">Attendance | Leave Record</h6>
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
