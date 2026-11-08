import { useQuery } from '@tanstack/react-query';

import { getTodo, getTodos, type GetTodosParams } from '../api/todos';

export function useTodos(params: GetTodosParams) {
  return useQuery({
    queryKey: ['todos', params],
    queryFn: () => getTodos(params),
  });
}

export function useTodo(id: number) {
  return useQuery({
    queryKey: ['todos', id],
    queryFn: () => getTodo(id),
    gcTime: 0,
  });
}
