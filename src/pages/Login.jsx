import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      const { password, email } = res.data;
      localStorage.setItem('token', email);
      localStorage.setItem('email', password);
      localStorage.setItem('roles', JSON.stringify(res.data.roles));
      localStorage.setItem('activeRole', res.data.roles[0]);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed.');
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f0f7ff, #f8fbff)',
        padding: '2rem',
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '430px',
          borderRadius: '20px',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0, 48, 135, 0.1)',
        }}
      >
        <div className="text-center mb-4">
          <i
            className="fa-solid fa-user-shield fa-3x"
            style={{ color: '#0056b3' }}
          ></i>
          <h2 className="mt-2" style={{ color: '#1a1a1a' }}>
            Sign In
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Access your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: '#1e3a8a' }}>Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0" style={{ borderColor: '#e2e8f0' }}>
                <i className="fas fa-envelope" style={{ color: '#0056b3' }}></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control border-start-0 shadow-sm"
                style={{ borderColor: '#e2e8f0' }}
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: '#1e3a8a' }}>Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0" style={{ borderColor: '#e2e8f0' }}>
                <i className="fas fa-lock" style={{ color: '#0056b3' }}></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control border-start-0 shadow-sm"
                style={{ borderColor: '#e2e8f0' }}
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: 'linear-gradient(135deg, #0056b3 0%, #0066cc 100%)',
              color: '#ffffff',
              fontWeight: '600',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 48, 135, 0.3)',
              padding: '12px 24px',
              fontSize: '1rem'
            }}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none">
              <small style={{ color: '#1e40af' }}>Forgot password?</small>
            </Link>
          </div>
        </form>
      </div>
    </div>
    
  );
};

export default Login;
