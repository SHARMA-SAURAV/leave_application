import api from "./api"

export async function leaveApproveApi(requestId, approvalRole, approvalStatus, extraData = {}) {
  const requestBody = {
    isApproved: approvalStatus === "approve",
    ...extraData,
  }
  try {
    await api.patch(`/leave/${approvalRole}/approve/${requestId}`, requestBody);
    alert(`Leave request ${approvalStatus}ed successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to ${approvalStatus} leave request`, error);
    alert(`Failed to ${approvalStatus} leave request`);
    return false;
  }
}