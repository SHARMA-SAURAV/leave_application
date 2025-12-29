import React, { useState, useEffect } from "react";
import api from "../services/api";
import LeaveCalendar from "../pages/LeaveCalendar";
import InlineAttendanceLoader from "../components/InlineAttendanceLoader";

const AttendanceComponent = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [statusType, setStatusType] = useState("");
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [progress, setProgress] = useState(0);

  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "short" });
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [isHovering, setIsHovering] = useState(false);

  const buttonStyle = {
    position: "absolute",
    right: 0,
    marginRight: "16px",
    outline: "none",
    border: "none",
    boxShadow: "2px 2px 5px rgba(31, 7, 255, 0.3)",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
    backgroundColor: isHovering ? "#007bff" : "transparent",
    color: isHovering ? "white" : "#6c757d",
  };

  // Smooth progress animation
  useEffect(() => {
    if (!loadingAttendance) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 7));
    }, 200);

    return () => clearInterval(interval);
  }, [loadingAttendance]);

  const fetchAttendance = async (sync = false) => {
    if (!statusType || !month || !year) return;

    setLoadingAttendance(true);
    setProgress(0);
    setAttendanceData([]);

    try {
      const res = await api.get("/attendance", {
        params: {
          status: statusType,
          month,
          year,
          sync: sync ? true : undefined,
        },
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setProgress(100);
      setTimeout(() => setLoadingAttendance(false), 300);
    }
  };

  return (
    <div className="attendance" style={{ margin: "20px", position: "relative" }}>
      {/* FILTERS */}
      <div className="d-flex mb-3 align-items-center position-relative">
        <select
          className="form-select me-2"
          style={{ width: "200px", border: "1px solid blue" }}
          value={statusType}
          onChange={(e) => setStatusType(e.target.value)}
          disabled={loadingAttendance}
        >
          <option value="">-- Select Status --</option>
          <option value="Leave(LL)">Leave (LL)</option>
          <option value="Absent(AA)">Absent (AA)</option>
        </select>

        <select
          className="form-select me-2"
          style={{ width: "150px", border: "1px solid blue" }}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={loadingAttendance}
        >
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(
            (m) => (
              <option key={m} value={m}>{m}</option>
            )
          )}
        </select>

        <select
          className="form-select me-2"
          style={{ width: "120px", border: "1px solid blue" }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={loadingAttendance}
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          className="btn btn-primary me-2"
          onClick={() => fetchAttendance(false)}
          disabled={!statusType || loadingAttendance}
        >
          Load Attendance
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => fetchAttendance(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={buttonStyle}
          disabled={!statusType || loadingAttendance}
        >
          🔄 Sync
        </button>
      </div>

      {/* INLINE LOADER */}
      {loadingAttendance && (
        <InlineAttendanceLoader
          progress={progress}
          month={month}
          year={year}
          statusType={statusType}
        />
      )}

      {/* CONTENT */}
      {!loadingAttendance && attendanceData.length === 0 && (
        <p className="text-muted">No attendance data loaded.</p>
      )}

      {!loadingAttendance && attendanceData.length > 0 && (
        <LeaveCalendar
          leaveData={attendanceData}
          selectedMonth={
            ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
              .indexOf(month) + 1
          }
          selectedYear={parseInt(year)}
        />
      )}
    </div>
  );
};

export default AttendanceComponent;
