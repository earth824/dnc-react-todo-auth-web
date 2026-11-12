// หน้าเข้าสู่ระบบ: ฟอร์ม email และ password
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useLogin } from '../hooks/use-auth';
import { getApiErrorCode } from '../api/errors';

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

  const navigate = useNavigate();

  const loginMutation = useLogin({
    onSuccess: () => navigate('/todos'),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const errorMessage =
    getApiErrorCode(loginMutation.error) === 'INVALID_CREDENTIALS'
      ? 'Invalid email or password'
      : 'Could not login';

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
