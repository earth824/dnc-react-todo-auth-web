import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
};

// เก็บ accessToken ไว้ใน store และใช้ persist บันทึกลง localStorage (key: "dnc-todo-auth")
// ทำให้ refresh หน้าเว็บแล้วยังล็อกอินอยู่
//
// ใช้ใน component:   const accessToken = useAuthStore((state) => state.accessToken);
// ใช้นอก component: useAuthStore.getState().accessToken
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ accessToken: null }),
    }),
    { name: 'dnc-todo-auth' },
  ),
);
