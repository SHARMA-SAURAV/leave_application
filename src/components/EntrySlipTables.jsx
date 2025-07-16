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

export function EntrySlipApprovalRow({ slip, children }) {
  return (
    <tr>
      <TableCell>
        <div>
          <strong>{slip.createdBy?.name}</strong>
          <br />
          <small className="text-muted">{slip.createdBy?.department}</small>
        </div>
      </TableCell>

      <TableCell>
        <small>{slip.createdBy?.email}</small>
      </TableCell>

      <TableCell>
        <small>{slip.createdBy?.department}</small>
      </TableCell>

      <TableCell>
        <small>{slip.date}</small>
      </TableCell>

      <TableCell>
        <small>
          <strong>In:</strong> {slip.inTime}
          <br />
          <strong>Out:</strong> {slip.outTime}
        </small>
      </TableCell>

      <TableCell>
        <small title={slip.reason}>
          {slip.reason}
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

export function FlaEntrySlipApprovalRow({ slip, action, approvers }) {
  const [slaSelected, setSlaSelected] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <EntrySlipApprovalRow slip={slip}>
      <TableCell>
        <UserSelect
          users={approvers}
          label="SLA Approver"
          inputName={`sla-approver-${slip.id}`}
          value={slaSelected}
          onChange={setSlaSelected}
        />
      </TableCell>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(slip.id, "approve", slaSelected)
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(slip.id, "reject")
              .finally(() => setLoading(false));
          }}
          approveDisabled={!slaSelected}
          loading={loading}
        />
      </TableCell>
    </EntrySlipApprovalRow>
  );
}

export function SlaEntrySlipApprovalRow({ slip, action }) {
  const [loading, setLoading] = useState(false);

  return (
    <EntrySlipApprovalRow slip={slip}>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(slip.id, "approve")
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(slip.id, "reject")
              .finally(() => setLoading(false));
          }}
          loading={loading}
        />
      </TableCell>
    </EntrySlipApprovalRow>
  );
}

export function HrEntrySlipApprovalRow({ slip, action }) {
  const [loading, setLoading] = useState(false);

  return (
    <EntrySlipApprovalRow slip={slip}>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(slip.id, "approve")
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(slip.id, "reject")
              .finally(() => setLoading(false));
          }}
          loading={loading}
        />
      </TableCell>
    </EntrySlipApprovalRow>
  );
}

export function HrEntrySlipApprovedRow({ slip, downloadPdf }) {
  const [loading, setLoading] = useState(false);

  return (
    <EntrySlipApprovalRow slip={slip}>
      <TableCell>
        {loading ? (
          <div className="text-center">
            <strong>Please wait...</strong>
          </div>
        ) : (
          <button className="btn btn-outline-dark mt-2"
            onClick={() => {
              setLoading(true);
              downloadPdf(slip)
                .finally(() => setLoading(false));
            }}>
            <i className="fas fa-download me-1"></i> Download PDF
          </button>
        )}
      </TableCell>
    </EntrySlipApprovalRow>
  );
}