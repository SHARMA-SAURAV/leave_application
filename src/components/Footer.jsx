import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-3" style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(0, 48, 135, 0.1)',
      fontSize: '13px',
      color: '#6b7280',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999
    }}>
      <div>
        <strong>Leave Management Portal</strong><br/>
        <small>CDAC CINE | © 2026 Government of India</small>
      </div>
    </footer>
  );
};

export default Footer;
