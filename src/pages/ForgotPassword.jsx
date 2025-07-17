import React, { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', null, { params: { email } });
      setStatus('success');
    } catch (err) {
      console.error('Error sending reset email:', err);
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
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

          <button className="btn btn-primary w-100" type="submit">
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i> Send Reset Link
              </>
            )}
          </button>

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
