import React, { useEffect, useState } from "react";
import { getMonthlyAttendanceMatrix } from "../../services/analyticsApi";
import "../../styles/analytics/MonthlyAttendanceMatrix.css";

const MonthlyAttendanceMatrix = () => {
    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const searchStyle = {
        width: 240,
        maxWidth: "40%",
        padding: "8px 12px",
        marginRight: 12,
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
        outline: "none",
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
    };

    const searchFocusStyle = {
        boxShadow: "0 0 0 3px rgba(21,156,228,0.15)",
        borderColor: "#159ce4",
    };

    const daysInMonth = new Date(year, month, 0).getDate();

    // Generate days with day names
    const getDaysWithNames = () => {
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month - 1, i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({ number: i, name: dayName });
        }
        return days;
    };

    const days = getDaysWithNames();

    useEffect(() => {
        fetchMatrix();
    }, [year, month]);

    const fetchMatrix = async () => {
        setLoading(true);
        try {
            const res = await getMonthlyAttendanceMatrix(year, month);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching attendance matrix", err);
        }
        setLoading(false);
    };

    const filteredData = data.filter(emp =>
        emp.name?.toLowerCase().includes(search.trim().toLowerCase())
    );

    return (
        <>
            <div className="matrix-header">
                <h2>Monthly Attendance Matrix</h2>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        aria-label="Search employee by name"
                        className="employee-search"
                        style={searchStyle}
                        onFocus={e => Object.assign(e.target.style, searchFocusStyle)}
                        onBlur={e => Object.assign(e.target.style, searchStyle)}
                    />
                    <select value={month} onChange={e => setMonth(+e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </option>
                        ))}
                    </select>
                    <select value={year} onChange={e => setYear(+e.target.value)}>
                        {[year - 1, year, year + 1].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="legend">
                <span><span className="legend-box leave"></span> Leave (L)</span>
                <span><span className="legend-box absent"></span> Absent (A)</span>
                <span><span className="legend-box present"></span> Present (P)</span>
            </div>

            <div className="matrix-container">
                {loading ? (
                    <p className="loading">Loading...</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="matrix-table">
                            <thead>
                                <tr>
                                    <th className="sticky-col corner-cell">Employee</th>
                                    {days.map(day => (
                                        <th
                                            key={day.number}
                                            className="sticky-header day-header-vertical"
                                            title={`${day.number} ${day.name}`}
                                        >
                                            <div className="day-stack">
                                                <div className="day-number">{day.number}</div>
                                                <div className="day-name">{day.name}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.map(emp => (
                                    <tr key={emp.empId}>
                                        <td className="sticky-col emp-name">
                                            {emp.name}
                                        </td>
                                        {days.map(day => {
                                            const status = emp.dailyStatus?.[day.number];
                                            return (
                                                <td
                                                    key={day.number}
                                                    className={
                                                        status === "LL"
                                                            ? "leave-cell"
                                                            : status === "AA"
                                                                ? "absent-cell"
                                                                : "present-cell"
                                                    }
                                                    title={status === "LL" ? "Leave (LL)" : status === "AA" ? "Absent (AA)" : "Present"}
                                                >
                                                    {status === "LL" ? "L" : status === "AA" ? "A" : status ? "P" : ""}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {!loading && filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={days.length + 1} className="no-results">No employees found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default MonthlyAttendanceMatrix;
