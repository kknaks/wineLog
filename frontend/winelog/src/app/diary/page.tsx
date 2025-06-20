import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';

export default function DiaryPage() {
  return (
    <div className="relative min-h-screen bg-white pt-14 pb-20">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/back_img.jpeg')" }}
      />

      {/* Layout components will appear on top */}
      <Topbar />
      <main className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          📖 다이어리
        </h1>
        <p className="text-gray-600">
          이곳에 와인 다이어리 내용이 표시됩니다.
        </p>
      </main>
      <Navbar />
    </div>
  );
}
