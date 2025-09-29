import React, { useState } from 'react';
import api from '../services/api';
import LeaveCalendar from '../pages/LeaveCalendar';

const AttendanceComponent = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [statusType, setStatusType] = useState("");
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  
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
    transition: "background-color 0.3s ease", // Add a smooth transition
    backgroundColor: isHovering ? "#007bff" : "transparent", // Change background on hover
    color: isHovering ? "white" : "#6c757d", // Change text color on hover
  };
  
  // Fetch attendance after status is selected
  const fetchAttendance = async (sync = false) => {
    if (!statusType || !month || !year) return;
    setLoadingAttendance(true);
    try {
      const res = await api.get('/attendance', {
        params: {
          status: statusType,
          month,
          year,
          sync: sync ? true : undefined
        }
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
    setLoadingAttendance(false);
  };

  return (
    <div className='attendance' style={{ margin: "20px", position: "relative" }}>
      <div className="d-flex mb-3 align-items-center">
        {/* Status dropdown */}
        <select
          className="form-select me-2"
          style={{ width: "200px", 
            padding : "6px",
           
            border: "1px solid blue",
            borderRadius: "4px",
            
            
           
          }}
          value={statusType}
          onChange={(e) => setStatusType(e.target.value)}
          disabled={loadingAttendance}
        >
          <option value="">-- Select Status --</option>
          <option value="Leave(LL)">Leave (LL)</option>
          <option value="Absent(AA)">Absent (AA)</option>
        </select>

        {/* Month dropdown */}
        <select
          className="form-select me-2"
          style={{ width: "150px" ,
            border: "1px solid blue"
          }}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={loadingAttendance}
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Year dropdown */}
        <select
          className="form-select me-2"
          style={{ width: "120px" ,
            border: "1px solid blue"
          }}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={loadingAttendance}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Load button */}
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => fetchAttendance(false)}
          disabled={!statusType || !month || !year || loadingAttendance}
        >
          {loadingAttendance && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Load Attendance
        </button>

        {/* Sync button */}
        <button
          className="btn btn-outline-secondary d-flex align-items-center"
          onClick={() => fetchAttendance(true)}
           onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
          style={buttonStyle}
          disabled={!statusType || !month || !year || loadingAttendance}
        >
          {loadingAttendance && (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          🔄Sync
        </button>
      </div>

      {attendanceData.length === 0 ? (
        <p className="text-muted">No attendance data loaded.</p>
      ) : (
        <LeaveCalendar
          leaveData={attendanceData}
          selectedMonth={
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month) + 1
          }
          selectedYear={parseInt(year)}
        />
      )}
    </div>
  );
};

export default AttendanceComponent;