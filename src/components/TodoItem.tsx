// หนึ่งแถวในรายการ: checkbox สลับสถานะ, ชื่อ task ที่กดแล้วไปหน้าแก้ไข และปุ่มลบ
import { Link } from 'react-router';

import type { Todo } from '../api/types';
import { useDeleteTodo, useUpdateTodo } from '../hooks/use-todo-mutations';

type TodoItemProps = {
  todo: Todo;
};

export default function TodoItem({ todo }: TodoItemProps) {
  const deleteMutation = useDeleteTodo();
  const updateMutation = useUpdateTodo();

  return (
    <li className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={todo.completed}
        disabled={updateMutation.isPending}
        onChange={() =>
          updateMutation.mutate({
            id: todo.id,
            input: { completed: !todo.completed },
          })
        }
      />
      <Link to={`/todos/${todo.id}`} className="flex-1">
        {todo.title}
      </Link>
      <button
        type="button"
        className="text-red-600 disabled:opacity-50"
        disabled={deleteMutation.isPending}
        onClick={() => deleteMutation.mutate(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}
