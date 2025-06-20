import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white pt-14 pb-20">
      <Topbar />
      <main className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👤 내 정보
        </h1>
        <p className="text-gray-600">
          이곳에 내 정보 관련 내용이 표시됩니다.
        </p>
      </main>
      <Navbar />
    </div>
  );
}
