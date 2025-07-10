

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
