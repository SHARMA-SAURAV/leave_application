// import api from "./api";

// // 📊 Monthly peaks
// export const getMonthlyPeaks = () =>
//   api.get("/attendance/analytics/advanced/peak-months-current-year");

// // 🧑 Employee monthly analytics
// export const getEmployeeMonthlyAnalytics = () =>
//   api.get("/attendance/analytics/advanced/employee-monthly");

// // 🏆 Top employees
// export const getTopEmployees = () =>
//   api.get("/attendance/analytics/advanced/top-employees");

// // ⚠️ Problematic dates (used for heatmap)
// export const getHeatmap = () =>
//   api.get("/attendance/analytics/advanced/problematic-dates");






import api from "./api";

// 📊 Monthly leave & absence summary
export const getMonthlySummary = () =>
  api.get("/attendance/analytics/monthly/summary");

// 🏆 Top employees (yearly)
export const getTopEmployees = () =>
  api.get("/attendance/analytics/top-employees");

// 🔥 Peak problematic dates
export const getPeakDates = () =>
  api.get("/attendance/analytics/peak-dates");
export const getDepartmentAnalytics = () =>
  api.get("/attendance/analytics/department-wise");

export const getMonthlyAttendanceMatrix  = (year, month) =>
  api.get(`/attendance/analytics/monthly-matrix?year=${year}&month=${month}`);
export const getYearlyData = (year, force=false) =>
  api.post(`/attendance/syncYear?year=${year}&force=${force}`);

export const syncLeavesData = () =>
  api.get("/admin/scrape-leaves");