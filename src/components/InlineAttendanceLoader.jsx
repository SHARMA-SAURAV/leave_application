import React from "react";
import "../styles/InlineAttendanceLoader.css";

const InlineAttendanceLoader = ({ progress, month, year, statusType }) => {
  return (
    <div className="inline-overlay">
      <div className="inline-loader-container">

        <div className="spinner"></div>

        <h6 className="loader-title"> Loading Attendance Data</h6>
        <p className="loader-subtitle">
          Please wait while we fetch and process records
        </p>



        <div className="context-row">
          <span><strong>Month:</strong> {month}</span>
          <span><strong>Year:</strong> {year}</span>
          <span><strong>Status:</strong> {statusType}</span>
        </div>

        <div className="progress-wrapper">
          <div className="progress-info">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default InlineAttendanceLoader;
