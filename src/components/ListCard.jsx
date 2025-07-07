

export function ListCard({ cardId, title, children }) {
  return (
    <div key={cardId} className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-dark">{title}</h5>
        {children}
      </div>
    </div>
  )
}

export function ListCardLine({ label, value }) {
  return (
    <div className="mb-1"><strong>{label}:</strong> {value}</div>
  )
}

export function ListCardButtonPair({ approveLabel, rejectLabel, onApprove, onReject }) {
  return (
    <div className="d-flex gap-2">
      <button type="submit" className="btn btn-success" onClick={onApprove}>
        <i className="fas fa-check-circle me-1"></i> {approveLabel}
      </button>
      <button type="submit" className="btn btn-danger" onClick={onReject}>
        <i className="fas fa-times-circle me-1"></i> {rejectLabel}
      </button>
    </div>
  )
}