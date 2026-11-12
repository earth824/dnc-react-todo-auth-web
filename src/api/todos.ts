// ฟังก์ชันเรียก API ของ todos ทุกตัว คืนค่าเป็น res.data
import { apiClient } from './client';
import type { Todo } from './types';

export type GetTodosParams = {
  completed?: boolean;
};

export type CreateTodoInput = {
  title: string;
  completed?: boolean;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
};

// GET /todos?completed=true|false
// ถ้า completed เป็น undefined axios จะไม่ใส่ใน query string (ได้ทั้งหมด)
export async function getTodos(params: GetTodosParams): Promise<Todo[]> {
  const res = await apiClient.get<{ todos: Todo[] }>('/todos', { params });
  return res.data.todos;
}

export async function getTodo(id: number): Promise<Todo> {
  const res = await apiClient.get<{ todo: Todo }>(`/todos/${id}`);
  return res.data.todo;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await apiClient.post<{ todo: Todo }>('/todos', input);
  return res.data.todo;
}

export async function updateTodo(
  id: number,
  input: UpdateTodoInput,
): Promise<Todo> {
  const res = await apiClient.put<{ todo: Todo }>(`/todos/${id}`, input);
  return res.data.todo;
}

// ตอบกลับ 204 ไม่มี body
export async function deleteTodo(id: number): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}
