// หน้าเข้าสู่ระบบ: ฟอร์ม email และ password
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { z } from 'zod';

import { getApiErrorCode } from '../api/errors';
import { useLogin } from '../hooks/use-auth';

const loginSchema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ไม่ต้อง navigate เอง พอได้ token แล้ว GuestRoute จะพาไปหน้าที่ถูกต้องให้
  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const errorMessage =
    getApiErrorCode(loginMutation.error) === 'INVALID_CREDENTIALS'
      ? 'Invalid email or password.'
      : 'Could not log in.';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {loginMutation.isError && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded bg-violet-600 px-3 py-2 text-white disabled:opacity-50"
        >
          Log in
        </button>
      </form>

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-violet-700">
          Register
        </Link>
      </p>
    </div>
  );
}
