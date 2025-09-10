import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const groupColors = {
  SWT: "#007bff",
  HWT: "#28a745",
  ISS: "#dc3545",
  "E&T": "#17a2b8",
  "HR&Admin": "#ffc107",
  NetOps: "#6f42c1",
  Default: "#6c757d",
};

const LeaveCalendar = ({ leaveData, selectedMonth, selectedYear }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!leaveData || leaveData.length === 0) {
      setEvents([]);
      return;
    }

    const formatted = leaveData.map((d) => {
      const color = groupColors[d.groupName] || groupColors.Default;
      return {
        id: (d.empId || d.emp_id) + "-" + d.date,
        title: `${d.name} (${d.status})`,
        start: moment(d.date, "YYYY-MM-DD").toDate(),
        end: moment(d.date, "YYYY-MM-DD").toDate(),
        allDay: true,
        resource: { color, group: d.groupName },
      };
    });
    setEvents(formatted);

    // Always show selected month/year if provided
    if (selectedMonth && selectedYear) {
      setDate(new Date(selectedYear, selectedMonth - 1, 1));
    }
  }, [leaveData, selectedMonth, selectedYear]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.resource?.color || "#6c757d";
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "6px",
        padding: "2px",
        fontSize: "0.8rem",
      },
    };
  };

  // Legend rendering
  const legendItems = Object.entries(groupColors)
    .filter(([key]) => key !== "Default")
    .map(([group, color]) => (
      <span
        key={group}
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginRight: "16px",
          fontSize: "0.95em",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "16px",
            height: "16px",
            background: color,
            borderRadius: "4px",
            marginRight: "6px",
            border: "1px solid #ccc",
          }}
        ></span>
        {group}
      </span>
    ));

  // Add custom CSS for the rbc-overlay (popup)
  useEffect(() => {
    const styleId = "calendar-popup-scroll-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .rbc-overlay {
          max-height: 350px !important;
          overflow-y: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div>
      <div className="mb-2" style={{ paddingLeft: "4px" }}>
        <strong>Legend:</strong> {legendItems}
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        eventPropGetter={eventStyleGetter}
        views={{ month: true, week: true, day: true, agenda: true }}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        toolbar={true}
        popup
        popupOffset={{ x: 30, y: 20 }} // optional: adjust popup position
      />
    </div>
  );
};

export default LeaveCalendar;
