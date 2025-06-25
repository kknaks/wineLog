from fastapi import APIRouter
from .endpoints import health, wine, diary, auth
from fastapi import Depends
from utils.auth import get_current_user


api_router = APIRouter()

# 시스템 관련 라우터
api_router.include_router(health.router, prefix="/health", tags=["health"])

# 카카오 로그인 라우터
api_router.include_router(auth.router, prefix="/auth", tags=["kakao"])

# 와인 관련 라우터 (인증 필요)
api_router.include_router(
    wine.router, 
    prefix="/wines", 
    tags=["wines"],
    dependencies=[Depends(get_current_user)]
)

# 일기 관련 라우터 (인증 필요)
api_router.include_router(
    diary.router, 
    prefix="/diary", 
    tags=["diary"],
    dependencies=[Depends(get_current_user)]
)