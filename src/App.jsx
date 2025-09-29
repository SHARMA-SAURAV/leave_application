// import { useState } from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import './App.css'
// // import { Routes } from 'react-router-dom'
// import Navbar from './components/Navbar'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div className='app-container'>
//     <Navbar />

//     <Routes>
//       <Route path="/" element={<Login />} />
//     </Routes>

//     </div>
//   )
// }

// export default App



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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-user" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply-leave" element={<ApplyLeave />} />
        <Route path="/apply-movement-pass" element={<ApplyMovementPass />} />
        <Route path="/sla-dashboard" element={<SLAPanel />} />
        <Route path="/hr-dashboard" element={<HRPanel />} />
        <Route path="/fla-dashboard" element={<FLAPanel />} />
        <Route path="/fla-upcoming" element={<FLAUpcoming />} />
        <Route path="/sla-upcoming" element={<SLAUpcoming />} />
        <Route path="/leave-calender" element={<AttendanceComponent />} />
        <Route path="/hr-upcoming" element={<HRUpcoming />} />
        <Route path="/entry-slip-status" element={<EntrySlipStatus />} />
        <Route path="/leave-status" element={<LeaveStatus />} />
        <Route path="/movement-pass-status" element={<MovementPassStatus />} />
        <Route path="/entry-slip" element={<ApplyEntrySlip />} />
        <Route path="/calender" element={<LeaveCalendar />} />

      </Routes>
    </Router>
  );
}

export default App;
