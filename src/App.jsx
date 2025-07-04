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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/apply-leave" element={<ApplyLeave />} />
      <Route path="/sla-dashboard" element={<SLAPanel />} />
      <Route path="/hr-dashboard" element={<HRPanel />} />
      <Route path="/fla-dashboard" element={<FLAPanel />} />
      <Route path="/entry-slip-status" element={<EntrySlipStatus />} />
      <Route path="/leave-status" element={<LeaveStatus />} />

      <Route path="/entry-slip" element={<ApplyEntrySlip />} />
      </Routes>
    </Router>
  );
}

export default App;
