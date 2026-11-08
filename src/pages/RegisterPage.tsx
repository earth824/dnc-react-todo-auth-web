// หน้าสมัครสมาชิก: ฟอร์ม email, password และ confirm password
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { getApiErrorCode } from '../api/errors';
import { useRegister } from '../hooks/use-auth';

// confirmPassword ตรวจที่ frontend เท่านั้น ตอนส่ง API ให้ส่งแค่ { email, password }
const registerSchema = z
  .object({
    email: z.email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const registerMutation = useRegister({
    onSuccess: () => navigate('/login'),
  });

  const onSubmit = ({ email, password }: RegisterFormValues) => {
    registerMutation.mutate({ email, password });
  };

  const errorMessage =
    getApiErrorCode(registerMutation.error) === 'EMAIL_ALREADY_EXISTS'
      ? 'Email is already registered.'
      : 'Could not create account.';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create account</h1>

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
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block">
            Confirm password
          </label>
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {registerMutation.isError && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded bg-violet-600 px-3 py-2 text-white disabled:opacity-50"
        >
          Create account
        </button>
      </form>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-violet-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
