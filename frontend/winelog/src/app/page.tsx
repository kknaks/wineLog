import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-14 pb-20">
      <Topbar />
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hello World
        </h1>
        <p className="text-lg text-gray-600">
          모바일 웹 프로젝트가 시작되었습니다! 🍷
        </p>
      </div>
      <Navbar />
    </div>
  );
}
