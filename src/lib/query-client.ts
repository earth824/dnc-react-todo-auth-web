import { QueryClient } from '@tanstack/react-query';

// สร้าง queryClient ไว้ในไฟล์แยกแล้ว export ออกไป
// เพื่อให้โค้ดที่อยู่นอก React เรียก queryClient.clear() ได้
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ปิด retry: request ที่ fail จะแสดง error ทันที ไม่ยิงซ้ำ
      retry: false,
    },
  },
});
