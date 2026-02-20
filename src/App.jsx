import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import ApplyEntrySlip from './pages/ApplyEntrySlip';
import SLAPanel from './pages/SLAPanel';
import HRPanel from './pages/HRPanel';
import FLAPanel from './pages/FLAPanel';
import Navbar from './components/Navbar';
import LeaveStatus from './pages/LeaveStatus';
import EntrySlipStatus from './pages/EntrySlipStatus';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FLAUpcoming from './pages/FLAUpcoming';
import SLAUpcoming from './pages/SLAUpcoming';
import HRUpcoming from './pages/HRUpcoming';
import ApplyMovementPass from './pages/ApplyMovementPass';
import MovementPassStatus from './pages/MovementPassStatus';
import LeaveCalendar from './pages/LeaveCalendar';
import AttendanceComponent from './components/AttendanceComponent';
import AttendanceAnalytics from './pages/AttendanceAnalytics ';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import HRLeaveData from './pages/HRLeaveData';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register-user" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/apply-leave" element={<ApplyLeave />} />
//         <Route path="/apply-movement-pass" element={<ApplyMovementPass />} />
//         <Route path="/sla-dashboard" element={<SLAPanel />} />
//         <Route path="/hr-dashboard" element={<HRPanel />} />
//         <Route path="/fla-dashboard" element={<FLAPanel />} />
//         <Route path="/fla-upcoming" element={<FLAUpcoming />} />
//         <Route path="/sla-upcoming" element={<SLAUpcoming />} />
//         <Route path="/leave-calender" element={<AttendanceComponent />} />
//         <Route path="/hr-upcoming" element={<HRUpcoming />} />
//         <Route path="/entry-slip-status" element={<EntrySlipStatus />} />
//         <Route path="/leave-status" element={<LeaveStatus />} />
//         <Route path="/movement-pass-status" element={<MovementPassStatus />} />
//         <Route path="/entry-slip" element={<ApplyEntrySlip />} />
//         <Route path="/calender" element={<LeaveCalendar />} />
//         <Route path="/attendance-analytics" element={<AttendanceAnalytics  />} />

//       </Routes>
//     </Router>
//   );
// }



function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register-user"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-movement-pass"
          element={
            <ProtectedRoute>
              <ApplyMovementPass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fla-dashboard"
          element={
            <ProtectedRoute>
              <FLAPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sla-dashboard"
          element={
            <ProtectedRoute>
              <SLAPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["HR"]}>
              <HRPanel />
            </RoleProtectedRoute>
          }
        />


        <Route path="/fla-upcoming" element={<ProtectedRoute><FLAUpcoming /></ProtectedRoute>} />
        <Route path="/sla-upcoming" element={<ProtectedRoute><SLAUpcoming /></ProtectedRoute>} />
        <Route path="/leave-calender" element={<ProtectedRoute><AttendanceComponent /></ProtectedRoute>} />
        <Route path="/hr-upcoming" element={<ProtectedRoute><HRUpcoming /></ProtectedRoute>} />
        <Route path="/hr-leaveData" element={<ProtectedRoute><HRLeaveData /></ProtectedRoute>} />
        <Route path="/entry-slip-status" element={<ProtectedRoute><EntrySlipStatus /></ProtectedRoute>} />
        <Route path="/leave-status" element={<ProtectedRoute><LeaveStatus /></ProtectedRoute>} />
        <Route path="/movement-pass-status" element={<ProtectedRoute><MovementPassStatus /></ProtectedRoute>} />
        <Route path="/entry-slip" element={<ProtectedRoute><ApplyEntrySlip /></ProtectedRoute>} />
        <Route path="/calender" element={<ProtectedRoute><LeaveCalendar /></ProtectedRoute>} />
        <Route path="/attendance-analytics" element={<ProtectedRoute><AttendanceAnalytics /></ProtectedRoute>} />

        {/* repeat for ALL secure pages */}
      </Routes>
    </Router>
  );
}

export default App;





