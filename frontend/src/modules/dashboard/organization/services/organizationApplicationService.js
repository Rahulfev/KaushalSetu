import axiosInstance from '@/services/axiosInstance';

// GET all applications
export const getOrganizationApplications = async () => {
  const response = await axiosInstance.get('/organization/applications');
  return response.data;
};

// APPROVE / REJECT
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axiosInstance.put(
    `/organization/applications/${applicationId}/status`,
    null,
    {
      params: { status },
    },
  );
  return response.data;
};
