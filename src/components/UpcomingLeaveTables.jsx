
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
          {request.reason.length > 30 ? `${request.reason.substring(0, 30)}...` : request.reason}
        </small>
      </TableCell>

      <TableCell>
        <small>
          <div>CL: {request.clLeaves}</div>
          <div>PL: {request.plLeaves}</div>
          <div>RH: {request.rhLeaves}</div>
          <div>Other: {request.otherLeaves}</div>
        </small>
      </TableCell>
      <TableCell>
        <div className="text-center">
          <strong>{request.substitute}</strong>
        </div>
      </TableCell>
    </tr>
  )
}
