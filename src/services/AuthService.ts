
import axiosInstance from './axios';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}

const login = async (authData: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/login', authData);
    return response.data;
};

const register = async (authData: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/register', authData);
    return response.data;
};

const refresh = async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/refresh', {});
    return response.data;
}

export default {
    login,
    register,
    refresh
};