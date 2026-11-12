import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../stores/auth-store';

export default function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/todos" replace />;
  }

  return <Outlet />;
}
