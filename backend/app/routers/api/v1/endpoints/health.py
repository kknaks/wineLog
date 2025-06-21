from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from core.config import settings

router = APIRouter()

@router.get("/")
def health_check(db: Session = Depends(get_db)):
    """데이터베이스 연결 상태 확인"""
    try:
        # 간단한 쿼리로 DB 연결 테스트
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "db_host": settings.db_host,
            "db_name": settings.db_name
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

@router.get("/tables")
def check_tables(db: Session = Depends(get_db)):
    """데이터베이스 테이블 확인"""
    try:
        # PostgreSQL에서 테이블 목록 조회
        result = db.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [row[0] for row in result.fetchall()]
        return {
            "tables": tables,
            "count": len(tables)
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/config")
def get_config():
    """앱 설정 정보 (민감한 정보 제외)"""
    return {
        "app_name": settings.app_name,
        "debug": settings.debug,
        "db_host": settings.db_host,
        "db_port": settings.db_port,
        "db_name": settings.db_name,
        "cors_origins": settings.cors_origins,
        "max_file_size": settings.max_file_size,
        "upload_dir": settings.upload_dir
    } 