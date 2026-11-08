import { useMutation } from '@tanstack/react-query';

import { register, type RegisterInput } from '../api/auth';

type MutationOptions = {
  onSuccess?: () => void;
};

export function useRegister({ onSuccess }: MutationOptions = {}) {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => onSuccess?.(),
  });
}
