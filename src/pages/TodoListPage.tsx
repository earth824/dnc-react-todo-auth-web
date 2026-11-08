// หน้ารายการ task: หัวข้อ, ปุ่มสร้าง, ตัวกรองสถานะ และรายการ
import { Link, useSearchParams } from 'react-router';

import TodoItem from '../components/TodoItem';
import { useTodos } from '../hooks/use-todos';

// แปลงค่า ?status= ใน URL เป็นค่า completed ที่ส่งให้ API
const completedByStatus = {
  all: undefined,
  pending: false,
  completed: true,
};

export default function TodoListPage() {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const status =
    statusParam === 'pending' || statusParam === 'completed'
      ? statusParam
      : 'all';

  const {
    data: todos,
    isPending,
    isError,
  } = useTodos({ completed: completedByStatus[status] });

  let content;
  if (isPending) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>Could not load tasks.</p>;
  } else if (todos.length === 0) {
    content = <p>No tasks.</p>;
  } else {
    content = (
      <ul className="divide-y divide-gray-200">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <Link
          to="/todos/new"
          className="rounded bg-violet-600 px-3 py-1.5 text-white"
        >
          New task
        </Link>
      </div>

      <nav className="flex gap-4 text-violet-700">
        <Link to="/todos">All</Link>
        <Link to="/todos?status=pending">Pending</Link>
        <Link to="/todos?status=completed">Completed</Link>
      </nav>

      {content}
    </main>
  );
}
