import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getMonthlySummary } from "../../services/analyticsApi";
import "../../styles/analytics/MontlySummaryChart.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlySummaryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMonthlySummary().then(res => setData(res.data));
  }, []);

  const chartData = {
    labels: data.map(d => monthNames[d.month - 1]),
    datasets: [
      {
        label: "Leaves",
        data: data.map(d => d.leaves),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20
      },
      {
        label: "Absences",
        data: data.map(d => d.absences),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20
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
    <div className="monthly-chart-card">
      <div className="monthly-chart-header">
        <h2>Monthly Attendance Summary</h2>
        <p>Leaves and absences across the year</p>
      </div>

      <div className="monthly-chart-body">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
