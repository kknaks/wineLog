import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kknaks.winelog',
  appName: 'WineLog',
  webDir: 'out', // Next.js export의 출력 디렉토리
  server: {
    androidScheme: 'winelog',  // 고유한 스킴 사용
    iosScheme: 'winelog',      // iOS도 동일한 스킴
    hostname: 'app.kknaks.local', // 고유한 호스트명
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      permissions: ['write', 'read']
    }
  }
};

export default config;