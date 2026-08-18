import axiosInstance from "@/services/axiosInstance";

export const getClientApplications = async () => {
  const res = await axiosInstance.get("/client/applications");
  return res.data;
};

export const assignApplication = (applicationId) =>
  axiosInstance.put(`/client/applications/${applicationId}/assign`);

export const rejectApplication = (applicationId) =>
  axiosInstance.put(`/client/applications/${applicationId}/reject`);
