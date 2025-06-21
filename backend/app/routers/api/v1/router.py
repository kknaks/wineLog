from fastapi import APIRouter
from .endpoints import health, wine, diary

api_router = APIRouter()

# 시스템 관련 라우터
api_router.include_router(health.router, prefix="/health", tags=["health"])

# 와인 관련 라우터
api_router.include_router(wine.router, prefix="/wines", tags=["wines"])

# 일기 관련 라우터
api_router.include_router(diary.router, prefix="/diary", tags=["diary"])
