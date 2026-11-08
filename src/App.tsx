import logo from './assets/devnest-icon-light.png';

// หน้าชั่วคราว จะแทนด้วย RouterProvider ในขั้นถัดไป
export default function App() {
  return (
    <div className="mx-auto flex max-w-xl items-center gap-3 p-4">
      <img src={logo} alt="DevNest" className="size-8" />
      <h1 className="text-xl font-semibold text-violet-600">DevNest Todo</h1>
    </div>
  );
}
