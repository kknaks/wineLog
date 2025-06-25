'use client';

import { Geist, Geist_Mono, Coustard, Roboto, Rhodium_Libre } from "next/font/google";
import "./globals.css";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import SplashScreen from "@/components/common/SplashScreen";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { LoginMemberContext, useLoginMember } from '@/stores/auth/loginMember';
import { usePathname } from 'next/navigation';
import LoginPage from './login/page';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const coustard = Coustard({
  weight: ['400', '900'],
  subsets: ['latin'],
  variable: '--font-coustard',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const rhodiumLibre = Rhodium_Libre({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-rhodium-libre',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const loginMemberValue = useLoginMember();
  const pathname = usePathname();

  // 로그인 콜백 페이지만 예외 처리 (로그인 처리 중이므로)
  const isCallbackPage = pathname === '/login/callback';

  useEffect(() => {
    setIsClient(true);
    // 로그인 상태 확인 (콜백 페이지가 아닐 때만)
    if (!isCallbackPage) {
      loginMemberValue.checkLoginStatus();
    }
  }, [isCallbackPage]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // 서버 사이드 렌더링 시에는 기본 구조만
  if (!isClient) {
    return (
      <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
        <body>
          <LoginMemberContext.Provider value={loginMemberValue}>
            {children}
          </LoginMemberContext.Provider>
        </body>
      </html>
    );
  }

  // 콜백 페이지는 그대로 렌더링 (로그인 처리 중)
  if (isCallbackPage) {
    return (
      <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
        <Head>
          <title>Wine Log</title>
          <meta name="description" content="와인 로그 모바일 웹 애플리케이션" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <body>
          <LoginMemberContext.Provider value={loginMemberValue}>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            {children}
          </LoginMemberContext.Provider>
        </body>
      </html>
    );
  }

  // 로그인 상태 확인 중일 때
  if (loginMemberValue.isLoginMemberPending) {
    return (
      <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
        <Head>
          <title>Wine Log</title>
          <meta name="description" content="와인 로그 모바일 웹 애플리케이션" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <body>
          <LoginMemberContext.Provider value={loginMemberValue}>
            <div className="flex flex-col items-center justify-center h-screen text-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-lg text-gray-600">로그인 상태 확인 중...</p>
            </div>
          </LoginMemberContext.Provider>
        </body>
      </html>
    );
  }

  // 로그인이 안되어 있으면 어떤 페이지든 상관없이 로그인 페이지 표시 (nav/topbar 없음)
  if (!loginMemberValue.isLogin) {
    return (
      <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
        <Head>
          <title>Wine Log</title>
          <meta name="description" content="와인 로그 모바일 웹 애플리케이션" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>
        <body>
          <LoginMemberContext.Provider value={loginMemberValue}>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <LoginPage />
          </LoginMemberContext.Provider>
        </body>
      </html>
    );
  }

  // 로그인이 되어 있으면 nav/topbar가 있는 정상 앱 레이아웃
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${coustard.variable} ${roboto.variable} ${rhodiumLibre.variable}`}>
      <Head>
        <title>Wine Log</title>
        <meta name="description" content="와인 로그 모바일 웹 애플리케이션" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <body>
        <LoginMemberContext.Provider value={loginMemberValue}>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          <div className="flex flex-col h-screen">
            <Topbar />
            <main className="h-[calc(100vh-8.5rem)] overflow-y-auto">
              {children}
            </main>
            <Navbar />
          </div>
        </LoginMemberContext.Provider>
      </body>
    </html>
  );
}
