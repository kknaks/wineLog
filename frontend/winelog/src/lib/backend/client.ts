import createClient from 'openapi-fetch';
import type { paths } from './schema';

// TODO: OpenAPI 스키마 타입이 생성되면 이 부분을 교체
// import type { paths } from './schema';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = createClient<paths>({
  baseUrl,
  credentials: 'include',
});

// 모바일 앱에서 로컬 스토리지 토큰을 헤더에 추가하는 미들웨어
client.use({
  onRequest({ request }) {
    // 모바일 앱에서 로컬 스토리지에 토큰이 있으면 Authorization 헤더에 추가
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }
    return request;
  },
});

export default client; 