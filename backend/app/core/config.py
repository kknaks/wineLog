import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from pydantic import Field

load_dotenv()

class Settings(BaseSettings):
  app_name: str = "Wine Log API"
  debug: bool = os.getenv("DEBUG", "False").lower() == "true"

  # # API 서버 설정
  # api_host: str = os.getenv("API_HOST", "0.0.0.0")
  # api_port: int = int(os.getenv("API_PORT", "7000"))
  
  # # JWT 설정
  # secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
  # algorithm: str = os.getenv("ALGORITHM", "HS256")
  # access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

  # Database settings
  db_host: str = os.getenv("DB_HOST", "localhost")
  db_port: int = int(os.getenv("DB_PORT", "5432"))
  db_name: str = os.getenv("DB_NAME", "wine_log")
  db_user: str = os.getenv("DB_USER", "postgres")
  db_password: str = os.getenv("DB_PASSWORD", "")
  db_url: str = os.getenv("DATABASE_URL", f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

  # Database connection settings
  db_pool_size: int = int(os.getenv("DB_POOL_SIZE", "5"))
  db_max_overflow: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
  db_pool_timeout: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))
  db_pool_recycle: int = int(os.getenv("DB_POOL_RECYCLE", "3600"))
  
  # SQL 쿼리 로그 설정 (DEBUG와 독립적으로 제어 가능)
  db_echo: bool = os.getenv("DB_ECHO", str(debug)).lower() == "true"

  #AI
  google_api_key: str = os.getenv("GOOGLE_API_KEY")

  #LLM
  llm_model: str = os.getenv("LLM_MODEL", "gemini-2.0-flash-001")
  llm_temperature: float = float(os.getenv("LLM_TEMPERATURE", "0.2"))

  # 디버그 설정
  langchain_debug: bool = os.getenv("LANGCHAIN_DEBUG", "true").lower() == "true"
  langchain_verbose: bool = os.getenv("LANGCHAIN_VERBOSE", "true").lower() == "true"
    
  # CORS 설정
  cors_origins: list = ["*"]  # 개발용, 프로덕션에서는 구체적인 도메인 지정

  # 파일 업로드 설정
  max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
  upload_dir: str = os.getenv("UPLOAD_DIR", "temp_uploads")
  
  perplexity_api_key: str = os.getenv("PERPLEXITY_API_KEY")
  
  class Config:
      env_file = ".env"
      case_sensitive = False
      extra = "allow"  # 추가 필드 허용

settings = Settings()