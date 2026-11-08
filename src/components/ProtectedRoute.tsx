// route ที่ต้องล็อกอินก่อน: ไม่มี token ให้ไปหน้า login
// ส่ง from (path เดิม) ไปด้วย ให้ GuestRoute พากลับมาหลังล็อกอิน
import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '../stores/auth-store';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
