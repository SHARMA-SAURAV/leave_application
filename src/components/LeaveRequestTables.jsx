
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

export function LeaveApprovalRow({ request, children }) {

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
        <small>
          <strong>From:</strong> {new Date(request.startDate).toLocaleDateString()}
          <br />
          <strong>To:</strong> {new Date(request.endDate).toLocaleDateString()}
        </small>
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

      {children}
    </tr>
  )
}

function SubstituteInput({ onChange }) {
  return (
    <div className="mb-2">
      <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        className="form-control form-control-sm"
        placeholder="Provide substitute"
        required
      />
    </div>
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

export function FlaApprovalRow({ request, action, approvers }) {
  const [slaSelected, setSlaSelected] = useState("");
  const [substituteSelected, setSubstituteSelected] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <LeaveApprovalRow request={request}>
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
        <SubstituteInput onChange={setSubstituteSelected} />
      </TableCell>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(request.id, "approve", slaSelected, substituteSelected)
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(request.id, "reject")
              .finally(() => setLoading(false));
          }}
          approveDisabled={!slaSelected || !substituteSelected}
          loading={loading}
        />
      </TableCell>
    </LeaveApprovalRow>
  );
}

export function SlaApprovalRow({ request, action }) {
  const [substituteSelected, setSubstituteSelected] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <LeaveApprovalRow request={request}>
      <TableCell>
        {(request.substitute == null) ? (
          <SubstituteInput onChange={setSubstituteSelected} />
        ) : (
          request.substitute
        )}

      </TableCell>
      <TableCell>
        <ActionButtons
          onApprove={() => {
            setLoading(true);
            action(request.id, "approve", substituteSelected)
              .finally(() => setLoading(false));
          }}
          onReject={() => {
            setLoading(true);
            action(request.id, "reject")
              .finally(() => setLoading(false));
          }}
          approveDisabled={request.substitute == null && !substituteSelected}
          loading={loading}
        />
      </TableCell>
    </LeaveApprovalRow>
  );
}

export function HrApprovalRow({ request, action }) {
  const [loading, setLoading] = useState(false);

  return (
    <LeaveApprovalRow request={request}>
      <TableCell>
        {request.substitute}
      </TableCell>
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
    </LeaveApprovalRow>
  );
}

export function HrApprovedRow({ request, downloadPdf }) {
  const [loading, setLoading] = useState(false);

  return (
    <LeaveApprovalRow request={request}>
      <TableCell>
        <div className="text-center">{request.substitute}</div>
      </TableCell>
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
    </LeaveApprovalRow>
  );
}
