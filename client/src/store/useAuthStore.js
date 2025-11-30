import { create } from 'zustand';
import api from '../services/api';

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        return null;
    }
};

const useAuthStore = create((set) => ({
    user: getUserFromStorage(),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            set({
                user: data,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
            return data; // Return data for redirect logic
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Login failed',
            });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/register', userData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            set({
                user: data,
                token: data.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed',
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
