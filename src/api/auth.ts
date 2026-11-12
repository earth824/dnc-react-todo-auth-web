// ฟังก์ชันเรียก API ของ auth: นักเรียนเขียนเองในไฟล์นี้ ตามแบบ api/todos.ts
//
// register(input: RegisterInput): Promise<User>       POST /auth/register
// login(input: LoginInput): Promise<LoginResponse>    POST /auth/login
// getMe(): Promise<User>                              GET  /auth/me

import { apiClient } from './client';
import type { User } from './types';

export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export async function register(input: RegisterInput): Promise<void> {
  await apiClient.post('/auth/register', input);
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/auth/login', input);
  return res.data;
} // { accessToken: string }

export async function getMe(): Promise<User> {
  const res = await apiClient.get<{ user: User }>('/auth/me');
  return res.data.user;
}
