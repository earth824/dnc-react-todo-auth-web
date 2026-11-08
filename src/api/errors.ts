import { isAxiosError } from 'axios';

import type { ApiErrorResponse } from './types';

// ดึง code ออกจาก error ของ axios เช่น 'EMAIL_ALREADY_EXISTS'
// ถ้าไม่มี response (เช่น server ปิดอยู่ หรือโดน CORS block) จะได้ undefined
export function getApiErrorCode(error: unknown): string | undefined {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.code;
  }
  return undefined;
}
