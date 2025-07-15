import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const allRoles = ['USER', 'FLA', 'SLA', 'HR'];

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    employeeId: '',
    phoneNumber: '',
    sex: 'MALE',
    roles: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(''); // Clear error on input change

    if (name === "phoneNumber") {
      // 1. Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      // 2. Limit to a maximum of 10 digits as the user types
      const truncatedValue = cleanedValue.slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: truncatedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (role) => {
    setForm((prev) => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const validateForm = () => {
    const {
      name, email, password, department, designation,
      employeeId, phoneNumber, roles
    } = form;

    if (!name || !email || !password || !department || !designation || !employeeId || !phoneNumber) {
      return 'All fields are required';
    }
    if (roles.length === 0) {
      return 'At least one role must be selected';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    // Phone Number Validation: Exactly 10 digits and only numbers
    if (!/^\d{10}$/.test(phoneNumber)) {
      return 'Phone number must be exactly 10 digits';
    }

    return ''; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('User registered successfully!');
      // Clear form after successful registration
      setForm({
        name: '',
        email: '',
        password: '',
        department: '',
        designation: '',
        employeeId: '',
        phoneNumber: '',
        sex: 'MALE',
        roles: [],
      });
    } catch (err) {
      if (err.response?.data?.includes('exists')) {
        setError('User already exists with this email');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '700px', borderRadius: '16px' }}>
        <h4 className="mb-4 text-center text-primary">
          <i className="fas fa-user-plus me-2"></i>
          Create Account
        </h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="employeeId" className="form-label">Employee ID</label>
              <input
                id="employeeId"
                name="employeeId"
                className="form-control"
                value={form.employeeId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <input
                id="department"
                name="department"
                className="form-control"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="designation" className="form-label">Designation</label>
              <input
                id="designation"
                name="designation"
                className="form-control"
                value={form.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                className="form-control"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                type="tel" // Suggests a numeric keyboard on mobile devices
                maxLength="10" // HTML attribute to prevent typing more than 10 characters
                // pattern="\d{10}" // You can keep this for browser-level validation, but JS handles it
                title="Phone number must be exactly 10 digits" // Tooltip for pattern
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="sex" className="form-label">Gender</label>
              <select
                id="sex"
                name="sex"
                className="form-select"
                value={form.sex}
                onChange={handleChange}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Custom Multi-Select Dropdown for Roles */}
          <div className="mb-3" ref={dropdownRef}>
            <label className="form-label fw-semibold">Assign Roles</label>
            <button
              type="button"
              className="form-control text-start d-flex justify-content-between align-items-center"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className={form.roles.length ? '' : 'text-muted'}>
                <i className="fas fa-user-shield me-2"></i>
                {form.roles.length === 0 ? 'Select roles...' : `${form.roles.length} role(s) selected`}
              </span>
              <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
            </button>

            {isDropdownOpen && (
              <div
                className="border rounded mt-1 shadow-sm bg-white p-2"
                style={{ maxHeight: '200px', overflowY: 'auto', position: 'absolute', zIndex: 1000, width: '100%' }}
              >
                {allRoles.map((role) => (
                  <div key={role} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`role-${role}`}
                      checked={form.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                    <label className="form-check-label" htmlFor={`role-${role}`}>
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {form.roles.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {form.roles.map((role) => (
                  <span
                    key={role}
                    className="badge bg-primary px-3 py-2 rounded-pill d-flex align-items-center"
                  >
                    {role}
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm ms-2"
                      onClick={() => handleRoleToggle(role)}
                      style={{ fontSize: '0.6rem' }}
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: '#0d6efd',
                color: '#fff',
                fontWeight: '500',
                borderRadius: '8px',
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus me-2"></i> Create Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;