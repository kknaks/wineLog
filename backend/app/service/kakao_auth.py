import httpx
from typing import Optional
from core.config import settings

class KakaoAuthService:
    def get_authorization_url(self, state: str = None) -> str:
        """카카오 로그인 페이지 URL 생성"""
        params = {
            "client_id": settings.KAKAO_CLIENT_ID,
            "redirect_uri": settings.KAKAO_REDIRECT_URI,
            "response_type": "code",
        }
        if state:
            params["state"] = state
            
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{settings.KAKAO_AUTH_URL}?{query_string}"
    
    async def get_access_token(self, code: str) -> Optional[str]:
        """인가 코드로 액세스 토큰 받기"""
        data = {
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_CLIENT_ID,
            "redirect_uri": settings.KAKAO_REDIRECT_URI,
            "code": code,
        }
        
        if settings.KAKAO_CLIENT_SECRET:
            data["client_secret"] = settings.KAKAO_CLIENT_SECRET
        
        async with httpx.AsyncClient() as client:
            response = await client.post(settings.KAKAO_TOKEN_URL, data=data)
            if response.status_code == 200:
                token_data = response.json()
                return token_data.get("access_token")
        return None
    
    async def get_user_info(self, access_token: str) -> Optional[dict]:
        """액세스 토큰으로 사용자 정보 가져오기"""
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.KAKAO_USER_INFO_URL, headers=headers)
            if response.status_code == 200:
                return response.json()
        return None