import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createTodo,
  deleteTodo,
  updateTodo,
  type CreateTodoInput,
  type UpdateTodoInput,
} from '../api/todos';

type MutationOptions = {
  onSuccess?: () => void;
};

export function useCreateTodo({ onSuccess }: MutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
      onSuccess?.();
    },
  });
}

export function useUpdateTodo({ onSuccess }: MutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoInput }) =>
      updateTodo(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
      onSuccess?.();
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}
