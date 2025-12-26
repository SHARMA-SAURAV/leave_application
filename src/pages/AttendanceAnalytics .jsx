import MonthlySummaryChart from "../components/Analytics/MonthlySummaryChart";
import PeakDatesTable from "../components/Analytics/PeakDatesTable";
import TopEmployeesTable from "../components/Analytics/TopEmployeesTable";
import ExportButtons from "../components/Analytics/ExportButtons";
import DepartmentAnalyticsChart from "../components/Analytics/DepartmentAnalyticsChart";
import DepartmentAnalyticsTable from "../components/Analytics/DepartmentAnalyticsTable";
import MonthlyAttendanceMatrix from "../components/Analytics/MonthlyAttendanceMatrix";


const AttendanceAnalytics = () => {
  return (
    <div className="container-fluid py-4">
      <h4 className="fw-bold mb-4">
        Attendance Analytics (Current Year)
      </h4>

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
      {/* <ExportButtons /> */}
    </div>
  );
};

export default AttendanceAnalytics;
