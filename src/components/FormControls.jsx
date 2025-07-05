
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
        <WideInput label={""} forName={inputName} divClasses="col-md-6">
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