import { useState, useCallback } from 'react';

/**
 * Generic hook for API calls with loading / success / error state management.
 *
 * @param {Function} apiFn  – the async API function to call
 * @returns {{ execute, data, loading, error, reset }}
 */
export function useApiCall(apiFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await apiFn(...args);
        setData(result);
        setSuccess(true);
        return result;
      } catch (err) {
        const apiError = {
          message: err.message || 'An unexpected error occurred',
          code: err.code || 'UNKNOWN_ERROR',
          details: err.details || [],
          status: err.status || null,
        };
        setError(apiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { execute, data, loading, error, success, reset };
}
