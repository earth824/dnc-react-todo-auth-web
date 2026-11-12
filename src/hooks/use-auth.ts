import { useMutation } from '@tanstack/react-query';
import { register, type RegisterInput } from '../api/auth';

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  });
}
