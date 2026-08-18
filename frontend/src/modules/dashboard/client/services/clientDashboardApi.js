import axios from "../../../../services/axiosInstance";

export const getClientDashboard = () => {
  return axios.get("/dashboard/client");
};