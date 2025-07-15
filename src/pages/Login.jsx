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
        background: 'linear-gradient(to right, #e0f2ff, #f0f8ff)',
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
        }}
      >
        <div className="text-center mb-4">
          <i
            className="fa-solid fa-user-shield fa-3x"
            style={{ color: 'rgb(13, 110, 253)' }}
          ></i>
          <h2 className="mt-2" style={{ color: '#333' }}>
            Sign In
          </h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Access your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fas fa-envelope" style={{ color: 'rgb(13, 110, 253)' }}></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fas fa-lock" style={{ color: 'rgb(13, 110, 253)' }}></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
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
              backgroundColor: 'rgb(13, 110, 253)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '8px',
            }}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none">
              <small style={{ color: 'rgb(13, 110, 253)' }}>Forgot password?</small>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
