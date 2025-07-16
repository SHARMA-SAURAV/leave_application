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
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState([]);

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

  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (leaveCount <= 0) {
      alert('Leave count must be greater than 0.');
      return;
    }
    if(selectedLeaveTypes.indexOf("PL") != -1 && selectedLeaveTypes.indexOf("CL") != -1) {
      alert("Cannot select both CL and PL leaves at once.");
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
        leaveCount: leaveCount,
        leaveTypes: selectedLeaveTypes,
      });
      alert('Leave applied successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      setApprovalType(APPROVER_TYPES[0]);
      setApproverList([]);
      setCurrentApprover('');
      setSelectedLeaveTypes([]);
    } catch (err) {
      alert('Failed to apply leave.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicationFormBox headingText="Apply for Leave">
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
            min={todayDate}
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
          selectedValues={selectedLeaveTypes}
          onSelectionChange={handleLeaveTypeChange}
          label="Leave Types"
        />

        <WideInput label={"Leaves Count"} forName={"leaves-count"}>
          <input className="form-control" type="number" step={1} min={1}
            onChange={(e) => setLeaveCount(e.target.value)}
            required
          />
        </WideInput>

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
