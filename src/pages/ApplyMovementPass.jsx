import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ApplicationFormBox from '../components/ApplicationFormBox';
import { WideInput } from '../components/FormControls';
import { LabelNumberInput } from '../components/LabelCheckbox';

const APPROVER_TYPES = ["FLA", "SLA"]

const ApplyMovementPass = () => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [approvalType, setApprovalType] = useState(APPROVER_TYPES[0]);
  const [approverList, setApproverList] = useState([]);
  const [currentApprover, setCurrentApprover] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const persons = await api.get(`/users?role=${approvalType}`);
        setApproverList(persons.data);
      }
      catch (err) {
        console.error('Error fetching approvers:', err);
        alert('Failed to fetch approvers. Please try again later.');
      }
    }
    fetchApprovers();
  }, [approvalType]);

  const handleApprovalTypeChange = (e) => {
    if (e.target.value === approvalType) return;
    setApprovalType(e.target.value);
    setCurrentApprover('');
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const requestData = {
        date,
        startTime,
        endTime,
        reason,
        approverRole: approvalType,
        approverId: currentApprover,
      }
      await api.post('/movement/apply', requestData);
      alert('Movement pass applied successfully!');
      // Reset form fields
      setDate('');
      setStartTime('');
      setEndTime
      setReason('');
      setApprovalType(APPROVER_TYPES[0]);
      setApproverList([]);
      setCurrentApprover('');
    } catch (err) {
      alert('Failed to apply for pass.');
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };
  // For setting constraints on date input
  const todayDate = new Date().toISOString().split('T')[0];
  return (
    <ApplicationFormBox headingText={"Apply for Movement Pass"}>
      <form onSubmit={handleSubmit}>
        <WideInput label="Date">
          <input
            type="date"
            className="form-control"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
            max={todayDate}
          />
        </WideInput>

        <div className="row mb-3">
          <WideInput label={"Start Time"} divClasses="col-md-6">
            <input
              type="time"
              className="form-control"
              value={startTime}
              required
              onChange={(e) => setStartTime(e.target.value)}
            />
          </WideInput>
          <WideInput label={"End Time"} divClasses="col-md-6">
            <input
              type="time"
              className="form-control"
              value={endTime}
              required
              onChange={(e) => setEndTime(e.target.value)}
            />
          </WideInput>
        </div>

        <WideInput label="Reason">
          <textarea
            className='form-control'
            placeholder="Enter reason for pass"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </WideInput>

        <div className="row mb-3">
          <WideInput label={"Approver Type"} forName="approverRole" divClasses="col-md-6">
            <select
              name="approverRole"
              className="form-select"
              value={approvalType}
              onChange={handleApprovalTypeChange}
              required
            >
              {
                APPROVER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))
              }
            </select>
          </WideInput>
          <WideInput label={"Approver"} forName="approverId" divClasses="col-md-6">
            <select
              name="approverId"
              className="form-select"
              value={currentApprover}
              onChange={(e) => setCurrentApprover(e.target.value)}
              required
            >
              <option value="" disabled={true} selected={true} hidden={true}>-- Select Approver --</option>
              {approverList.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} ({person.email})
                </option>
              ))}
            </select>
          </WideInput>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            )
              : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>Submit Movement Pass Request
                </>
              )}
          </button>
        </div>
      </form>
    </ApplicationFormBox>
  );
};

export default ApplyMovementPass;
