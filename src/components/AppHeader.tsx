// header ด้านบนของหน้า todos: โลโก้ที่กดแล้วกลับไปหน้ารายการ, email ของผู้ใช้ และปุ่ม Log out
import { Link } from 'react-router';

import logo from '../assets/devnest-icon-light.png';
import { useLogout, useMe } from '../hooks/use-auth';

export default function AppHeader() {
  const { data: me } = useMe();
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <Link to="/todos">
        <img src={logo} alt="DevNest Todo" width={41} height={28} />
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">{me?.email}</span>
        <button type="button" onClick={logout} className="text-violet-700">
          Log out
        </button>
      </div>
    </header>
  );
}
