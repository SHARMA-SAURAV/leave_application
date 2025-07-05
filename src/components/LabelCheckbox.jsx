export function LabelNumberInput({ label, inputName, value, onChange, disabled = false }) {
  return (
    <div className="row mb-3">
      <div className="col-12">
        <div className="form-group d-flex align-items-center">
          <label className="form-label me-3 mb-0" htmlFor={inputName}>
            {label}
          </label>
          <input
            className="form-control"
            type="number"
            id={inputName}
            name={inputName}
            value={value}
            onChange={onChange}
            disabled={disabled}
            min="0"
            step="1"
            style={{ width: '100px' }}
          />
        </div>
      </div>
    </div>
  );
}