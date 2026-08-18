import axiosInstance from '@/services/axiosInstance';

// Pass exactly one of contractId (Organization flow) or applicationId (Client household flow).
export const submitReviewApi = ({ contractId, applicationId, rating, comment }) =>
  axiosInstance.post('/reviews', { contractId, applicationId, rating, comment });

export const getReviewsForUserApi = (userId) =>
  axiosInstance.get(`/reviews/user/${userId}`);
