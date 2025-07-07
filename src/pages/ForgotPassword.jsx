import React, { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', null, { params: { email } });
      setStatus('success');
    } catch (err) {
      console.error('Error sending reset email:', err);
      setStatus('error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-3">Forgot Password</h3>
        <p className="text-muted text-center">Enter your email to receive a reset link.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-100" type="submit">Send Reset Link</button>

          {status === 'success' && (
            <p className="text-success mt-3 text-center">Reset link sent! Check your email.</p>
          )}
          {status === 'error' && (
            <p className="text-danger mt-3 text-center">Failed to send reset link. Try again.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
