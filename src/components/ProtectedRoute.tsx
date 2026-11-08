// route ที่ต้องล็อกอินก่อน: ไม่มี token ให้ไปหน้า login
import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '../stores/auth-store';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
