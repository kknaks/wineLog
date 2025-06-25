'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen as CapacitorSplashScreen } from '@capacitor/splash-screen';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 네이티브 앱인 경우 Capacitor SplashScreen 사용
    if (Capacitor.isNativePlatform()) {
      // 네이티브 스플래시 스크린을 수동으로 숨김
      const timer = setTimeout(async () => {
        try {
          await CapacitorSplashScreen.hide({
            fadeOutDuration: 1000
          });
        } catch (error) {
          console.log('SplashScreen hide error:', error);
        }
        setIsVisible(false);
        setTimeout(onFinish, 100);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // 웹에서는 React 컴포넌트로 스플래시 스크린 구현
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onFinish, 500); // fade out 후 완전히 제거
      }, 2000); // 2초간 보여주기

      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  // 네이티브 앱에서는 네이티브 스플래시를 사용하므로 컴포넌트 렌더링 안함
  if (Capacitor.isNativePlatform() || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      {/* 로고 또는 앱 이름 */}
      <div className="flex flex-col items-center space-y-6">
        <div className="text-6xl font-coustard font-bold text-gray-800">
          WineLog
        </div>

        {/* 와인 잔 아이콘 또는 이미지 */}
        <div className="text-6xl">🍷</div>

        {/* 로딩 스피너 */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* 서브 텍스트 */}
        <p className="text-gray-500 font-roboto text-sm">
          와인의 순간을 기록하다
        </p>
      </div>
    </div>
  );
} 