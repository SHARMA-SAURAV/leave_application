import { useEffect, useState } from "react";
import { getDepartmentAnalytics } from "../../services/analyticsApi";
import "../../styles/analytics/DepartmentAnalyticsTable.css";

export default function DepartmentAnalyticsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDepartmentAnalytics().then(res => setData(res.data));
  }, []);

  const totalLeaves = data.reduce((sum, d) => sum + d.totalLeaves, 0);
  const totalAbsences = data.reduce((sum, d) => sum + d.totalAbsences, 0);

  return (
    <div className="dept-table-card shadow-sm">
      <div className="dept-table-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="dept-table-title mb-1">
            Department-Wise Attendance (Yearly)
          </h6>
          <p className="dept-table-subtitle mb-0">
            Summary of leaves and absences by department
          </p>
        </div>
        <div className="dept-table-pill text-nowrap">
          Total: {totalLeaves + totalAbsences}
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table align-middle dept-table">
          <thead>
            <tr>
              <th scope="col">Department</th>
              <th scope="col" className="text-end">Leaves</th>
              <th scope="col" className="text-end">Absences</th>
              <th scope="col" className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">
                  No data available.
                </td>
              </tr>
            )}

            {data.map((d, i) => {
              const total = d.totalLeaves + d.totalAbsences;
              const leaveRatio =
                total > 0 ? Math.round((d.totalLeaves / total) * 100) : 0;

              return (
                <tr key={i}>
                  <td>
                    <span className="dept-name">{d.department}</span>
                  </td>
                  <td className="text-end">
                    <span className="badge bg-soft-primary text-primary fw-semibold">
                      {d.totalLeaves}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="badge bg-soft-danger text-danger fw-semibold">
                      {d.totalAbsences}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="fw-semibold">{total}</span>
                    {total > 0 && (
                      <span className="dept-ratio text-muted ms-2">
                        {leaveRatio}% leaves
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr>
                <th scope="row">Total</th>
                <th className="text-end">{totalLeaves}</th>
                <th className="text-end">{totalAbsences}</th>
                <th className="text-end">
                  {totalLeaves + totalAbsences}
                </th>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
