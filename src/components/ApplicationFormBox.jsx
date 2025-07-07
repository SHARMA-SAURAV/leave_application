

export default function ApplicationFormBox({ headingText, children}) {
    return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="mb-4 text-center">
          <i className="fas fa-door-open me-2 text-primary"></i>
          {headingText}
        </h3>
        {children}
      </div>
    </div>
  );
}