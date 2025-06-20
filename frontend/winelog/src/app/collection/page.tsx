import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';

export default function DictPage() {
  return (
    <div className="min-h-screen bg-white pt-14 pb-20">
      <Topbar />
      <main className="flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🍷 와인 도감
        </h1>
        <p className="text-gray-600">
          이곳에 와인 도감 내용이 표시됩니다.
        </p>
      </main>
      <Navbar />
    </div>
  );
}
