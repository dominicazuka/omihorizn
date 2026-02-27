import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'https://api.omihorizn.com';

const Axios = axios.create({ baseURL: `${SERVER_URL}/api`, withCredentials: true });

Axios.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  if (API_KEY) config.headers['x-api-key'] = API_KEY;

  const userData = await AsyncStorage.getItem('@omihorizn_user');
  const token = userData ? JSON.parse(userData).accessToken : null;
  if (token) config.headers['authorization'] = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    // Let browser/native set content-type boundary
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }

  return config;
}, (err) => Promise.reject(err));

Axios.interceptors.response.use(res => res, async (err) => {
  const original = err.config;
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true;
    // call refresh endpoint (example)
    const stored = await AsyncStorage.getItem('@omihorizn_user');
    const refreshToken = stored ? JSON.parse(stored).refreshToken : null;
    if (!refreshToken) return Promise.reject(err);
    try {
      const r = await axios.post(`${SERVER_URL}/api/auth/refresh-token`, { refreshToken }, { headers: { 'x-api-key': API_KEY }});
      const newAccess = r.data.accessToken;
      const newRefresh = r.data.refreshToken;
      const user = stored ? JSON.parse(stored) : {};
      await AsyncStorage.setItem('@omihorizn_user', JSON.stringify({ ...user, accessToken: newAccess, refreshToken: newRefresh }));
      original.headers['authorization'] = `Bearer ${newAccess}`;
      return axios(original);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  return Promise.reject(err);
});

export default Axios;