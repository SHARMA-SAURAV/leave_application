import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { SlaApprovalRow } from '../components/LeaveRequestTables';
import { SlaPassApprovalRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';
import { SlaEntrySlipApprovalRow } from '../components/EntrySlipTables';
import BaseTable from '../components/BaseTable';
import LeaveCalendar from './LeaveCalendar';
// import LeaveCalendar from '../components/LeaveCalendar'; // 👈 import calendar

const SLAPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]); // 👈 for calendar
  const [statusType, setStatusType] = useState(""); // 👈 selected status
  const [loadingAttendance, setLoadingAttendance] = useState(false); // 👈 spinner state
  const [activeTab, setActiveTab] = useState('entry');
  const [showVpnInfo, setShowVpnInfo] = useState(false); // 👈 VPN info state
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", etc.
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  // Fetch entry slips
  const fetchData = async () => {
    try {
      const entryRes = await api.get('/entry-slip/pending/sla');
      setEntrySlips(entryRes.data);
    } catch (err) {
      console.error('Error fetching SLA entry slips:', err);
    }
  };



  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const res = await api.get('/leave/sla/all');
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave applications:', err);
    }
  };

  // Fetch movement passes
  const fetchMovementPasses = async () => {
    try {
      const res = await api.get('/movement/sla/all');
      setMovementPasses(res.data);
    } catch (err) {
      console.error('Error fetching movement passes:', err);
    }
  };

  // Fetch attendance after status is selected
  const fetchAttendance = async (sync=false) => {
    if (!statusType || !month || !year) return;
    setLoadingAttendance(true); // 👈 start spinner
    try {
      const res = await api.get('/attendance', {
        params: {
          status: statusType, month, year
          , sync: sync ? true : undefined   // 👈 send sync flag only if requested
        }
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
    setLoadingAttendance(false); // 👈 stop spinner
  };

  useEffect(() => {
    fetchData();
    fetchLeaveRequests();
    fetchMovementPasses();
  }, []);

  const handleEntrySlipAction = async (id, action) => {
    try {
      await api.put(`/entry-slip/${action}/${id}?role=SLA`);
      alert(`Entry slip ${action}ed successfully`);
      setEntrySlips((prev) => prev.filter((slip) => slip.id !== id));
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    }
  };

  const handleLeaveApproval = async (id, action, substitute = null) => {
    const result = await leaveApproveApi(id, "sla", action, { substituteSelected: substitute });
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const handlePassApproval = async (id, action) => {
    const result = await movementPassApproveApi(id, "sla", action);
    if (result) {
      setMovementPasses((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const handleTabClick = (tab) => {
    if (tab === 'attendance') {
      setShowVpnInfo(true);
    }
    setActiveTab(tab);
  };

  return (
    <div>
      {/* VPN Info Modal */}
      {showVpnInfo && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-warning">VPN Required</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setShowVpnInfo(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Please open and login to VPN before using the Attendance feature.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowVpnInfo(false);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mt-4">
        <h3 className="text-primary mb-4">SLA Panel</h3>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'entry' ? 'active' : ''}`}
              onClick={() => setActiveTab('entry')}
            >
              Entry Slips{' '}
              {entrySlips.length > 0 && (
                <span className="badge bg-danger ms-1">{entrySlips.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'leave' ? 'active' : ''}`}
              onClick={() => setActiveTab('leave')}
            >
              Leave Requests{' '}
              {leaveRequests.length > 0 && (
                <span className="badge bg-danger ms-1">{leaveRequests.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'pass' ? 'active' : ''}`}
              onClick={() => setActiveTab('pass')}
            >
              Movement Passes{' '}
              {movementPasses.length > 0 && (
                <span className="badge bg-danger ms-1">{movementPasses.length}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => handleTabClick('attendance')}
            >
              Attendance
            </button>
          </li>
        </ul>
      </div>

      <div className="me-2 ms-2">
        {/* Entry Slips */}
        {activeTab === 'entry' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Date", "Times", "Reason", "Actions"]}
            rows={
              entrySlips.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
              ) : (
                entrySlips.map((slip) => (
                  <SlaEntrySlipApprovalRow key={slip.id} slip={slip} action={handleEntrySlipAction} />
                ))
              )
            }
          />
        )}

        {/* Leave Requests */}
        {activeTab === 'leave' && (
          <BaseTable
            columns={["Employee", "Email", "Department", "Dates", "Reason", "Types", "Count", "Substitute", "Actions"]}
            rows={
              leaveRequests.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted">No data found.</td></tr>
              ) : (
                leaveRequests.map((request) => (
                  <SlaApprovalRow key={request.id} request={request} action={handleLeaveApproval} />
                ))
              )
            }
          />
        )}

        {/* Movement Passes */}
        {activeTab === 'pass' && (
          <BaseTable
            columns={["Employee", "Email", "Dept", "Date", "Time Period", "Reason", "Actions"]}
            rows={
              movementPasses.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
              ) : (
                movementPasses.map((pass) => (
                  <SlaPassApprovalRow key={pass.id} request={pass} action={handlePassApproval} />
                ))
              )
            }
          />
        )}

        {/* Attendance Tab with status selection */}
        {activeTab === 'attendance' && !showVpnInfo && (
          <div>
            <div className="d-flex mb-3 align-items-center">
              {/* Status dropdown */}
              <select
                className="form-select me-2"
                style={{ width: "200px" }}
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
                style={{ width: "150px" }}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={loadingAttendance}
              >
                {/* <option value="">-- Month --</option> */}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Year dropdown */}
              <select
                className="form-select me-2"
                style={{ width: "120px" }}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={loadingAttendance}
              >
                {/* <option value="">-- Year --</option> */}
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
              {/* 🔄 Sync button */}
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => fetchAttendance(true)}
                style={{position:"absolute", right: 0, marginRight: "16px", outline: "none", border: "none"}}
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
        )}



      </div>
    </div>
  );
};

export default SLAPanel;
