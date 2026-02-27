import axios from 'axios';

// Determine if the current hostname indicates a local development environment
export const isLocalHost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// Set the server URL based on whether the environment is local or production
export const SERVER_URL = isLocalHost
  ? 'http://localhost:5000'
  : 'https://api.omihorizn.com';

// Set the app URL based on whether the environment is local or production
export const APP_URL = isLocalHost ? 'http://localhost:3000/' : 'https://omihorizn.com';

// Create an Axios instance with a base URL and default headers
const Axios = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the access token from localStorage
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    // if sending FormData, let browser set the boundary
    if (config.data && config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 refresh logic (simpler than mobile version)
Axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      // attempt refresh with refresh token stored in localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return Promise.reject(err);
      try {
        const r = await Axios.post('/auth/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefresh } = r.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        originalConfig.headers['authorization'] = `Bearer ${accessToken}`;
        return Axios(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(err);
  }
);

export default Axios;
