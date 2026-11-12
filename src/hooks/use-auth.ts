import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMe,
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
    onSuccess: () => {
      onSuccess?.();
    },
  });
}

export function useLogin({ onSuccess }: MutationOptions = {}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      // data is a value return from mutationFn
      // add accessToken to local storage
      setAccessToken(data.accessToken);
      onSuccess?.();
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear();
  };
}

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
    enabled: accessToken !== null,
  });
}
