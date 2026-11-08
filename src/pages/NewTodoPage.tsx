// หน้าสร้าง task: ฟอร์มที่มีช่อง Title และ checkbox Completed
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import { useCreateTodo } from '../hooks/use-todo-mutations';

const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  completed: z.boolean(),
});

type CreateTodoFormValues = z.infer<typeof createTodoSchema>;

export default function NewTodoPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      completed: false,
    },
  });

  const navigate = useNavigate();

  const createMutation = useCreateTodo({
    onSuccess: () => navigate('/todos'),
  });

  const onSubmit = (data: CreateTodoFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <main className="mx-auto max-w-xl space-y-4 p-4">
      <Link to="/todos" className="text-violet-700">
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">New task</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title" className="block">
            Title
          </label>
          <input
            {...register('title')}
            id="title"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('completed')} />
          Completed
        </label>

        {createMutation.isError && (
          <p className="text-sm text-red-600">Could not create task.</p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded bg-violet-600 px-3 py-1.5 text-white disabled:opacity-50"
          >
            Create
          </button>
          <Link to="/todos">Cancel</Link>
        </div>
      </form>
    </main>
  );
}
