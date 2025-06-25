import { CapacitorHttp } from '@capacitor/core';
import { isNativeApp } from './mobile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wine-log.kknaks.site';

// 네이티브 앱에서는 Capacitor HTTP 사용, 웹에서는 fetch 사용
export const httpRequest = async (
  url: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    data?: any;
  }
) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  if (isNativeApp()) {
    // 네이티브 앱에서는 Capacitor HTTP 사용 (CORS 우회)
    console.log('네이티브 앱에서 HTTP 요청:', fullUrl);
    
    const response = await CapacitorHttp.request({
      url: fullUrl,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      data: options.data,
    });
    
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  } else {
    // 웹에서는 일반 fetch 사용
    console.log('웹에서 HTTP 요청:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.data ? JSON.stringify(options.data) : undefined,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }
};

// FormData 전용 함수 (파일 업로드용)
export const httpFormDataRequest = async (
  url: string,
  formData: FormData
) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  // 네이티브 앱에서도 웹과 동일하게 fetch 사용 (FormData 지원)
  console.log(isNativeApp() ? '네이티브 앱에서 FormData 요청:' : '웹에서 FormData 요청:', fullUrl);
  
  const response = await fetch(fullUrl, {
    method: 'POST',
    body: formData,
    // credentials: 'include', // 네이티브 앱에서는 제거
  });
  
  const data = await response.json();
  
  return {
    data,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
  };
}; 