import React from 'react';

const RoleSwitcher = ({ onChange }) => {
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const activeRole = localStorage.getItem("activeRole");

  const handleChange = (e) => {
    localStorage.setItem("activeRole", e.target.value);
    onChange(e.target.value); // trigger dashboard update
  };

  return (
    <select value={activeRole} onChange={handleChange}>
      {roles.map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
};

export default RoleSwitcher;
