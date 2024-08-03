import axios, { AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor for adding JWT token to request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error as AxiosError),
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const originalRequest = response.config;

    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup')
    ) {
      return Promise.reject(error as AxiosError);
    }

    // Check if the error is a 401 and if it's not a retry request
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retrying

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return Promise.reject(error as AxiosError);
      }

      try {
        // Attempt to refresh the token
        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        // Update tokens in local storage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken || refreshToken);

        // Set the new token on the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        // Handle refresh token failure, e.g., redirect to login
        // Clear local storage if needed
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError as AxiosError); // Ensure rejection is handled
      }
    }

    return Promise.reject(error as AxiosError); // Ensure rejection is handled
  },
);

export default axiosInstance;
