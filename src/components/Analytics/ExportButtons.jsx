export default function ExportButtons() {
  return (
    <div className="mt-4 d-flex gap-3">
      <button
        className="btn btn-outline-primary"
        onClick={() =>
          window.open("/api/attendance/analytics/export/excel")
        }
      >
        Export Excel
      </button>

      <button
        className="btn btn-outline-danger"
        onClick={() =>
          window.open("/api/attendance/analytics/export/pdf")
        }
      >
        Export PDF
      </button>
    </div>
  );
}
