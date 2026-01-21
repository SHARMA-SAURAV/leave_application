// import MonthlySummaryChart from "../components/Analytics/MonthlySummaryChart";
// import PeakDatesTable from "../components/Analytics/PeakDatesTable";
// import TopEmployeesTable from "../components/Analytics/TopEmployeesTable";
// import ExportButtons from "../components/Analytics/ExportButtons";
// import DepartmentAnalyticsChart from "../components/Analytics/DepartmentAnalyticsChart";
// import DepartmentAnalyticsTable from "../components/Analytics/DepartmentAnalyticsTable";
// import MonthlyAttendanceMatrix from "../components/Analytics/MonthlyAttendanceMatrix";


// const AttendanceAnalytics = () => {
//   return (
//     <div className="container-fluid py-4">
//       <h4 className="fw-bold mb-4">
//         Attendance Analytics (Current Year)
//       </h4>

//       <div className="row g-4">
//         <div className="col-md-6">
//           <MonthlySummaryChart />
//         </div>

//         <div className="col-md-6">
//           <DepartmentAnalyticsChart />
//         </div>

//         <div className="col-md-12">
//           <DepartmentAnalyticsTable />
//         </div>

//         <div className="col-md-12">
//           <TopEmployeesTable />
//         </div>

//         <div className="col-md-12">
//           <PeakDatesTable />
//         </div>

//         <div className="col-md-12">
//           <MonthlyAttendanceMatrix />
//         </div>
//       </div>
//       {/* <ExportButtons /> */}
//     </div>
//   );
// };

// export default AttendanceAnalytics;






















import { useState } from "react";
import MonthlySummaryChart from "../components/Analytics/MonthlySummaryChart";
import PeakDatesTable from "../components/Analytics/PeakDatesTable";
import TopEmployeesTable from "../components/Analytics/TopEmployeesTable";
import DepartmentAnalyticsChart from "../components/Analytics/DepartmentAnalyticsChart";
import DepartmentAnalyticsTable from "../components/Analytics/DepartmentAnalyticsTable";
import MonthlyAttendanceMatrix from "../components/Analytics/MonthlyAttendanceMatrix";
import { getYearlyData } from "../services/analyticsApi";

const AttendanceAnalytics = () => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const syncFullYear = async (force = false) => {
    try {
      setLoading(true);
      setMessage("");

      const year = new Date().getFullYear();

      const res = await getYearlyData(year, force);
      setData(res.data);
      // await axios.post("/api/attendance/syncYear", null, {
      //   params: { year, force }
      // });

      setMessage(`✅ Full year ${year} sync started`);
    } catch (err) {
      setMessage("❌ Year sync failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">
          Attendance Analytics (Current Year)
        </h4>

        <div className="d-flex gap-2">
          {/* <button
            className="btn btn-outline-primary"
            disabled={loading}
            onClick={() => syncFullYear(false)}
          >
            Sync Year
          </button> */}

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => syncFullYear(true)}
          >
            Sync
          </button>
        </div>
      </div>

      {message && <div className="alert alert-info py-2">{message}</div>}

      {/* DASHBOARD */}
      <div className="row g-4">
        <div className="col-md-6">
          <MonthlySummaryChart />
        </div>

        <div className="col-md-6">
          <DepartmentAnalyticsChart />
        </div>

        <div className="col-md-12">
          <DepartmentAnalyticsTable />
        </div>

        <div className="col-md-12">
          <TopEmployeesTable />
        </div>

        <div className="col-md-12">
          <PeakDatesTable />
        </div>

        <div className="col-md-12">
          <MonthlyAttendanceMatrix />
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;
