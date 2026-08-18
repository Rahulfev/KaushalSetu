import axios from "../../../../services/axiosInstance";

export const getClientApplications = () => {
  return axios.get("/applications/client");
};

export const updateApplicationStatus = (applicationId, status) => {
  return axios.put(`/applications/${applicationId}/status?status=${status}`);
};