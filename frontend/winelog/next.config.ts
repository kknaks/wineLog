import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Capacitor용 설정 추가
  output: 'export', // 정적 사이트로 빌드
  trailingSlash: true, // URL 끝에 슬래시 추가
  images: {
    unoptimized: true, // 이미지 최적화 비활성화 (정적 빌드시 필요)
  },
  
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.wine-log.kknaks.site',
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.wine-log.kknaks.site',
  },
  
  // 모바일 앱에서 절대 경로 문제 해결 (빌드 후에만 적용)
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  basePath: '',
  
  // 외부 이미지 도메인 허용 (필요시)
  images: {
    unoptimized: true,
    domains: ['api.wine-log.kknaks.site', 'wine-log.kknaks.site'],
  },
};

export default nextConfig;