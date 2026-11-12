import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../stores/auth-store';

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
