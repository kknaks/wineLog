'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import client from '@/lib/backend/client';
import { useGlobalLoginMember } from '@/stores/auth/loginMember';
import { isNativeApp } from '@/lib/utils/mobile';

function KakaoCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setLoginMember } = useGlobalLoginMember();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const success = searchParams.get('success');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const userId = searchParams.get('user_id');
        const nickname = searchParams.get('nickname');

        if (error) {
          throw new Error('로그인이 취소되었습니다.');
        }

        // 모바일 앱에서 토큰이 URL 파라미터로 직접 전달된 경우
        if (success === '1' && accessToken && refreshToken) {
          console.log('모바일 앱 로그인 성공 - 토큰 직접 전달');

          // 로컬 스토리지에 토큰 저장 (모바일 앱용)
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);

          // 사용자 정보 저장
          const userData = {
            id: userId ? parseInt(userId) : undefined,
            nickname: nickname || ''
          };
          setLoginMember(userData);

          setStatus('success');
          console.log('모바일 앱 로그인 완료:', userData);

          // 모바일 앱에서는 즉시 브라우저 닫기
          setTimeout(() => {
            console.log('모바일 앱에서 로그인 완료 - 브라우저 닫기');
            window.close();
          }, 1000);

          return;
        }

        // 기존 웹 방식 (인증 코드 처리)
        if (!code) {
          throw new Error('인증 코드를 받지 못했습니다.');
        }

        // 백엔드로 인증 코드 전송
        const { data, error: apiError } = await (client as any).GET(`/api/v1/auth/kakao/callback?code=${code}`);

        if (apiError) {
          throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }

        if (data && (data as any).success) {
          // 로그인 성공
          setStatus('success');

          // 사용자 정보를 전역 상태에 저장
          const userData = (data as any).user;
          if (userData) {
            setLoginMember(userData);
          }

          console.log('로그인 성공:', data);

          // 웹에서는 2초 후 홈으로 이동
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error('로그인 처리 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('카카오 콜백 처리 오류:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');

        // 5초 후 로그인 페이지로 이동
        setTimeout(() => {
          if (isNativeApp()) {
            window.close();
          } else {
            router.push('/login');
          }
        }, 5000);
      }
    };

    handleCallback();
  }, [searchParams, router, setLoginMember]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 처리 중...</h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-500 text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 성공!</h2>
            <p className="text-gray-600">환영합니다. 홈으로 이동합니다.</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 실패</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    }>
      <KakaoCallbackContent />
    </Suspense>
  );
} 