import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { LeaveInformationRow } from '../components/UpcomingLeaveTables';

const SLAUpcoming = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        let requestBody = {}
        if (debouncedSearchTerm) {
          requestBody = { searchString: debouncedSearchTerm };
        }
        const res = await api.get('/leave/sla/upcoming', { params: requestBody });
        setLeaveRequests(res.data);
      } catch (err) {
        console.error('Error fetching leave applications:', err);
      }
    };

    fetchLeaveRequests();
  }, [debouncedSearchTerm]);

  return (
    <div className="container mt-4">
      <h3 className="text-primary mb-4">Leave Requests</h3>
      <input
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3 w-50"
        placeholder="Search employee name"
        required
      />
      {leaveRequests.length === 0 ? (
        <p className="text-muted">No upcoming leave applications for SLA.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">Leave Period</th>
                <th scope="col">Employee</th>
                <th scope="col">Email</th>
                <th scope="col">ID</th>
                <th scope="col">Dept</th>
                <th scope="col">Reason</th>
                <th scope="col">Leave Days</th>
                <th scope="col">Substitute</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <LeaveInformationRow
                  key={request.id}
                  request={request}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SLAUpcoming;
