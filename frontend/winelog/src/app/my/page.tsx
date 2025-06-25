'use client';

import Navbar from '@/components/layout/navbar';
import Topbar from '@/components/layout/topbar';
import { useGlobalLoginMember } from '@/stores/auth/loginMember';

export default function MyPage() {
  const {
    loginMember,
    logoutAndHome
  } = useGlobalLoginMember();

  return (
    <div className="min-h-screen bg-white pt-14 pb-20">
      <Topbar />
      <main className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            👤 내 정보
          </h1>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-semibold">
              {loginMember.nickname || '사용자'}님
            </p>
            <p className="text-gray-600 text-sm">
              {loginMember.email || '이메일 정보 없음'}
            </p>
            {loginMember.profile_image && (
              <img
                src={loginMember.profile_image}
                alt="프로필 이미지"
                className="w-16 h-16 rounded-full mx-auto mt-2"
              />
            )}
          </div>

          <button
            onClick={logoutAndHome}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </main>
      <Navbar />
    </div>
  );
}
