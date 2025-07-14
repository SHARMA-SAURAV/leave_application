import api from "./api"

export async function movementPassApproveApi(requestId, approvalRole, approvalStatus, extraData = {}) {
  const requestBody = {
    isApproved: approvalStatus === "approve",
    ...extraData,
  }
  try {
    await api.patch(`/movement/${approvalRole}/approve/${requestId}`, requestBody);
    alert(`Movement pass ${approvalStatus}ed successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to ${approvalStatus} movement pass`, error);
    alert(`Failed to ${approvalStatus} movement pass`);
    return false;
  }
}