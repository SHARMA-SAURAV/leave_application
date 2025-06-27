import React, { useState } from 'react';
import api from '../services/api';

const ApplyLeave = () => {
  const [form, setForm] = useState({
    type: 'FULL_DAY', // FULL_DAY, HALF_DAY
    halfDay: 'FIRST_HALF', // used only if HALF_DAY
    category: 'CL', // PL, CL, RH
    reason: '',
    dates: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leave/apply', form); // Adjust endpoint as needed
      alert('Leave applied successfully!');
    } catch (err) {
      alert('Failed to apply leave.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Apply for Leave</h2>

      <select name="type" onChange={handleChange}>
        <option value="FULL_DAY">Full Day</option>
        <option value="HALF_DAY">Half Day</option>
      </select>

      {form.type === 'HALF_DAY' && (
        <select name="halfDay" onChange={handleChange}>
          <option value="FIRST_HALF">First Half</option>
          <option value="SECOND_HALF">Second Half</option>
        </select>
      )}

      <select name="category" onChange={handleChange}>
        <option value="PL">PL</option>
        <option value="CL">CL</option>
        <option value="RH">RH</option>
      </select>

      <input name="dates" placeholder="Enter dates comma separated" onChange={handleChange} />
      <textarea name="reason" placeholder="Reason" onChange={handleChange}></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplyLeave;
