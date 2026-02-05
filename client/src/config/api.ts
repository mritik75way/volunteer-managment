import axios from "axios";
import { message } from "antd";
import { store } from "../store/store";
import { setCredentials, logout } from "../features/auth/auth.slice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (response.config.method !== 'get' && response.data?.message) {
      message.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error);
    }

    if (originalRequest._retry) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`);
        const newAccessToken = refreshResponse.data.accessToken;

        store.dispatch(setCredentials({ 
            accessToken: newAccessToken, 
            user: store.getState().auth.user! 
        }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        store.dispatch(logout());
        if (store.getState().auth.accessToken) {
            message.error('Session expired. Please login again.');
        }
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || 'Something went wrong';
    message.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;
