import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4"
      style={{
        background: 'linear-gradient(to right, rgb(13, 110, 253), #2b72e4)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <a
        className="navbar-brand text-white fw-bold"
        href="/dashboard"
        style={{ fontSize: '1.25rem' }}
      >
        Leave Application Manager
      </a>

      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav align-items-center">
          {email && (
            <>
              <li className="nav-item me-3">
                <span className="navbar-text text-white fw-medium">
                  Hello, {email}
                </span>
              </li>
              <li className="nav-item me-2">
                <button
                  className="btn btn-outline-light btn-sm"
                  style={{ borderRadius: '6px' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-light btn-sm"
                  style={{
                    color: 'rgb(13, 110, 253)',
                    fontWeight: '500',
                    borderRadius: '6px',
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
