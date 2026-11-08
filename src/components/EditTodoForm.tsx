// ฟอร์มแก้ไข task: ช่อง Title และ checkbox Completed
// แยกเป็น component เพื่อให้ defaultValues ได้ค่าจาก todo ที่โหลดเสร็จแล้ว
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';

import type { Todo } from '../api/types';
import { useUpdateTodo } from '../hooks/use-todo-mutations';

const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  completed: z.boolean(),
});

type UpdateTodoFormValues = z.infer<typeof updateTodoSchema>;

type EditTodoFormProps = {
  todo: Todo;
};

export default function EditTodoForm({ todo }: EditTodoFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UpdateTodoFormValues>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: todo.title,
      completed: todo.completed,
    },
  });

  const navigate = useNavigate();

  const updateMutation = useUpdateTodo({
    onSuccess: () => navigate('/todos'),
  });

  const onSubmit = (data: UpdateTodoFormValues) => {
    updateMutation.mutate({ id: todo.id, input: data });
  };

  return (
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

      {updateMutation.isError && (
        <p className="text-sm text-red-600">Could not save task.</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="rounded bg-violet-600 px-3 py-1.5 text-white disabled:opacity-50"
        >
          Save
        </button>
        <Link to="/todos">Cancel</Link>
      </div>
    </form>
  );
}
