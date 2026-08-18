import axios from "../../../../services/axiosInstance";

export const createJob = (data) => {
  return axios.post("/jobs/create", data);
};

export const getMyJobs = () => {
  return axios.get("/jobs/client");
};

export const deleteJob = (id) => {
  return axios.delete(`/jobs/delete/${id}`);
};

export const updateJob = (id, data) => {
  return axios.put(`/jobs/update/${id}`, data);
};

export const cancelJob = (id) => {
  return axios.put(`/jobs/${id}/cancel`);
};
