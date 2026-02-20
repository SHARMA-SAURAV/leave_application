import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ApplicationFormBox from '../components/ApplicationFormBox';
import { MultiSelectDropdown, WideInput } from '../components/FormControls';
import { LabelNumberInput } from '../components/LabelCheckbox';

const APPROVER_TYPES = ['FLA', 'SLA'];
const PRIMARY_BLUE = 'rgb(13, 110, 253)';

const ApplyLeave = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [approvalType, setApprovalType] = useState(APPROVER_TYPES[0]);
  const [approverList, setApproverList] = useState([]);
  const [currentApprover, setCurrentApprover] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaveCount, setLeaveCount] = useState(0);
  //For Multiple Select leaves
  // const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);
  //For Single Select leave type
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [balanceError, setBalanceError] = useState("");
const [validationError, setValidationError] = useState("");
const [successMessage, setSuccessMessage] = useState("");

const [previewLoading, setPreviewLoading] = useState(false);


useEffect(() => {

  if (!startDate || !endDate || !selectedLeaveTypes) return;

  const fetchPreview = async () => {
    setPreviewLoading(true);

    try {
      const res = await api.post("/leave/preview", {
        startDate,
        endDate,
        leaveTypes: [selectedLeaveTypes]
      });

      setLeaveCount(res.data.leaveDays);
      setValidationError("");
      setBalanceError("");

    } catch (err) {

      setLeaveCount(0);

      if (err.response?.data?.message) {
        setValidationError(err.response.data.message);
      }

    } finally {
      setPreviewLoading(false);
    }
  };

  fetchPreview();

}, [startDate, endDate, selectedLeaveTypes]);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const res = await api.get(`/users?role=${approvalType}`);
        setApproverList(res.data);
      } catch (err) {
        console.error('Error fetching approvers:', err);
        alert('Failed to fetch approvers. Please try again later.');
      }
    };
    fetchApprovers();
  }, [approvalType]);

  const handleApprovalTypeChange = (e) => {
    if (e.target.value === approvalType) return;
    setApprovalType(e.target.value);
    setCurrentApprover('');
  };

  const handleLeaveTypeChange = (value) => {
    setSelectedLeaveTypes(value);
  }

  // const calculateLeaveDays = (start, end) => {
  //   if (!start || !end) return 0;
  //   const startD = new Date(start);
  //   const endD = new Date(end);
  //   if (endD < startD) return 0;
  //   const timeDiff = endD.getTime() - startD.getTime();
  //   const dayCount = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
  //   return dayCount;
  // };

  const calculateLeaveDays = (start, end, holidays = []) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) return 0;

    let count = 0;
    let current = new Date(startDate);

    while (current <= endDate) {

      const day = current.getDay(); // 0 Sunday, 6 Saturday

      // IMPORTANT: locale date instead of ISO
      const formatted = current.toLocaleDateString('en-CA');

      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidays.includes(formatted);

      if (!isWeekend && !isHoliday) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  };


  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await api.get("/holiday/all");
        setHolidays(res.data);
        // backend should return array of date strings like:
        // ["2026-03-25", "2026-04-10"]
      } catch (error) {
        console.error("Failed to fetch holidays", error);
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    const total = calculateLeaveDays(startDate, endDate, holidays);
    setLeaveCount(total);
  }, [startDate, endDate, holidays]);

  const todayDate = new Date().toISOString().split('T')[0];

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (leaveCount <= 0) {
  //     alert('Leave count must be greater than 0.');
  //     return;
  //   }
  //   if (selectedLeaveTypes.indexOf("PL") != -1 && selectedLeaveTypes.indexOf("CL") != -1) {
  //     alert("Cannot select both CL and PL leaves at once.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await api.post('/leave/apply', {
  //       startDate,
  //       endDate,
  //       reason,
  //       approverRole: approvalType,
  //       approverId: currentApprover,
  //       leaveCount: leaveCount,
  //       leaveTypes: selectedLeaveTypes,
  //     });
  //     alert('Leave applied successfully!');
  //     setStartDate('');
  //     setEndDate('');
  //     setReason('');
  //     setApprovalType(APPROVER_TYPES[0]);
  //     setApproverList([]);
  //     setCurrentApprover('');
  //     setSelectedLeaveTypes([]);
  //   } catch (err) {
  //     alert('Failed to apply leave.');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setBalanceError("");
    setValidationError("");
    setSuccessMessage("");

  if (leaveCount === 0) {
  setValidationError("Invalid leave range as per leave rules.");
  return;
}


    if (selectedLeaveTypes.indexOf("PL") !== -1 && selectedLeaveTypes.indexOf("CL") !== -1) {
      setValidationError("Cannot select both CL and PL leaves at once.");
      return;
    }

    setLoading(true);

    try {
      await api.post('/leave/apply', {
        startDate,
        endDate,
        reason,
        approverRole: approvalType,
        approverId: currentApprover,
        // leaveCount: leaveCount,
        leaveTypes: [selectedLeaveTypes],
      });

      setSuccessMessage("Leave applied successfully!");

      // reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setCurrentApprover('');
      setSelectedLeaveTypes("");
      setLeaveCount(0);

    } catch (err) {

      if (err.response?.data) {
        const { code, message } = err.response.data;

        if (code === "BUSINESS_LOGIC_ERROR") {
          setBalanceError(message);
        }
        else if (code === "VALIDATION_ERROR") {
          setValidationError(message);
        }
        else {
          setBalanceError("Something went wrong. Please try again.");
        }
      } else {
        setBalanceError("Server not reachable.");
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <ApplicationFormBox headingText="Apply for Leave">

      {balanceError && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {balanceError}
        </div>
      )}

      {validationError && (
        <div className="alert alert-warning">
          <i className="fas fa-info-circle me-2"></i>
          {validationError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <WideInput label="Start Date" forName="startDate">
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={todayDate}
          />
        </WideInput>

        <WideInput label="End Date" forName="endDate">
          <input
            type="date"
            name="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            min={startDate || todayDate}
          />
        </WideInput>

        <WideInput label="Reason" forName="reason">
          <textarea
            name="reason"
            className="form-control"
            placeholder="Enter reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </WideInput>

        <div className="row mb-3">
          <WideInput label="Approver Type" forName="approverRole" divClasses="col-md-6">
            <select
              name="approverRole"
              className="form-select"
              value={approvalType}
              onChange={handleApprovalTypeChange}
              required
            >
              {APPROVER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </WideInput>

          <WideInput label="Approver" forName="approverId" divClasses="col-md-6">
            <select
              name="approverId"
              className="form-select"
              value={currentApprover}
              onChange={(e) => setCurrentApprover(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                -- Select Approver --
              </option>
              {approverList.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} ({person.email})
                </option>
              ))}
            </select>
          </WideInput>
        </div>

        <label className="mb-2 fw-bold">Select Leave Types</label>
        <MultiSelectDropdown
          options={[
            "PL", "CL", "RH", "EL", "HPL", "ML", "SL",
          ]}
          selectedValue={selectedLeaveTypes}
          onSelectionChange={handleLeaveTypeChange}
          label="Leave Types"
        />

        {/* <WideInput label={"Leaves Count"} forName={"leaves-count"}>
          <input className="form-control" type="number"
            value={leaveCount} readOnly
          />
        </WideInput> */}


     <WideInput label={"Leaves Count"} forName={"leaves-count"}>
  <input
    className="form-control"
    type="number"
    value={leaveCount}
    readOnly
  />
  <small className="text-muted">
    Calculated by system based on leave rules
  </small>
</WideInput>
{previewLoading && (
  <small className="text-primary">
    Calculating leave as per organization policy...
  </small>
)}




        <div className="d-grid">
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              backgroundColor: PRIMARY_BLUE,
              color: '#fff',
              fontWeight: '500',
              borderRadius: '8px',
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i> Submit Leave Request
              </>
            )}
          </button>
        </div>
      </form>
    </ApplicationFormBox>
  );
};

export default ApplyLeave;
