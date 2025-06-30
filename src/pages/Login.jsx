import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
      console.log('Login successful:', password, email);

      localStorage.setItem('roles', JSON.stringify(res.data.roles));
      localStorage.setItem('activeRole', res.data.roles[0]); // default
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
