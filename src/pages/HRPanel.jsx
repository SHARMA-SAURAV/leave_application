import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BaseTable from '../components/BaseTable';
import { HrApprovalRow, HrApprovedRow } from '../components/LeaveRequestTables';
import { HrPassApprovalRow, HrPassApprovedRow } from '../components/MovementPassTables';
import { leaveApproveApi } from '../services/leave';
import { movementPassApproveApi } from '../services/move';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EntrySlipApprovalRow, HrEntrySlipApprovalRow, HrEntrySlipApprovedRow } from '../components/EntrySlipTables';

const HRPanel = () => {
  const [entrySlips, setEntrySlips] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [movementPasses, setMovementPasses] = useState([]);
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState([]);
  const [approvedMovementPasses, setApprovedMovementPasses] = useState([]);
  const [view, setView] = useState('pending');
  const [activeTab, setActiveTab] = useState('entry');

  const fetchData = async () => {
    try {
      const [entryRes, leaveRes, approvedLeaveRes, movementRes, approvedMovementRes] = await Promise.all([
        api.get(view === 'pending' ? '/entry-slip/pending/hr' : '/entry-slip/approved'),
        api.get('/leave/hr/all'),
        api.get('/leave/hr/approved'),
        api.get('/movement/hr/all'),
        api.get('/movement/hr/approved'),
      ]);
      setEntrySlips(entryRes.data.map(slip => ({ ...slip, loading: false })));
      setLeaveRequests(leaveRes.data);
      setApprovedLeaveRequests(approvedLeaveRes.data);
      setMovementPasses(movementRes.data);
      setApprovedMovementPasses(approvedMovementRes.data);
    } catch (err) {
      console.error('Error fetching HR data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleEntrySlipAction = async (id, action) => {
    try {
      setEntrySlips((prev) => prev.map(slip => slip.id === id ? { ...slip, loading: true } : slip));
      await api.put(`/entry-slip/${action}/${id}?role=HR`);
      alert(`Entry slip ${action}ed successfully`);
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} entry slip`, err);
    } finally {
      setEntrySlips((prev) => prev.map(slip => slip.id === id ? { ...slip, loading: false } : slip));
    }
  };

  const handleLeaveApproval = async (id, action) => {
    const result = await leaveApproveApi(id, 'hr', action);
    if (result) {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const handlePassApproval = async (id, action) => {
    const result = await movementPassApproveApi(id, 'hr', action);
    if (result) {
      setMovementPasses((prev) => prev.filter((request) => request.id !== id));
    }
  };

  const downloadPDF = (title, data, fileName) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 20);
    autoTable(doc, {
      startY: 30,
      body: data,
    });
    doc.save(`${fileName}.pdf`);
  };

  const getNotificationBadge = (count) => (
    count > 0 && <span className="badge bg-danger ms-1">{count}</span>
  );

  const renderTabContent = () => {
    if (activeTab === 'entry') {
      const data = view === 'pending' ? entrySlips : entrySlips;
      return (
        <BaseTable
          columns={["Employee", "Email", "Department", "Date", "Times", "Reason", "Actions"]}
          rows={
            data.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
            ) : (
              data.map((slip) => (
                view === 'pending' ? (<HrEntrySlipApprovalRow key={slip.id} slip={slip} action={handleEntrySlipAction} />) : (<HrEntrySlipApprovedRow key={slip.id} slip={slip} downloadPdf={() => downloadPDF('Entry Slip', [
                  ['Created By', slip.createdBy?.name || 'N/A'],
                  ['Email', slip.createdBy?.email || 'N/A'],
                  ['Date', slip.date],
                  ['Time', `${slip.inTime} - ${slip.outTime}`],
                  ['Reason', slip.reason],
                  ['Status', slip.status],
                ], `entry-slip-${slip.id}`)} />)
              ))
            )
          }
        />
      );
    }

    if (activeTab === 'leave') {
      const data = view === 'pending' ? leaveRequests : approvedLeaveRequests;
      return (
        <BaseTable
          columns={["Employee", "Email", "Department", "Dates", "Reason", "Types", "Count", "Substitute", "Actions"]}
          rows={
            data.length === 0 ? (
              <tr><td colSpan="9" className="text-center text-muted">No data found.</td></tr>
            ) : (
              data.map((request) => (
                view === 'pending' ? (<HrApprovalRow key={request.id} request={request} action={handleLeaveApproval} />) : (<HrApprovedRow key={request.id} request={request} downloadPdf={() => downloadPDF('Leave Application', [
                  ['Name', request.requestedBy?.name],
                  ['Email', request.requestedBy?.email],
                  ['Dates', `${request.startDate} - ${request.endDate}`],
                  ['Leave Types', request.leaveTypes.join(", ")],
                  ['Leave Count', request.leaveCount],
                  ['Status', request.status],
                ], `leave-${request.id}`)} />)
              ))
            )
          }
        />
      );
    }

    if (activeTab === 'movement') {
      const data = view === 'pending' ? movementPasses : approvedMovementPasses;
      return (
        <BaseTable
          columns={["Employee", "Email", "Department", "Date", "Time", "Reason", "Actions"]}
          rows={
            data.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted">No data found.</td></tr>
            ) : (
              data.map((request) => (
                view === 'pending' ? (<HrPassApprovalRow key={request.id} request={request} action={handlePassApproval} />) : (<HrPassApprovedRow key={request.id} request={request} downloadPdf={() => downloadPDF('Movement Pass', [
                  ['Name', request.requestedBy?.name],
                  ['Email', request.requestedBy?.email],
                  ['Date', request.date],
                  ['Time', `${request.startTime} - ${request.endTime}`],
                  ['Status', request.status],
                ], `movement-${request.id}`)} />)
              ))
            )
          }
        />
      );
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <h3 className="text-primary mb-3">HR Panel – {view === 'pending' ? 'Pending' : 'Approved'} Applications</h3>
        <div className="mb-3">
          <button className={`btn btn-${view === 'pending' ? 'primary' : 'outline-primary'} me-2`} onClick={() => setView('pending')}>Pending</button>
          <button className={`btn btn-${view === 'approved' ? 'primary' : 'outline-primary'}`} onClick={() => setView('approved')}>Approved</button>
        </div>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'entry' ? 'active' : ''}`} onClick={() => setActiveTab('entry')}>Entry Slips {getNotificationBadge(view === 'pending' ? entrySlips.length : 0)}</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'leave' ? 'active' : ''}`} onClick={() => setActiveTab('leave')}>Leave Requests {getNotificationBadge(view === 'pending' ? leaveRequests.length : 0)}</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'movement' ? 'active' : ''}`} onClick={() => setActiveTab('movement')}>Movement Passes {getNotificationBadge(view === 'pending' ? movementPasses.length : 0)}</button>
          </li>
        </ul>

      </div>
      <div className="me-2 ms-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HRPanel;
