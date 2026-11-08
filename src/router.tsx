import { createBrowserRouter, Navigate } from 'react-router';

import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import EditTodoPage from './pages/EditTodoPage';
import LoginPage from './pages/LoginPage';
import NewTodoPage from './pages/NewTodoPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';

// layout route: route ที่มี element แต่ไม่มี path
// route ลูกใน children จะแสดงตรง <Outlet /> ของ layout นั้น
export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/todos', element: <TodoListPage /> },
          { path: '/todos/new', element: <NewTodoPage /> },
          { path: '/todos/:id', element: <EditTodoPage /> },
        ],
      },
    ],
  },
  // path อื่นทั้งหมด (รวมถึง /) กลับไปหน้ารายการ
  { path: '*', element: <Navigate to="/todos" replace /> },
]);
