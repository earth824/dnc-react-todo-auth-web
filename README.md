# DevNest Todo

แอป Todo ที่มีระบบสมาชิก ใช้เรียนรู้การเชื่อม frontend (React) เข้ากับ backend (Express) โดยเน้น 2 เรื่องคือ **CORS** และ **protected routes**

template นี้ทำส่วนจัดการ task (สร้าง แก้ไข ลบ กรอง) ไว้ให้ครบแล้ว สิ่งที่เราจะทำคือต่อระบบสมาชิกเข้ากับ backend ที่เขียนในคลาส ตั้งแต่สมัครสมาชิก เข้าสู่ระบบ ไปจนถึงกันไม่ให้คนที่ยังไม่ล็อกอินเข้าหน้า task ได้

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี

- Node.js 24 ขึ้นไป
- pnpm
- backend ที่เขียนในคลาส รันอยู่ที่ `http://localhost:8000`

### ติดตั้งและรัน

1. ติดตั้ง package

   ```bash
   pnpm install
   ```

2. **คัดลอกไฟล์ `.env.example` เป็น `.env`** (ห้ามข้ามขั้นนี้ ถ้าไม่มี `.env` แอปจะเรียก API ไม่ถูกที่ ดู[ปัญหาที่พบบ่อย](#ปัญหาที่พบบ่อย))

   ```bash
   cp .env.example .env
   ```

   ในไฟล์มีค่าเดียวคือ `VITE_API_URL=http://localhost:8000` ซึ่งเป็นที่อยู่ของ backend

3. รัน dev server แล้วเปิด `http://localhost:5173`

   ```bash
   pnpm dev
   ```

ถ้าแก้ไฟล์ `.env` ต้องหยุด `pnpm dev` แล้วรันใหม่ เพราะ Vite อ่าน `.env` แค่ตอนเริ่มทำงาน

### คำสั่งอื่นที่ใช้บ่อย

| คำสั่ง        | ใช้ทำอะไร                             |
| ------------- | ------------------------------------- |
| `pnpm build`  | ตรวจ type และ build สำหรับ production |
| `pnpm lint`   | ตรวจโค้ดด้วย oxlint                   |
| `pnpm format` | จัดรูปแบบโค้ดใน `src` ด้วย Prettier   |

## ใน template มีอะไรบ้าง

### เขียนไว้ให้แล้ว

| ไฟล์                                                                | หน้าที่                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/App.tsx`                                                       | ครอบแอปด้วย `QueryClientProvider` และ `RouterProvider`                                       |
| `src/router.tsx`                                                    | กำหนด route ทั้งหมด แบ่งเป็น 2 กลุ่มด้วย layout route                                        |
| `src/lib/query-client.ts`                                           | สร้าง `queryClient` แล้ว export ไว้ให้โค้ดนอก React ใช้ได้                                   |
| `src/stores/auth-store.ts`                                          | เก็บ `accessToken` ด้วย Zustand และบันทึกลง localStorage มี `setAccessToken` และ `clearAuth` |
| `src/api/client.ts`                                                 | axios ที่ตั้ง `baseURL` เป็น `VITE_API_URL` แล้ว                                             |
| `src/api/types.ts`                                                  | type `Todo`, `User`, `ApiErrorResponse`                                                      |
| `src/api/errors.ts`                                                 | `getApiErrorCode(error)` ดึง `code` ออกจาก error ของ axios                                   |
| `src/api/todos.ts`                                                  | ฟังก์ชันเรียก API ของ todos ทั้งหมด                                                          |
| `src/hooks/use-todos.ts`, `use-todo-mutations.ts`                   | hook ของ React Query สำหรับ todos                                                            |
| `src/layouts/AuthLayout.tsx`                                        | layout ของหน้า login/register (การ์ดกลางจอ)                                                  |
| `src/layouts/AppLayout.tsx`                                         | layout ของหน้า todos (มี header)                                                             |
| `src/components/AppHeader.tsx`                                      | โลโก้, email (ตอนนี้เป็นข้อความตัวอย่าง) และปุ่ม Log out (ตอนนี้ยังกดแล้วไม่มีอะไรเกิดขึ้น)  |
| `src/pages/TodoListPage.tsx`, `NewTodoPage.tsx`, `EditTodoPage.tsx` | หน้าจัดการ task                                                                              |
| `src/pages/LoginPage.tsx`, `RegisterPage.tsx`                       | ฟอร์มที่ตรวจข้อมูลด้วย zod แล้ว แต่ตอนกด submit ยังแค่ `console.log`                         |

### ส่วนที่เราจะเขียนเอง

| ไฟล์                                | สิ่งที่ต้องเขียน                                        |
| ----------------------------------- | ------------------------------------------------------- |
| `src/api/auth.ts`                   | ฟังก์ชัน `register`, `login`, `getMe` (มี type ให้แล้ว) |
| `src/hooks/use-auth.ts`             | hook `useRegister`, `useLogin`, `useMe`, `useLogout`    |
| `src/api/client.ts`                 | request interceptor และ response interceptor            |
| `src/components/ProtectedRoute.tsx` | route ที่ต้องล็อกอินก่อนถึงเข้าได้                      |
| `src/components/GuestRoute.tsx`     | route สำหรับคนที่ยังไม่ได้ล็อกอิน                       |

## API contract

ข้อตกลงระหว่าง frontend กับ backend ทั้งสองฝั่งต้องทำตามตารางนี้

| Method | Path                           | ต้องล็อกอิน | Body                     | สำเร็จ                        | Error                                                                |
| ------ | ------------------------------ | :---------: | ------------------------ | ----------------------------- | -------------------------------------------------------------------- |
| POST   | `/auth/register`               |      –      | `{ email, password }`    | 201 `{ id, email, role }`     | 400 `VALIDATION_ERROR`, 409 `EMAIL_ALREADY_EXISTS`                   |
| POST   | `/auth/login`                  |      –      | `{ email, password }`    | 200 `{ accessToken }`         | 400 `VALIDATION_ERROR`, 401 `INVALID_CREDENTIALS`                    |
| GET    | `/auth/me`                     |      ✔      | –                        | 200 `{ id, email, role }`     | 401                                                                  |
| GET    | `/todos?completed=true\|false` |      ✔      | –                        | 200 `Todo[]` (เฉพาะของตัวเอง) | 401                                                                  |
| GET    | `/todos/:id`                   |      ✔      | –                        | 200 `Todo`                    | 400 `VALIDATION_ERROR`, 404 `TODO_NOT_FOUND` (รวมถึง task ของคนอื่น) |
| POST   | `/todos`                       |      ✔      | `{ title, completed? }`  | 201 `Todo`                    | 400 `VALIDATION_ERROR`                                               |
| PATCH  | `/todos/:id`                   |      ✔      | `{ title?, completed? }` | 200 `Todo`                    | 400 `VALIDATION_ERROR`, 404 `TODO_NOT_FOUND`                         |
| DELETE | `/todos/:id`                   |      ✔      | –                        | 204 (ไม่มี body)              | 404 `TODO_NOT_FOUND`                                                 |

- `Todo` คือ `{ id, userId, title, completed }`
- error ทุกตัวตอบกลับเป็น `{ code, message }`
- endpoint ที่ต้องล็อกอิน ต้องส่ง header `Authorization: Bearer <accessToken>` ถ้าไม่มี token, token ไม่ถูกต้อง หรือหมดอายุ จะได้ 401 `UNAUTHORIZED`
- password ตอนสมัครสมาชิกต้องยาวอย่างน้อย 6 ตัวอักษร
- `GET /todos/:id` ต้องตอบ 400 `VALIDATION_ERROR` เมื่อ id ไม่ใช่ตัวเลข (เช่น `/todos/abcd`) หน้าแก้ไขจะแสดง "Task not found."
- ชื่อ field ใน JSON ต้องเป็น camelCase เช่น `userId` ไม่ใช่ `user_id` เพราะ type ใน TypeScript ไม่ได้ตรวจข้อมูลจริงตอนแอปรัน ถ้าชื่อไม่ตรง ค่าจะเป็น `undefined` โดยไม่มี error

## บทเรียน

ทำตามลำดับ เพราะแต่ละหัวข้อต่อยอดจากหัวข้อก่อนหน้า

### เจอ CORS ครั้งแรก

**เป้าหมาย:** เข้าใจว่าทำไม browser ไม่ยอมให้เว็บเรียก API ที่อยู่คนละ origin

1. เปิด backend และรัน `pnpm dev` แล้วเข้า `/todos`
2. หน้าเว็บแสดง **"Could not load tasks."**
3. เปิด DevTools แท็บ Console จะเห็น error ที่มีคำว่า CORS ลองดูว่า origin ของเว็บกับของ API ต่างกันตรงไหน
4. ที่ backend ติดตั้ง middleware `cors` และอนุญาตเฉพาะ origin `http://localhost:5173`
5. refresh หน้าเว็บ CORS error หายไป แต่ยังแสดง **"Could not load tasks."** อยู่ ในแท็บ Network จะเห็นว่าคราวนี้ได้ **401** เพราะเรายังไม่ได้ล็อกอิน

### สมัครสมาชิก

**เป้าหมาย:** ส่งข้อมูลจากฟอร์มไปที่ API และแสดง error ที่ backend ตอบกลับมา

1. ใน `src/api/auth.ts` เขียนฟังก์ชัน `register` ที่เรียก `POST /auth/register`
2. สร้าง `src/hooks/use-auth.ts` แล้วเขียน `useRegister` ด้วย `useMutation`
3. ใน `RegisterPage` เรียก mutation ตอน submit โดยส่งไปแค่ `email` กับ `password` (`confirmPassword` ใช้ตรวจที่ frontend เท่านั้น)
4. แสดงข้อความ error ใต้ฟอร์มโดยดูจาก `code` (ใช้ `getApiErrorCode`)
   - `EMAIL_ALREADY_EXISTS` → **"Email is already registered."**
   - กรณีอื่น → **"Could not create account."**
5. ปิดปุ่มระหว่างที่กำลังส่งข้อมูล
6. สมัครสำเร็จแล้วพาไปหน้า `/login`

**ลองทดสอบ:** สมัครด้วย email เดิมซ้ำ ต้องเห็น "Email is already registered."

### เข้าสู่ระบบ

**เป้าหมาย:** ได้ `accessToken` จาก backend แล้วเก็บไว้ใช้

1. เขียนฟังก์ชัน `login` ที่เรียก `POST /auth/login`
2. เขียน `useLogin` เมื่อสำเร็จให้เก็บ token ด้วย `setAccessToken` จาก `useAuthStore`
3. ใน `LoginPage` เรียก mutation ตอน submit
4. แสดงข้อความ error
   - `INVALID_CREDENTIALS` → **"Invalid email or password."**
   - กรณีอื่น → **"Could not log in."**
5. ล็อกอินสำเร็จแล้วพาไปหน้า `/todos`

**ลองทดสอบ:** เปิด DevTools แท็บ Application → Local Storage ต้องเห็น key `dnc-todo-auth` ที่มี `accessToken` อยู่ข้างใน แต่หน้า `/todos` ยังแสดง "Could not load tasks." เพราะเรายังไม่ได้ส่ง token ไปกับ request

### แนบ token ไปกับทุก request และแสดง email

**เป้าหมาย:** ให้ทุก request ที่ไป backend มี header `Authorization` โดยไม่ต้องเขียนซ้ำทุกที่

1. ใน `src/api/client.ts` เพิ่ม request interceptor ที่อ่าน token ด้วย `useAuthStore.getState()` (interceptor ไม่ใช่ component จึงใช้ hook ไม่ได้) ถ้ามี token ให้ใส่ header `Authorization: Bearer <token>`
2. refresh หน้า `/todos` ตอนนี้ต้องเห็นรายการ task แล้ว
3. เขียนฟังก์ชัน `getMe` ที่เรียก `GET /auth/me` และ hook `useMe` ใช้ queryKey `['me']` และให้ query ทำงานเฉพาะตอนที่มี token
4. ใน `AppHeader` แทน `user@example.com` ด้วย email จาก `useMe`

**สังเกตในแท็บ Network:** ก่อน request ที่มี header `Authorization` จะมี request method **`OPTIONS`** ไปที่ path เดียวกันก่อน นี่คือ **preflight** ที่ browser ถาม backend ว่าอนุญาตให้ส่ง header นี้ข้าม origin ไหม ถ้า backend ตอบว่าได้ browser จึงส่ง request จริงตามไป ลองเปิดดู response header ของ `OPTIONS` ว่ามี `Access-Control-Allow-...` อะไรบ้าง

### ออกจากระบบ

**เป้าหมาย:** ล้างทั้ง token และข้อมูลของผู้ใช้คนเดิม

1. เขียน `useLogout` ที่ทำ 3 อย่าง
   - เรียก `clearAuth()` เพื่อลบ token
   - เรียก `queryClient.clear()` เพื่อล้าง cache ของ React Query ทั้งหมด ถ้าไม่ล้าง คนที่ล็อกอินต่อจะเห็น task และ email ของคนก่อนหน้าชั่วครู่
   - พาไปหน้า `/login`
2. ผูก `useLogout` กับปุ่ม **Log out** ใน `AppHeader`

**ลองทดสอบ:** ล็อกอินด้วย user A แล้ว logout แล้วล็อกอินด้วย user B ต้องไม่เห็น task ของ A เลยแม้แต่ชั่วครู่

### กันหน้าที่ต้องล็อกอิน

**เป้าหมาย:** คนที่ยังไม่ล็อกอินเข้าหน้า task ไม่ได้ และคนที่ล็อกอินแล้วไม่ต้องเห็นหน้า login อีก

1. สร้าง `ProtectedRoute` ถ้าไม่มี token ให้ redirect ไป `/login` ถ้ามีให้แสดง `<Outlet />`
2. สร้าง `GuestRoute` ถ้ามี token ให้ redirect ไป `/todos` ถ้าไม่มีให้แสดง `<Outlet />`
3. ใน `router.tsx` ใช้ทั้งสองตัวเป็น layout route ครอบกลุ่ม route เดิม `ProtectedRoute` ครอบกลุ่ม `AppLayout` และ `GuestRoute` ครอบกลุ่ม `AuthLayout`
4. เอาการพาไป `/login` ออกจาก `useLogout` เพราะพอ token หายไป `ProtectedRoute` จะพาไปเอง

**ลองทดสอบ:** logout แล้วพิมพ์ `/todos` ใน address bar ต้องถูกพาไป `/login` และตอนล็อกอินอยู่ พิมพ์ `/login` ต้องถูกพาไป `/todos`

### กลับไปหน้าเดิมหลังล็อกอิน

**เป้าหมาย:** ถ้าเปิดลิงก์ไปหน้าใดหน้าหนึ่งตอนยังไม่ล็อกอิน พอล็อกอินเสร็จต้องกลับไปหน้านั้น ไม่ใช่ไป `/todos` เสมอ

1. ใน `ProtectedRoute` ตอน redirect ไป `/login` ให้ส่งหน้าที่ผู้ใช้ตั้งใจจะเข้าไปด้วย ผ่าน `state` ชื่อ `from` เก็บทั้ง path และ query string (`pathname` + `search`)
2. ใน `GuestRoute` ตอน redirect เพราะมี token แล้ว ให้ไปที่ `from` ถ้าไม่มีให้ไป `/todos`
3. เอา `navigate('/todos')` ออกจาก `LoginPage` เพราะพอ token ถูกเก็บ `GuestRoute` จะพาไปเอง ถ้าเหลือไว้ทั้งสองที่จะแย่งกันพาไปคนละหน้า

**ลองทดสอบ:** logout แล้วเปิด `/todos?status=completed` ล็อกอินเสร็จต้องกลับมาที่ `/todos?status=completed`

### ออกจากระบบอัตโนมัติเมื่อ token ใช้ไม่ได้

**เป้าหมาย:** ถ้า token หมดอายุหรือถูกแก้ แอปต้องพาผู้ใช้ไปล็อกอินใหม่ ไม่ใช่ค้างอยู่ที่หน้า error

1. ใน `src/api/client.ts` เพิ่ม response interceptor ที่ดัก error
2. ถ้า status เป็น **401** และตอนนั้น**มี token อยู่** ให้เรียก `clearAuth()` และ `queryClient.clear()` แล้วส่ง error ต่อไปตามเดิม
3. ต้องเช็คว่ามี token ก่อน เพราะตอน login ด้วยรหัสผิดก็ได้ 401 เหมือนกัน (`INVALID_CREDENTIALS`) แต่ตอนนั้นยังไม่มี token และไม่ต้องล้างอะไร

**ลองทดสอบ:** ล็อกอินแล้วเปิด Local Storage แก้ค่า `accessToken` ให้ผิด แล้ว refresh หน้า ต้องถูกพาไป `/login` เอง

## ปัญหาที่พบบ่อย

**`TypeError: todos.map is not a function`**
ยังไม่มีไฟล์ `.env` หรือสร้างแล้วแต่ยังไม่ได้รัน `pnpm dev` ใหม่ เมื่อไม่มี `VITE_API_URL` axios จะเรียกไปที่ `localhost:5173` ซึ่งเป็น Vite เอง และได้ไฟล์ HTML กลับมาแทนรายการ task

**ยังเจอ CORS error ทั้งที่เพิ่ม `cors` ที่ backend แล้ว**
ตรวจว่า origin ที่อนุญาตตรงกับที่อยู่ของเว็บทุกตัวอักษร `http://localhost:5173` กับ `http://127.0.0.1:5173` ถือเป็นคนละ origin และอย่าใส่ `/` ปิดท้าย

**ได้ 401 ตลอดทั้งที่ล็อกอินแล้ว**
เปิดแท็บ Network แล้วดู request header ว่ามี `Authorization: Bearer ...` ไหม ถ้าไม่มี ให้ตรวจ request interceptor ถ้ามีแต่ยังได้ 401 แปลว่า token หมดอายุหรือไม่ถูกต้อง ให้ logout แล้วล็อกอินใหม่

## คำศัพท์

| คำ              | ความหมาย                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Origin          | scheme + host + port ของเว็บ เช่น `http://localhost:5173` ถ้าตัวใดตัวหนึ่งต่างกันถือเป็นคนละ origin        |
| CORS            | กฎของ browser ที่ให้ backend เป็นคนบอกว่า origin ไหนเรียก API ข้าม origin ได้                              |
| Preflight       | request `OPTIONS` ที่ browser ส่งไปถาม backend ก่อน request จริง เมื่อ request มี header หรือ method พิเศษ |
| JWT             | token ที่ backend สร้างและเซ็นไว้ ข้างในมีข้อมูลผู้ใช้และวันหมดอายุ                                        |
| Bearer token    | รูปแบบการส่ง token ใน header `Authorization: Bearer <token>`                                               |
| Interceptor     | ฟังก์ชันของ axios ที่ทำงานกับทุก request ก่อนส่ง หรือกับทุก response ก่อนถึงโค้ดของเรา                     |
| Layout route    | route ที่มี `element` แต่ไม่มี `path` ใช้ครอบกลุ่ม route ลูก ซึ่งจะแสดงตรง `<Outlet />`                    |
| Protected route | route ที่ต้องล็อกอินก่อนถึงเข้าได้                                                                         |

## Stack

| Library                   | ใช้ทำอะไร                           |
| ------------------------- | ----------------------------------- |
| React + TypeScript + Vite | สร้าง UI                            |
| React Router              | จัดการ route                        |
| TanStack Query            | ดึงข้อมูลและจัดการ cache จาก API    |
| axios                     | เรียก API                           |
| React Hook Form + zod     | จัดการฟอร์มและตรวจข้อมูล            |
| Zustand                   | เก็บ token และบันทึกลง localStorage |
| Tailwind CSS              | ตกแต่ง UI                           |

## เฉลย

เฉลยอยู่ที่ branch `solution` แต่ละหัวข้อในบทเรียนเป็น 1 commit (หัวข้อแรกเรื่อง CORS แก้ที่ backend จึงไม่มี commit)

```bash
# ดูรายการ commit ของเฉลย
git log --oneline main..solution

# ดูว่าหัวข้อนั้นแก้อะไรบ้าง
git show <commit>
```

ลองทำเองก่อนแล้วค่อยเปิดเฉลยเทียบ
