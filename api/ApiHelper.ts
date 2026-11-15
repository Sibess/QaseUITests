export const API_URL = process.env.QASE_API_URL!;

export const getHeaders = () => {
  return {
    accept: 'application/json',
    'content-type': 'application/json',
    Token: process.env.QASE_API_TOKEN!,
  };
};