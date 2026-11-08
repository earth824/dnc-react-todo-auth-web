// type ของข้อมูลที่ได้จาก API (ดูตาราง API contract ใน README)

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type User = {
  id: number;
  email: string;
};

// รูปแบบ error ที่ backend ส่งกลับมาทุก endpoint เช่น
// { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password" }
export type ApiErrorResponse = {
  code: string;
  message: string;
};
