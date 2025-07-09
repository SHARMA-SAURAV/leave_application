
import { UserSelect, WideInput } from "./FormControls.jsx"
import { ListCard, ListCardLine, ListCardButtonPair } from "./ListCard"
import { useState, useRef } from "react";

// To validate the form and call the action
function callAction(form, action, ...args) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  action(...args);
}

export function FlaApprovalCard({ request, action, approvers }) {
  const formRef = useRef(null);
  const [slaSelected, setSlaSelected] = useState("");
  const [substituteSelected, setSubstituteSelected] = useState("");
  return (
    <ListCard cardId={request.id} title={`Leave Request - ${request.requestedBy.name}`}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <LeaveDetailsText request={request} />
        <div className="row mt-2">
          <UserSelect
            users={approvers}
            label="Select SLA Approver"
            inputName={`approver-${request.id}`}
            value={slaSelected}
            onChange={(newId) => setSlaSelected(newId)}
          />
        </div>
        <div className="row">
          <WideInput label={"Select Substitute"} forName={`substitute-${request.id}`} divClasses="col-md-6">
            <input type="text" onChange={(e) => setSubstituteSelected(e.target.value)} className="form-control" id="exampleInput" placeholder="Name" required />
          </WideInput>
        </div>
        <ListCardButtonPair
          approveLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Approving...
            </>
          ) : "Approve"}
          rejectLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Rejecting...
            </>
          ) : "Reject"}
          onApprove={() => callAction(formRef.current, action, request.id, "approve", slaSelected, substituteSelected)}
          onReject={() => action(request.id, "reject", slaSelected, substituteSelected)}
          approveDisabled={loading}
          rejectDisabled={loading}
        />

      </form>
    </ListCard>
  )
}

export function SlaApprovalCard({ request, action }) {
  const formRef = useRef(null);
  const [substituteSelected, setSubstituteSelected] = useState(null);

  return (
    <ListCard cardId={request.id} title={`Leave Request - ${request.requestedBy.name}`}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <LeaveDetailsText request={request} />
        {request.substitute === null && (
          <div className="row">
            <WideInput label={"Select Substitute"} forName={`substitute-${request.id}`} divClasses="col-md-6">
              <input type="text" onChange={(e) => setSubstituteSelected(e.target.value)} className="form-control" id="exampleInput" placeholder="Name" required />
            </WideInput>
          </div>
        )}
        <ListCardButtonPair
          approveLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Approving...
            </>
          ) : "Approve"}
          rejectLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Rejecting...
            </>
          ) : "Reject"}
          onApprove={() => callAction(formRef.current, action, request.id, "approve", slaSelected, substituteSelected)}
          onReject={() => action(request.id, "reject", slaSelected, substituteSelected)}
          approveDisabled={loading}
          rejectDisabled={loading}
        />

      </form>
    </ListCard>
  )
}

export function HrApprovalCard({ request, action }) {
  const formRef = useRef(null);
  return (
    <ListCard cardId={request.id} title={`Leave Request - ${request.requestedBy.name}`}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <LeaveDetailsText request={request} />
        <ListCardButtonPair
          approveLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Approving...
            </>
          ) : "Approve"}
          rejectLabel={loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Rejecting...
            </>
          ) : "Reject"}
          onApprove={() => callAction(formRef.current, action, request.id, "approve", slaSelected, substituteSelected)}
          onReject={() => action(request.id, "reject", slaSelected, substituteSelected)}
          approveDisabled={loading}
          rejectDisabled={loading}
        />

      </form>
    </ListCard>
  )
}

export function HrApprovedCard({ request, downloadPdf }) {
  return (
    <ListCard cardId={request.id} title={`Leave Request - ${request.requestedBy.name}`}>
      <form onSubmit={(e) => e.preventDefault()}>
        <LeaveDetailsText request={request} />
        <button className="btn btn-outline-dark mt-2" onClick={() => downloadPdf(request)}>
          <i className="fas fa-download me-1"></i> Download PDF
        </button>
      </form>
    </ListCard>
  )
}

export function LeaveDetailsText({ request }) {
  return (
    <>
      <ListCardLine label="Employee Name" value={request.requestedBy.name} />
      <ListCardLine label="Employee Email" value={request.requestedBy.email} />
      <ListCardLine label="Employee ID" value={request.requestedBy.employeeId} />
      <ListCardLine label="Department" value={request.requestedBy.department} />
      <ListCardLine label="Start Date" value={new Date(request.startDate).toLocaleDateString()} />
      <ListCardLine label="End Date" value={new Date(request.endDate).toLocaleDateString()} />
      <ListCardLine label="Reason" value={request.reason} />


      {request.substitute !== null && <ListCardLine label="Substitute" value={request.substitute} />}
      <ListCardLine label="CL Leaves" value={request.clLeaves} />
      <ListCardLine label="PL Leaves" value={request.plLeaves} />
      <ListCardLine label="RH Leaves" value={request.rhLeaves} />
      <ListCardLine label="Other Leaves" value={request.otherLeaves} />
    </>
  );
}
