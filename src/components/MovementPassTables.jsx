
import { UserSelect } from "./FormControls.jsx"
import { useState } from "react";

function TableCell({ children, className = "" }) {
  const finalClassName = `align-middle ${className}`;
  return (
    <td className={finalClassName}>
      {children}
    </td>
  );
}

export function MovementPassApprovalRow({ request, children }) {
  return (
    <tr>
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
        <small>{request.date}</small>
      </TableCell>

      <TableCell>
        <small>
          <strong>From:</strong> {request.startTime}
          <br />
          <strong>To:</strong> {request.endTime}
        </small>
      </TableCell>

      <TableCell>
        <small title={request.reason}>
          {request.reason.length > 30 ? `${request.reason.substring(0, 30)}...` : request.reason}
        </small>
      </TableCell>
      {children}
    </tr>
  )
}

function ActionButtons({ onApprove, onReject, approveDisabled = false, rejectDisabled = false, loading = false }) {
  if (loading) {
    return (
      <div className="text-center">
        <strong>Please wait...</strong>
      </div>
    )
  }
  return (
    <div className="d-flex gap-2">
      <button className="btn btn-success" onClick={onApprove} disabled={approveDisabled}>
        Approve
      </button>
      <button className="btn btn-danger" onClick={onReject} disabled={rejectDisabled}>
        Reject
      </button>
    </div>
  );
}

export function FlaPassApprovalRow({ request, action, approvers }) {
  const [slaSelected, setSlaSelected] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <MovementPassApprovalRow request={request}>
      <TableCell>
        <UserSelect
          users={approvers}
          label="SLA Approver"
          inputName={`sla-approver-${request.id}`}
          value={slaSelected}
          onChange={setSlaSelected}
        />
      </TableCell>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(request.id, "approve", slaSelected)
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(request.id, "reject")
              .finally(() => setLoading(false));
          }}
          approveDisabled={!slaSelected}
          loading={loading}
        />
      </TableCell>
    </MovementPassApprovalRow>
  );
}

export function SlaPassApprovalRow({ request, action }) {
  const [loading, setLoading] = useState(false);

  return (
    <MovementPassApprovalRow request={request}>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(request.id, "approve")
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(request.id, "reject")
              .finally(() => setLoading(false));
          }}
          loading={loading}
        />
      </TableCell>
    </MovementPassApprovalRow>
  );
}

export function HrPassApprovalRow({ request, action }) {
  const [loading, setLoading] = useState(false);

  return (
    <MovementPassApprovalRow request={request}>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(request.id, "approve")
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(request.id, "reject")
              .finally(() => setLoading(false));
          }}
          loading={loading}
        />
      </TableCell>
    </MovementPassApprovalRow>
  );
}

export function HrPassApprovedRow({ request, downloadPdf }) {
  const [loading, setLoading] = useState(false);

  return (
    <MovementPassApprovalRow request={request}>
      <TableCell>
        {loading ? (
          <div className="text-center">
            <strong>Please wait...</strong>
          </div>
        ) : (
          <button className="btn btn-outline-dark mt-2"
            onClick={() => {
              setLoading(true);
              downloadPdf(request)
                .finally(() => setLoading(false));
            }}>
            <i className="fas fa-download me-1"></i> Download PDF
          </button>
        )}
      </TableCell>
    </MovementPassApprovalRow>
  );
}
