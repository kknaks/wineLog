'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/lib/backend/client';
import { isNativeApp, openKakaoLoginBrowser } from '@/lib/utils/mobile';
import { useGlobalLoginMember } from '@/stores/auth/loginMember';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setLoginMember } = useGlobalLoginMember();

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

        if (isNativeApp()) {
          // 모바일 앱에서는 인앱 브라우저 사용
          console.log('모바일 앱에서 인앱 브라우저로 로그인 진행');
          const result = await openKakaoLoginBrowser((data as any).login_url);

          if (result === 'success') {
            console.log('인앱 브라우저에서 로그인 완료, 상태 확인 중...');
            // 로그인 상태 확인 (쿠키나 로컬 스토리지에서)
            await checkLoginStatus();
          }
        } else {
          // 웹에서는 일반 리다이렉트
          window.location.href = (data as any).login_url;
        }
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

  const checkLoginStatus = async () => {
    try {
      // 사용자 정보 API 호출하여 로그인 상태 확인
      const { data, error } = await (client as any).GET('/api/v1/auth/me');

      if (!error && data && (data as any).user) {
        console.log('로그인 확인됨:', data);
        setLoginMember((data as any).user);
        router.push('/');
      } else {
        console.log('로그인 확인 실패');
      }
    } catch (error) {
      console.error('로그인 상태 확인 실패:', error);
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