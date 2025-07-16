import React, { useRef, useState, useEffect } from 'react';

export function WideInput({ label, forName, divClasses = '', children }) {
  const classes = 'mb-2 mt-2 ' + divClasses;
  return (
    <div className={classes}>
      {label && <label className="form-label" htmlFor={forName}><b>{label}</b></label>}
      {children}
    </div>
  )
}

export function UserSelect({ users, label = "", inputName, value, onChange }) {
  return (
    <WideInput label={""} forName={inputName}>
      <select
        name={inputName}
        className="form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled hidden>-- {label} --</option>
        {users.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name} ({person.email})
          </option>
        ))}
      </select>
    </WideInput>
  )
}

// options is a list of objects with 'value' and 'label' properties
export function MultiSelectDropdown({
  options,
  selectedValues,
  onSelectionChange,
  label,
  placeholder = 'Select options...',
  iconClass = 'fas fa-list',
  maxHeight = '200px',
  className = '',
  disabled = false,
  showSelectedCount = true,
}) {
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value)
      : [...selectedValues, value];

    onSelectionChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    if (showSelectedCount && selectedValues.length > 2) {
      return `${selectedValues.length} option(s) selected`;
    }

    return selectedValues.join(', ');
  };

  return (
    <div className={`mb-3 ${className}`} ref={dropdownRef}>
      {label && <label className="form-label fw-semibold">{label}</label>}

      <button
        type="button"
        className="form-control text-start d-flex justify-content-between align-items-center"
        onClick={() => !disabled && setIsDropdownOpen(prev => !prev)}
        disabled={disabled}
      >
        <span className={selectedValues.length ? '' : 'text-muted'}>
          <i className={`${iconClass} me-2`}></i>
          {getDisplayText()}
        </span>
        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
      </button>

      {isDropdownOpen && (
        <div
          className="border rounded mt-1 shadow-sm bg-white p-2"
          style={{
            maxHeight,
            overflowY: 'auto',
            position: 'absolute',
            zIndex: 1000,
            width: '100%'
          }}
        >
          {options.map((option) => (
            <div key={option} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`option-${option}`}
                checked={selectedValues.includes(option)}
                onChange={() => handleToggle(option)}
              />
              <label className="form-check-label" htmlFor={`option-${option}`}>
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <span
              key={value}
              className="badge bg-primary px-3 py-2 rounded-pill d-flex align-items-center"
            >
              {value}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                onClick={() => handleToggle(value)}
                style={{ fontSize: '0.6rem' }}
              ></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};