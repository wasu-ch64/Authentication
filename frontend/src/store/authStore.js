import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL + "/api";

export const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,

    register: async (email, password, role) => {
        try {
            const res = await axios.post(`${API_URL}/register`, { email, password, role }, { withCredentials: true });

            set({ isAuthenticated: false, user: res.data })
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message:
                    err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
            }
        }
    },

    login: async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
            const decoded = jwtDecode(res.data.token);
            set({ isAuthenticated: true, user: res.data.user, role: decoded.role });
            return { success: true, user: res.data.user, role: decoded.role };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            };
        }
    },

    logout: async () => {
        await axios.get(`${API_URL}/logout`, { withCredentials: true });
        set({ isAuthenticated: false, user: null, role: null });
    },

    checkAuth: async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/authentication`, { withCredentials: true });
            set({ isAuthenticated: true, user: res.data.user, role: res.data.user.role });
            return true;
        } catch (err) {
            set({ isAuthenticated: false, user: null, role: null });
            return err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        }
    },
}));