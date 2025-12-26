// src/components/analytics/PeakDatesTable.jsx
import { useEffect, useState } from "react";
import { getPeakDates } from "../../services/analyticsApi";
import "../../styles/analytics/PeakDatesTable.css";

const INITIAL_COUNT = 10;
const STEP = 20;

export default function PeakDatesTable() {
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    getPeakDates().then((res) => setData(res.data));
  }, []);

  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  const canShowMore = visibleCount < data.length;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, data.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="peak-table-card shadow-sm">
      <div className="peak-table-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="peak-table-title mb-1">
            Peak Leave / Absence Dates
          </h6>
          <p className="peak-table-subtitle mb-0">
            Days with unusually high leave or absence counts
          </p>
        </div>
        <div className="peak-table-pill text-nowrap">
          Total events: {totalCount}
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-sm align-middle peak-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col" className="text-end">
                Count
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted py-4">
                  No peak dates detected.
                </td>
              </tr>
            )}

            {data.slice(0, visibleCount).map((d, i) => {
              const isLeave = d.status === "LL";
              return (
                <tr key={i}>
                  <td>
                    <span className="peak-date">{d.date}</span>
                  </td>
                  <td>
                    <span
                      className={
                        "badge fw-semibold " +
                        (isLeave
                          ? "bg-soft-primary text-primary"
                          : "bg-soft-danger text-danger")
                      }
                    >
                      {isLeave ? "Leave" : "Absent"}
                    </span>
                  </td>
                  <td className="text-end">
                    <span className="fw-semibold">{d.count}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
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
