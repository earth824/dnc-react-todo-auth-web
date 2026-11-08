// ฟังก์ชันเรียก API ของ auth ทุกตัว คืนค่าเป็น res.data
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

export async function register(input: RegisterInput): Promise<User> {
  const res = await apiClient.post<User>('/auth/register', input);
  return res.data;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/auth/login', input);
  return res.data;
}
