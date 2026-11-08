// ฟังก์ชันเรียก API ของ auth: นักเรียนเขียนเองในไฟล์นี้ ตามแบบ api/todos.ts
//
// register(input: RegisterInput): Promise<User>       POST /auth/register
// login(input: LoginInput): Promise<LoginResponse>    POST /auth/login
// getMe(): Promise<User>                              GET  /auth/me

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
