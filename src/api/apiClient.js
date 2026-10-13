import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Response interceptor to unwrap the standard envelope format:
 *   Success: { success: true, data: ... }
 *   Failure: { success: false, error: { code, message, details } }
 */
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && body.success === true) {
      return { ...response, data: body.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.data && error.response.data.success === false) {
      const apiError = error.response.data.error;
      const enrichedError = new Error(apiError.message || 'An error occurred');
      enrichedError.code = apiError.code;
      enrichedError.details = apiError.details || [];
      enrichedError.status = error.response.status;
      return Promise.reject(enrichedError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
