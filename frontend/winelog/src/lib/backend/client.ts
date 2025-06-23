import createClient from 'openapi-fetch';
import type { paths } from './schema';

// TODO: OpenAPI 스키마 타입이 생성되면 이 부분을 교체
// import type { paths } from './schema';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = createClient<paths>({
  baseUrl,
  credentials: 'include',
});

export default client; 