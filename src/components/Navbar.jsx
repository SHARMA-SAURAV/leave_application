import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const email = localStorage.getItem('email');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <a className="navbar-brand" href="/dashboard">
        Leave Application Manager
      </a>

      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {email && (
            <li className="nav-item me-3">
              <span className="navbar-text text-white">Hello, {email}</span>
            </li>
          )}
          <li className="nav-item">
            <button className="btn btn-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
