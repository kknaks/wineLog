from fastapi import APIRouter, HTTPException, Query, Depends, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from service.kakao_auth import KakaoAuthService
from service.user_service import UserService
from utils.auth import create_access_token, create_token_pair, verify_token, get_current_user
from db.database import get_db
from models.user import User
from core.config import settings

router = APIRouter()
kakao_service = KakaoAuthService()
user_service = UserService()
front_url = settings.front_url

@router.get("/kakao/login")
async def kakao_login(platform: str = Query(None)):
    # 플랫폼 정보를 state로 전달하여 콜백에서 사용할 수 있도록 함
    state = platform if platform else "web"
    login_url = kakao_service.get_authorization_url(state=state)
    return {"login_url": login_url}

@router.get("/kakao/callback")
async def kakao_callback(response: Response, code: str = Query(...), state: str = Query(None), db: Session = Depends(get_db)):
    # 액세스 토큰 받기
    access_token = await kakao_service.get_access_token(code)
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")
    
    # 사용자 정보 가져오기
    user_info = await kakao_service.get_user_info(access_token)
    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to get user info")
    
    # 우리 서비스의 JWT 토큰 쌍 생성
    tokens = create_token_pair(user_info)
    
    # DB에서 기존 사용자 확인
    kakao_id = str(user_info["id"])
    existing_user = user_service.get_user_by_kakao_id(db, kakao_id)
    
    if existing_user:
        # 기존 사용자의 refresh token 업데이트
        user_service.update_user_refresh_token(db, existing_user, tokens["refresh_token"])
        user_data = existing_user
    else:
        # 새 사용자 생성
        user_data = user_service.create_user(db, user_info, tokens["refresh_token"])
    
    # 모바일 앱인지 확인 (state에서 플랫폼 정보 추출)
    platform = state if state else "web"
    is_mobile = platform in ['ios', 'android']
    
    if is_mobile:
        # 모바일 앱의 경우 토큰을 URL 파라미터로 전달
        callback_url = f"{front_url}/login/callback"
        redirect_url = f"{callback_url}?success=1&access_token={tokens['access_token']}&refresh_token={tokens['refresh_token']}&user_id={user_data.id}&nickname={user_data.nickname}"
        redirect_response = RedirectResponse(url=redirect_url, status_code=302)
    else:
        # 웹의 경우 기존 방식 (쿠키 사용)
        redirect_response = RedirectResponse(url=front_url, status_code=302)
        
        # 쿠키에 토큰 설정
        redirect_response.set_cookie(
            key="access_token",
            value=tokens["access_token"],
            max_age=60 * 15,  # 15분
            httponly=True,
            secure=False,  # 개발환경에서는 False, 프로덕션에서는 True
            samesite="lax"
        )
        
        redirect_response.set_cookie(
            key="refresh_token", 
            value=tokens["refresh_token"],
            max_age=60 * 60 * 24 * 30,  # 30일
            httponly=True,
            secure=False,  # 개발환경에서는 False, 프로덕션에서는 True
            samesite="lax"
        )
    
    return redirect_response

@router.post("/refresh")
async def refresh_token(response: Response, refresh_token: str, db: Session = Depends(get_db)):
    """Refresh Token으로 새 Access Token 발급"""
    payload = verify_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # DB에서 사용자 확인 및 refresh token 검증
    kakao_id = payload.get("sub")
    if not kakao_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = user_service.get_user_by_kakao_id(db, kakao_id)
    if not user or user.refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # 새 Access Token 발급
    new_access_token = create_access_token(data={"sub": kakao_id})
    
    # 새 Access Token을 쿠키에 설정
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        max_age=60 * 15,  # 15분
        httponly=True,
        secure=False,  # 개발환경에서는 False, 프로덕션에서는 True
        samesite="lax"
    )
    
    return {
        "success": True,
        "message": "Access token refreshed"
    }

@router.post("/logout")
async def logout(response: Response):
    """로그아웃 - 쿠키 삭제"""
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    
    return {
        "success": True,
        "message": "Logged out successfully"
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """현재 로그인한 사용자 정보 반환"""
    return {
        "id": current_user.id,
        "kakao_id": current_user.kakao_id,
        "nickname": current_user.nickname,
        "email": current_user.email,
        "profile_image": current_user.profile_image,
        "created_at": current_user.created_at
    }