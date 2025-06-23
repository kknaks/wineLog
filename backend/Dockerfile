FROM python:3.12-slim

WORKDIR /app

# 의존성 파일 복사
COPY requirements.txt .

# pip 업그레이드 및 의존성 설치
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 어플리케이션 코드 복사
COPY . .

# app 디렉토리로 이동
WORKDIR /app/app

# 환경 변수 설정
ENV PYTHONUNBUFFERED=1

# .env 파일을 컨테이너에 복사
COPY .env .env

# 포트 노출
EXPOSE 7000

# 애플리케이션 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7000"]