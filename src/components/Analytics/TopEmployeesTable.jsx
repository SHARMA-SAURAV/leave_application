import { useEffect, useState } from "react";
import { getTopEmployees } from "../../services/analyticsApi";
import "../../styles/analytics/TopEmployeesTable.css";

const INITIAL_COUNT = 10;
const STEP = 20;

export default function TopEmployeesTable() {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    getTopEmployees().then(res => setData(res.data));
  }, []);

  const totalLeaves = data.reduce((sum, d) => sum + d.leaves, 0);
  const totalAbsences = data.reduce((sum, d) => sum + d.absences, 0);

  const canShowMore = visibleCount < data.length;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + STEP, data.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="top-emp-card shadow-sm">
      <div className="top-emp-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="top-emp-title mb-1">
            Top Employees (Yearly)
          </h6>
          <p className="top-emp-subtitle mb-0">
            Employees with the highest leave / absence counts
          </p>
        </div>
        <div className="top-emp-pill text-nowrap">
          Total events: {totalLeaves + totalAbsences}
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table align-middle top-emp-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Employee</th>
              <th scope="col" className="text-end">Leaves</th>
              <th scope="col" className="text-end">Absences</th>
              <th scope="col" className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No employee data available.
                </td>
              </tr>
            )}

            {data.slice(0, visibleCount).map((emp, index) => {
              const total = emp.leaves + emp.absences;
              const rank = index + 1;

              return (
                <tr key={emp.empId}>
                  <td>
                    <span
                      className={
                        "rank-chip " +
                        (rank === 1
                          ? "rank-gold"
                          : rank === 2
                          ? "rank-silver"
                          : rank === 3
                          ? "rank-bronze"
                          : "rank-default")
                      }
                    >
                      {rank}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="emp-name">{emp.name}</span>
                      {emp.department && (
                        <span className="emp-dept">
                          {emp.department}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-end">
                    <span className="badge bg-soft-primary text-primary fw-semibold">
                      {emp.leaves}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="badge bg-soft-danger text-danger fw-semibold">
                      {emp.absences}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="fw-semibold">{total}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {data.length > 0 && (
            <tfoot>
              <tr>
                <th colSpan={2} scope="row">Total</th>
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

      {(canShowMore || canShowLess) && (
        <div className="d-flex justify-content-center gap-2 mt-2">
          {canShowLess && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleShowLess}
            >
              Show less
            </button>
          )}
          {canShowMore && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
