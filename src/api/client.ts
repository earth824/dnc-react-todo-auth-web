import axios from 'axios';

// ทุก request ไปที่ VITE_API_URL (ตั้งค่าในไฟล์ .env) โดยตรง ไม่ผ่าน proxy
// เพราะ origin ของเว็บ (localhost:5173) กับ API (localhost:8000) ต่างกัน browser จึงเช็ค CORS
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// request interceptor: อ่าน accessToken จาก useAuthStore.getState()
// ถ้ามี token ให้แนบ header Authorization: `Bearer ${accessToken}` ไปกับทุก request

// response interceptor: ถ้าได้ 401 ระหว่างที่ยังถือ token อยู่ (token หมดอายุหรือไม่ถูกต้อง)
// ให้ clearAuth() และ queryClient.clear() แล้วส่ง error ต่อ (Promise.reject)
