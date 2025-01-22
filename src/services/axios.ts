import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosError,AxiosResponse } from 'axios';
import AuthService from './AuthService';
import { router } from '@/router';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers!['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
        const originalRequest = error.config;
        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                localStorage.removeItem("access_token");
                router.push({name:'/auth/login'});
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                localStorage.clear();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;