
import { UserSelect } from "./FormControls.jsx"

function TableCell({ children, className = "" }) {
  const finalClassName = `align-middle ${className}`;
  return (
    <td className={finalClassName}>
      {children}
    </td>
  );
}

export function LeaveInformationRow({ request }) {
  const getLeavesUsed = (leave) => {
    return leave.leaveTypes.map((type) => (
      (<span key={type} className="badge bg-success ms-1 me-1">{type}</span>)
    ))
  }
  return (
    <tr>
      <TableCell>
        <small>
          <strong>From:</strong> {new Date(request.startDate).toLocaleDateString()}
          <br />
          <strong>To:</strong> {new Date(request.endDate).toLocaleDateString()}
        </small>
      </TableCell>

      <TableCell>
        <div>
          <strong>{request.requestedBy.name}</strong>
          <br />
          <small className="text-muted">{request.requestedBy.department}</small>
        </div>
      </TableCell>

      <TableCell>
        <small>{request.requestedBy.email}</small>
      </TableCell>

      <TableCell>
        <small>{request.requestedBy.employeeId}</small>
      </TableCell>

      <TableCell>
        <small>{request.requestedBy.department}</small>
      </TableCell>

      <TableCell>
        <small title={request.reason}>
          {request.reason}
        </small>
      </TableCell>

      <TableCell>
        {getLeavesUsed(request)}
      </TableCell>
      <TableCell>
        <div className="text-center">
          <strong>{request.substitute}</strong>
        </div>
      </TableCell>
    </tr>
  )
}
