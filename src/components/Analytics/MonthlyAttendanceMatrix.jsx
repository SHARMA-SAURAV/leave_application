import React, { useEffect, useState } from "react";
import { getMonthlyAttendanceMatrix } from "../../services/analyticsApi";
import "../../styles/analytics/MonthlyAttendanceMatrix.css";

const MonthlyAttendanceMatrix = () => {
    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(false);

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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

    return (
        <>

            <h2>Monthly Attendance Matrix</h2>

            {/* Filters */}
            <div className="filters">
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
            <div className="legend">
                <span><span className="legend-box leave"></span> Leave (LL)</span>
                <span><span className="legend-box absent"></span> Absent (AA)</span>
                <span><span className="legend-box present"></span> Present</span>
            </div>

        <div className="matrix-container">
        

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="table-wrapper">
                    <table className="matrix-table">
                        <thead style={{position: "sticky"}}>
                            <tr>
                                <th className="sticky-col">Employee</th>
                                {days.map(d => (
                                    <th key={d}>{d}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map(emp => (
                                <tr key={emp.empId}>
                                    <td className="sticky-col emp-name">
                                        {emp.name}
                                    </td>

                                    {days.map(day => {
                                        const status = emp.dailyStatus?.[day];

                                        return (
                                            <td
                                                key={day}
                                                className={
                                                    status === "LL"
                                                        ? "leave-cell"
                                                        : status === "AA"
                                                            ? "absent-cell"
                                                            : "present-cell"
                                                }
                                            >
                                                {status ? "✔" : ""}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Legend */}
            {/* <div className="legend">
                <span><span className="legend-box leave"></span> Leave (LL)</span>
                <span><span className="legend-box absent"></span> Absent (AA)</span>
                <span><span className="legend-box present"></span> Present</span>
            </div> */}
        </div>

        </>
    );
};

export default MonthlyAttendanceMatrix;
