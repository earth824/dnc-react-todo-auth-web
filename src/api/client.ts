import axios, { isAxiosError } from 'axios';

import { queryClient } from '../lib/query-client';
import { useAuthStore } from '../stores/auth-store';

// ทุก request ไปที่ VITE_API_URL (ตั้งค่าในไฟล์ .env) โดยตรง ไม่ผ่าน proxy
// เพราะ origin ของเว็บ (localhost:5173) กับ API (localhost:8000) ต่างกัน browser จึงเช็ค CORS
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// request interceptor: แนบ token ไปกับทุก request
// ไฟล์นี้ไม่ใช่ component จึงใช้ hook ไม่ได้ ต้องอ่านผ่าน getState()
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// response interceptor: ได้ 401 ระหว่างที่ยังถือ token อยู่ แปลว่า token หมดอายุหรือไม่ถูกต้อง
// จึงล้าง token และ cache ให้ ProtectedRoute พาไปหน้า login
// ถ้าไม่มี token (เช่น login ผิด) ไม่ต้องทำอะไร ให้หน้านั้นแสดง error เอง
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { accessToken, clearAuth } = useAuthStore.getState();
    if (isAxiosError(error) && error.response?.status === 401 && accessToken) {
      clearAuth();
      queryClient.clear();
    }
    return Promise.reject(error);
  },
);
