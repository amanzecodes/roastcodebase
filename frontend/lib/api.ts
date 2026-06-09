import axios from 'axios';
import { ApiError } from './errors';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    const data = err?.response?.data;
    throw new ApiError(
      err?.response?.status ?? 500,
      data?.code ?? 'INTERNAL_ERROR',
      data?.error ?? 'An unexpected error occurred',
    );
  },
);

export default api;
