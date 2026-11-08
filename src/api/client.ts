import axios from 'axios';

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

// response interceptor: ถ้าได้ 401 ระหว่างที่ยังถือ token อยู่ (token หมดอายุหรือไม่ถูกต้อง)
// ให้ clearAuth() และ queryClient.clear() แล้วส่ง error ต่อ (Promise.reject)
