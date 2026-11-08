// หน้าแก้ไข task: โหลด task ตาม id ใน URL แล้วแสดง EditTodoForm
import { Link, useParams } from 'react-router';

import { getApiErrorCode } from '../api/errors';
import EditTodoForm from '../components/EditTodoForm';
import { useTodo } from '../hooks/use-todos';

export default function EditTodoPage() {
  // route นี้คือ /todos/:id จึงมี id เสมอ ค่าจาก URL เป็น string เช่น /todos/14 → { id: '14' }
  // แปลงเป็น number ก่อนใช้ ถ้าไม่ใช่ตัวเลข (เช่น /todos/abcd) จะได้ NaN
  const { id } = useParams() as { id: string };

  const { data: todo, error, isPending, isError } = useTodo(Number(id));

  // id ไม่ใช่ตัวเลข (400 VALIDATION_ERROR) หรือไม่พบ/เป็นของคนอื่น (404 TODO_NOT_FOUND)
  const errorCode = getApiErrorCode(error);
  const isNotFound =
    errorCode === 'TODO_NOT_FOUND' || errorCode === 'VALIDATION_ERROR';

  let content;
  if (isPending) {
    content = <p>Loading...</p>;
  } else if (isNotFound) {
    content = <p>Task not found.</p>;
  } else if (isError) {
    content = <p>Could not load task.</p>;
  } else {
    content = <EditTodoForm todo={todo} />;
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-4">
      <Link to="/todos" className="text-violet-700">
        ← Back
      </Link>
      <h1 className="text-2xl font-semibold">Edit task</h1>
      {content}
    </main>
  );
}
