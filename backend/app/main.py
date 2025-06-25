from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine
from core.config import settings
from routers.api.v1.router import api_router
# 모델 import - 테이블 생성을 위해 필요
from models.wine import Wine
from models.diary import Diary
from models.user import User

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="와인 일기 관리 API",
    version="1.0.0",
    debug=settings.debug
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # 로컬 개발용
        "https://wine-log.kknaks.site",  # 프로덕션 프론트엔드
        "https://www.wine-log.kknaks.site",
        "winelog://app.kknaks.local",  # WineLog 앱 전용 origin (안전함)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# API v1 라우터 포함
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    """API 루트 엔드포인트"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health_check": "/health"
    }

@app.get("/health")
def health_check():
    """간단한 헬스체크 엔드포인트"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": "1.0.0"
    }