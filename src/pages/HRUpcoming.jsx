// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import { LeaveInformationRow } from '../components/UpcomingLeaveTables';

// const HRUpcoming = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   // Debounce search term
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   useEffect(() => {
//     const fetchLeaveRequests = async () => {
//       try {
//         let requestBody = {}
//         if (debouncedSearchTerm) {
//           requestBody = { searchString: debouncedSearchTerm };
//         }
//         const res = await api.get('/leave/hr/upcoming', { params: requestBody });
//         setLeaveRequests(res.data);
//       } catch (err) {
//         console.error('Error fetching leave applications:', err);
//       }
//     };

//     fetchLeaveRequests();
//   }, [debouncedSearchTerm]);

//   return (
//     <div className="container mt-4">
//       <h3 className="text-primary mb-4">Leave Requests</h3>
//       <input
//         type="text"
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="form-control mb-3 w-50"
//         placeholder="Search employee name"
//         required
//       />
//       {leaveRequests.length === 0 ? (
//         <p className="text-muted">No upcoming leave applications for HR.</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th scope="col">Leave Period</th>
//                 <th scope="col">Employee</th>
//                 <th scope="col">Email</th>
//                 <th scope="col">ID</th>
//                 <th scope="col">Dept</th>
//                 <th scope="col">Reason</th>
//                 <th scope="col">Leave Days</th>
//                 <th scope="col">Substitute</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaveRequests.map((request) => (
//                 <LeaveInformationRow
//                   key={request.id}
//                   request={request}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HRUpcoming;











import React, { useEffect, useState } from "react";
import api from "../services/api";
import { LeaveInformationRow } from "../components/UpcomingLeaveTables";

const HRUpcoming = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("UPCOMING");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data based on tab
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        let params = {};
        if (debouncedSearchTerm) {
          params.searchString = debouncedSearchTerm;
        }

        let url = "";

        if (activeTab === "UPCOMING") {
          url = "/leave/hr/upcoming";
        } else {
          url = "/leave/all/requests";
        }

        const res = await api.get(url, { params });
        setLeaveRequests(res.data);
      } catch (err) {
        console.error("Error fetching leave applications:", err);
      }
    };

    fetchLeaveRequests();
  }, [debouncedSearchTerm, activeTab]);

  return (
    <div className="container mt-4">

      {/* Dynamic Heading */}
      <h3 className="text-primary mb-4">
        {activeTab === "UPCOMING"
          ? "Upcoming Approved Leaves"
          : "Active Leave Applications (Pending at FLA / SLA)"}
      </h3>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "UPCOMING" ? "active" : ""}`}
            onClick={() => setActiveTab("UPCOMING")}
          >
            Upcoming Leaves
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ACTIVE" ? "active" : ""}`}
            onClick={() => setActiveTab("ACTIVE")}
          >
            Active Applications (FLA / SLA)
          </button>
        </li>
      </ul>

      {/* Search */}
      <input
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="form-control mb-3 w-50"
        placeholder="Search employee name"
      />

      {/* Clear Search Button */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => setSearchTerm("")}
      >
        Clear Search
      </button>

      {/* Table */}
      {leaveRequests.length === 0 ? (
        <p className="text-muted">No leave applications found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Leave Period</th>
                <th>Employee</th>
                <th>Email</th>
                <th>ID</th>
                <th>Dept</th>
                <th>Reason</th>
                <th>Leave Days</th>
                <th>Substitute</th>
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

export default HRUpcoming;
