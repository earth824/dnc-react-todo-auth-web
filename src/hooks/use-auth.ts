import { useMutation } from '@tanstack/react-query';

import {
  login,
  register,
  type LoginInput,
  type RegisterInput,
} from '../api/auth';
import { useAuthStore } from '../stores/auth-store';

type MutationOptions = {
  onSuccess?: () => void;
};

export function useRegister({ onSuccess }: MutationOptions = {}) {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => onSuccess?.(),
  });
}

export function useLogin({ onSuccess }: MutationOptions = {}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      onSuccess?.();
    },
  });
}
