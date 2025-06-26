'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/lib/backend/client';
import { isNativeApp, openKakaoLoginBrowser, getPlatform, initializeKakaoSDK, kakaoSDKLogin } from '@/lib/utils/mobile';
import { useGlobalLoginMember } from '@/stores/auth/loginMember';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setLoginMember } = useGlobalLoginMember();

  // 카카오 앱 키 (환경변수에서 가져오거나 직접 설정)
  const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '9be4b832a05dea26f6f1f5c3b1d3d45b';

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('카카오 로그인 시작...');

      if (isNativeApp()) {
        // 모바일 앱에서는 카카오 SDK 사용
        console.log('모바일 앱에서 카카오 SDK 로그인 진행');

        // 1. 카카오 SDK 초기화
        const initialized = await initializeKakaoSDK(KAKAO_APP_KEY);
        if (!initialized) {
          throw new Error('카카오 SDK 초기화에 실패했습니다.');
        }

        // 2. 카카오 SDK 로그인
        const kakaoResult = await kakaoSDKLogin();
        if (!kakaoResult) {
          throw new Error('카카오 로그인에 실패했습니다.');
        }

        console.log('카카오 SDK 로그인 성공:', kakaoResult);

        // 3. 백엔드에 카카오 토큰 전송하여 우리 서비스 토큰 받기
        const { data, error } = await (client as any).POST('/api/v1/auth/kakao/sdk-login', {
          body: {
            access_token: kakaoResult.accessToken,
            platform: getPlatform()
          }
        });

        if (error || !data) {
          throw new Error('서버 로그인 처리 중 오류가 발생했습니다.');
        }

        // 4. 토큰 저장 및 사용자 정보 저장
        if (data.user && data.tokens) {
          // 모바일에서는 로컬 스토리지에 토큰 저장
          localStorage.setItem('access_token', data.tokens.access_token);
          localStorage.setItem('refresh_token', data.tokens.refresh_token);

          setLoginMember(data.user);
          console.log('로그인 완료:', data.user);
          router.push('/');
        }

      } else {
        // 웹에서는 기존 방식 사용
        const platform = 'web';
        console.log('웹에서 기존 방식으로 로그인 진행');
        const { data, error } = await (client as any).GET(`/api/v1/auth/kakao/login?platform=${platform}`);

        if (error) {
          console.error('API 에러:', error);
          throw new Error('로그인 URL을 가져올 수 없습니다.');
        }

        if (data && (data as any).login_url) {
          window.location.href = (data as any).login_url;
        } else {
          throw new Error('로그인 URL이 응답에 없습니다.');
        }
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

      if (!error && data) {
        console.log('로그인 확인됨:', data);
        setLoginMember(data);
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