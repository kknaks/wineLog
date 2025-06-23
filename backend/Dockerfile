FROM python:3.12-slim

# app 폴더를 작업 디렉토리로 설정
WORKDIR /app

# 의존성 파일 복사
COPY requirements.txt .

# pip 업그레이드 및 의존성 설치
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 전체 app 폴더 복사
COPY app/ .

# .env 파일이 있다면 복사
COPY .env* ./

# 환경 변수 설정
ENV PYTHONUNBUFFERED=1

# 포트 노출
EXPOSE 7000

# 애플리케이션 실행 - main.py가 현재 디렉토리에 있음
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7000"]