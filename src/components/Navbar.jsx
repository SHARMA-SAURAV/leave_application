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
        background: 'linear-gradient(135deg, #003087 0%, #0056b3 50%, #0066cc 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 48, 135, 0.3)',
        height: '80px',
        borderBottom: '3px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="container-fluid">
        {/* Logo & Brand - UNCHANGED */}
        <div className="d-flex align-items-center">
          <img 
            src="/cdacindia_logo.jpg" 
            alt="CDAC India" 
            className="me-3"
            style={{ 
              height: '65px', 
              width: '85px', 
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              border: '3px solid rgba(255,255,255,0.3)'
            }} 
          />
          <div>
            <a
              className="navbar-brand text-white fw-bold mb-0"
              href="/dashboard"
              style={{ 
                fontSize: '1.4rem',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px'
              }}
            >
              Leave Application Manager
            </a>
            <div 
              className="small"
              style={{ 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '500'
              }}
            >
              C-DAC CINE
            </div>
          </div>
        </div>

        {/* User Section - PROFESSIONAL GOVT STYLE */}
        <div className="d-flex align-items-center">
          {email && (
            <div className="d-flex align-items-center gap-3">
              {/* User Greeting - Simple & Clean */}
              <div className="text-end" style={{ 
                fontSize: '0.95rem',
                fontWeight: '500',
                color: 'rgba(255,255,255,0.95)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Welcome</div>
                <div className="fw-semibold">{email.split('@')[0]}</div>
              </div>

              {/* Dashboard Link - Govt Button Style */}
              <a
                href="/dashboard"
                className="btn btn-outline-light px-4 py-2 fw-semibold text-nowrap"
                style={{
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.6)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {/* <i className="fas fa-tachometer-alt me-1"></i> */}
                {/* <FontAwsomeIcon icon={byPrefixAndName.fas["chart-bar"]} /> */}
                <i className="fa-solid fa-chart-bar"></i>
                 Dashboard
              </a>

              {/* Logout Button - Govt Red Style */}
              <button
                onClick={handleLogout}
                className="btn btn-light px-4 py-2 fw-semibold text-nowrap"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#dc3545',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(220,53,69,0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(220,53,69,0.3)';
                }}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Govt Style CSS */}
      <style>{`
        .navbar-brand:hover {
          color: rgba(255,255,255,0.9) !important;
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
        
        @media (max-width: 992px) {
          .navbar .d-flex.align-items-center:last-child {
            margin-left: auto;
          }
        }
        
        @media (max-width: 768px) {
          .navbar-brand { font-size: 1.1rem !important; }
          nav { height: 70px !important; }
          .btn { font-size: 0.85rem !important; padding: 8px 16px !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
