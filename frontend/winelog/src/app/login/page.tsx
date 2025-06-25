'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/lib/backend/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('카카오 로그인 시작...');

      // 백엔드에서 카카오 로그인 URL 가져오기
      console.log('API 호출 시작: /api/v1/auth/kakao/login');
      const { data, error } = await (client as any).GET('/api/v1/auth/kakao/login');

      console.log('API 응답 - data:', data);
      console.log('API 응답 - error:', error);

      if (error) {
        console.error('API 에러:', error);
        throw new Error('로그인 URL을 가져올 수 없습니다.');
      }

      if (data && (data as any).login_url) {
        console.log('로그인 URL:', (data as any).login_url);
        // 카카오 로그인 페이지로 리다이렉트
        window.location.href = (data as any).login_url;
      } else {
        console.error('로그인 URL이 없음. 응답 데이터:', data);
        throw new Error('로그인 URL이 응답에 없습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🍷 Wine Log
        </h1>
        <p className="text-gray-600 mb-8">
          카카오 로그인으로 시작하세요
        </p>

        <button
          onClick={handleKakaoLogin}
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? (
            <span>로그인 중...</span>
          ) : (
            <>
              <span>🔑</span>
              <span>카카오로 로그인</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
} 