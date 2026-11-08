// route สำหรับคนที่ยังไม่ล็อกอิน: มี token แล้วให้กลับไปหน้าเดิม (from) หรือหน้ารายการ
import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '../stores/auth-store';

type LocationState = {
  from?: string;
} | null;

export default function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (accessToken) {
    const from = (location.state as LocationState)?.from;
    return <Navigate to={from ?? '/todos'} replace />;
  }

  return <Outlet />;
}
