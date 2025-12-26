import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getDepartmentAnalytics } from "../../services/analyticsApi";
import "../../styles/analytics/DepartmentAnalyticsChart.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function DepartmentAnalyticsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDepartmentAnalytics().then(res => setData(res.data));
  }, []);

  const chartData = {
    labels: data.map(d => d.department),
    datasets: [
      {
        label: "Leaves",
        data: data.map(d => d.totalLeaves),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24
      },
      {
        label: "Absences",
        data: data.map(d => d.totalAbsences),
       backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 24
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            size: 12
          },
          color: "#4b5563"
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 10,
        titleFont: {
          family: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          size: 12,
          weight: "600"
        },
        bodyFont: {
          family: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          size: 11
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            size: 11
          },
          precision: 0
        },
        grid: {
          color: "rgba(209, 213, 219, 0.4)"
        }
      }
    }
  };

  return (
    <div className="department-chart-card">
      <div className="department-chart-header">
        <h2>Department-wise Attendance</h2>
        <p>Leaves and absences across departments</p>
      </div>

      <div className="department-chart-body">
        <Bar className="department-bar" data={chartData} options={options} />
      </div>
    </div>
  );
}
