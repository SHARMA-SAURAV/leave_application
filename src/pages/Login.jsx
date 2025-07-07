// import React, { useState } from 'react';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';


// // Login component for user authentication
// const Login = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: '', password: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/auth/login', form);
//       const { password, email } = res.data;
//       localStorage.setItem('token', email);
//       localStorage.setItem('email', password);
//       console.log('Login successful:', password, email);

//       localStorage.setItem('roles', JSON.stringify(res.data.roles));
//       localStorage.setItem('activeRole', res.data.roles[0]); // default
//       alert('Login successful!');
//       navigate('/dashboard');
//     } catch (err) {
//       alert('Login failed.');
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input name="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;






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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <i className="fa-solid fa-user-lock fa-3x text-primary"></i>
          <h3 className="mt-2">Login</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
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

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
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

          <button type="submit" className="btn btn-primary w-100">Login</button>

          <div className="text-center mt-3">
            {/* <a href="#" className="text-decoration-none">Forgot password?</a> */}
            <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;






