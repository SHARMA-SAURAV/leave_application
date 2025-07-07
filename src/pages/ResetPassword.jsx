import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token: token,
        newPassword: form.newPassword
      });

      alert('Password reset successfully!');
      navigate('/'); // go to login
    } catch (err) {
      console.error('Reset error:', err);
      setMessage('Failed to reset password. Token may be invalid or expired.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-3">Reset Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="text-danger">{message}</p>}

          <button type="submit" className="btn btn-success w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
