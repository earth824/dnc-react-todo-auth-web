// layout ของหน้า todos ทั้งหมด: header ด้านบน แล้วตามด้วยหน้าของ route ลูก
import { Outlet } from 'react-router';

import AppHeader from '../components/AppHeader';

export default function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
