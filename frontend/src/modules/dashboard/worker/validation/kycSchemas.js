import * as yup from 'yup';

// Mirrors the backend's DocumentValidator rules exactly.
export const kycSubmitSchema = yup.object({
  documentType: yup
    .string()
    .oneOf(['AADHAR', 'PAN'], 'Please choose a document type')
    .required('Please choose a document type'),
  documentNumber: yup
    .string()
    .trim()
    .required('Document number is required')
    .when('documentType', {
      is: 'AADHAR',
      then: (schema) =>
        schema.matches(/^[0-9]{12}$/, 'Aadhar number must be exactly 12 digits'),
      otherwise: (schema) =>
        schema.matches(
          /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
          'PAN must be in the format ABCDE1234F'
        ),
    }),
});

export const validateWithYup = async (schema, values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (err) {
    const errors = {};
    if (err.inner && err.inner.length) {
      err.inner.forEach((e) => {
        if (e.path && !errors[e.path]) errors[e.path] = e.message;
      });
    } else if (err.path) {
      errors[err.path] = err.message;
    }
    return { valid: false, errors };
  }
};
