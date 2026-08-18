import axiosInstance from '@/services/axiosInstance';

// ───────────────── SUBMIT KYC (multipart) ─────────────────
// `fields` is a plain object of text fields; `files` is { profilePhoto, documentFront, documentBack }
// export const submitKycApi = (fields, files) => {
//   const formData = new FormData();
//   Object.entries(fields).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== '') {
//       formData.append(key, value);
//     }
//   });
//   Object.entries(files).forEach(([key, file]) => {
//     if (file) formData.append(key, file);
//   });

//   return axiosInstance.post('/kyc/submit', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
// };

export const submitKycApi = (fields) => {
  return axiosInstance.post('/kyc/submit', fields);
};

// ───────────────── STATUS ─────────────────
export const getMyKycStatusApi = () => axiosInstance.get('/kyc/my-status');

// ───────────────── SKILL CERTIFICATES (optional) ─────────────────
export const uploadCertificateApi = (certificateName, file) => {
  const formData = new FormData();
  formData.append('certificateName', certificateName);
  formData.append('file', file);
  return axiosInstance.post('/kyc/certificates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyCertificatesApi = () => axiosInstance.get('/kyc/certificates');
