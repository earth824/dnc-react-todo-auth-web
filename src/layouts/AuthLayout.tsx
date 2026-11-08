// layout ของหน้า login และ register: โลโก้ด้านบน และการ์ดตรงกลางจอที่แสดงหน้าของ route ลูก
import { Outlet } from 'react-router';

import logo from '../assets/devnest-icon-light.png';

export default function AuthLayout() {
  return (
    <main className="mx-auto max-w-sm space-y-6 px-4 py-16">
      <img
        src={logo}
        alt="DevNest Todo"
        width={62}
        height={42}
        className="mx-auto"
      />
      <div className="rounded border border-gray-300 p-6">
        <Outlet />
      </div>
    </main>
  );
}
