import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
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

  const allRoles = ['USER', 'FLA', 'SLA', 'HR', 'ADMIN'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const roles = prev.roles.includes(value)
        ? prev.roles.filter((r) => r !== value)
        : [...prev.roles, value];
      return { ...prev, roles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Registration failed.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="department" placeholder="Department" onChange={handleChange} required />
      <input name="designation" placeholder="Designation" onChange={handleChange} required />
      <input name="employeeId" placeholder="Employee ID" onChange={handleChange} required />
      <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />

      <label>Sex:</label>
      <select name="sex" onChange={handleChange}>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>

      <div>
        <label>Assign Roles:</label>
        {allRoles.map((role) => (
          <div key={role}>
            <input
              type="checkbox"
              value={role}
              checked={form.roles.includes(role)}
              onChange={handleRoleChange}
            />
            <label>{role}</label>
          </div>
        ))}
      </div>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
