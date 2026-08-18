import axios from "../../../../services/axiosInstance";

export const getClientProfile = () => {
  return axios.get("/client/profile");
};

export const updateClientProfile = (data) => {
  return axios.put("/client/profile/update", data);
};


export const deleteClientAccount = () => {
  return axios.delete("/client/profile/delete");
};

/*
export const deleteClientAccount = () => {
  return axiosInstance.delete("/api/client/profile/block");
};
*/

