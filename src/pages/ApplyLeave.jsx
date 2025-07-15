import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ApplicationFormBox from '../components/ApplicationFormBox';
import { WideInput } from '../components/FormControls';
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
  const [selectedLeaves, setSelectedLeaves] = useState({
    PL: 0,
    CL: 0,
    RH: 0,
    Other: 0,
  });

  const totalLeaves =
    selectedLeaves.PL +
    selectedLeaves.CL +
    selectedLeaves.RH +
    selectedLeaves.Other;

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

  const handleLeavesChange = (type, val) => {
    const updated = { ...selectedLeaves, [type]: parseInt(val) || 0 };
    if (updated.PL > 0 && updated.CL > 0) updated.CL = 0;
    setSelectedLeaves(updated);
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalLeaves <= 0) {
      alert('Please select at least one type of leave.');
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
        plLeaves: selectedLeaves.PL,
        clLeaves: selectedLeaves.CL,
        rhLeaves: selectedLeaves.RH,
        otherLeaves: selectedLeaves.Other,
      });
      alert('Leave applied successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      setApprovalType(APPROVER_TYPES[0]);
      setApproverList([]);
      setCurrentApprover('');
      setSelectedLeaves({ PL: 0, CL: 0, RH: 0, Other: 0 });
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
        <LabelNumberInput
          label="Privilege Leave (PL)"
          inputName="plLeave"
          value={selectedLeaves.PL}
          onChange={(e) => handleLeavesChange('PL', e.target.value)}
          disabled={selectedLeaves.CL > 0}
          required
        />
        <LabelNumberInput
          label="Casual Leave (CL)"
          inputName="clLeave"
          value={selectedLeaves.CL}
          onChange={(e) => handleLeavesChange('CL', e.target.value)}
          disabled={selectedLeaves.PL > 0}
          required
        />
        <LabelNumberInput
          label="Restricted Holiday (RH)"
          inputName="rhLeave"
          value={selectedLeaves.RH}
          onChange={(e) => handleLeavesChange('RH', e.target.value)}
          required
        />
        <LabelNumberInput
          label="Others"
          inputName="otherLeave"
          value={selectedLeaves.Other}
          onChange={(e) => handleLeavesChange('Other', e.target.value)}
          required
        />

        <div className="d-flex align-items-center mt-3 mb-4">
          <span className="fw-semibold me-2 text-muted">Total Leaves:</span>
          <span className={`badge fs-6 ${totalLeaves > 0 ? 'bg-success' : 'bg-secondary'}`}>
            {totalLeaves}
          </span>
        </div>

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
