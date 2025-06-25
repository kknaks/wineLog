import boto3
import uuid
import base64
from datetime import datetime
from io import BytesIO
from PIL import Image
from botocore.exceptions import ClientError
from core.config import settings
import os
from dotenv import load_dotenv
from fastapi import UploadFile
from typing import List

# .env 파일 명시적 로드
load_dotenv()

# Naver Cloud Platform Object Storage 설정
NCP_ACCESS_KEY = os.getenv("NCP_ACCESS_KEY")
NCP_SECRET_KEY = os.getenv("NCP_SECRET_KEY") 
NCP_REGION = os.getenv("NCP_REGION", "kr")
NCP_BUCKET_NAME = os.getenv("NCP_BUCKET_NAME", "winelog-images")
NCP_ENDPOINT = f"https://{NCP_BUCKET_NAME}.{NCP_REGION}.ncloudstorage.com"

class NCPObjectStorageService:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=NCP_ACCESS_KEY,
            aws_secret_access_key=NCP_SECRET_KEY,
            region_name=NCP_REGION,
            endpoint_url=NCP_ENDPOINT,
        )
        self.bucket_name = NCP_BUCKET_NAME
        self.region_code = NCP_REGION
    
    def upload_base64_image(self, base64_string: str, folder: str = "images") -> str:
        """
        Base64 이미지를 Naver Cloud Object Storage에 업로드
        
        Args:
            base64_string: Base64 인코딩된 이미지 문자열
            folder: 저장할 폴더 경로
            
        Returns:
            str: 업로드된 이미지의 공개 URL
        """
        try:
            # Base64 디코딩
            if base64_string.startswith('data:image'):
                base64_string = base64_string.split(',')[1]
            
            image_data = base64.b64decode(base64_string)
            
            # 파일명 생성 (타임스탬프 + UUID)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            file_name = f"{folder}/{timestamp}_{unique_id}.jpg"
            
            # 이미지 최적화
            image = Image.open(BytesIO(image_data))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # 이미지 리사이즈 (최대 1920x1080)
            image.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
            
            # 최적화된 이미지를 BytesIO로 변환
            output = BytesIO()
            image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            # NCP Object Storage 업로드
            self.s3_client.upload_fileobj(
                output,
                self.bucket_name,
                file_name,
                ExtraArgs={
                    'ContentType': 'image/jpeg',
                    'CacheControl': 'max-age=31536000'  # 1년 캐시
                }
            )
            
            # NCP Object Storage URL 형식으로 반환
            image_url = f"https://{self.bucket_name}.{self.region_code}.ncloudstorage.com/{file_name}"
            return image_url
            
        except Exception as e:
            raise Exception(f"NCP Object Storage 업로드 실패: {str(e)}")
    
    def upload_multiple_images(self, images: list, folder: str = "images") -> list:
        """
        여러 이미지를 한번에 업로드
        
        Args:
            images: Base64 이미지 문자열 리스트
            folder: 저장할 폴더 경로
            
        Returns:
            list: 업로드된 이미지 URL 리스트 (None 포함 가능)
        """
        uploaded_urls = []
        for image_base64 in images:
            if image_base64:  # None이 아닌 경우만
                url = self.upload_base64_image(image_base64, folder)
                uploaded_urls.append(url)
            else:
                uploaded_urls.append(None)
        return uploaded_urls
    
    def delete_image(self, image_url: str) -> bool:
        """
        NCP Object Storage에서 이미지 삭제
        
        Args:
            image_url: 삭제할 이미지의 전체 URL
            
        Returns:
            bool: 삭제 성공 여부
        """
        try:
            # URL에서 파일 경로 추출
            # https://bucket.kr-standard.ncloudstorage.com/folder/file.jpg → folder/file.jpg
            url_parts = image_url.split(f"{self.bucket_name}.{self.region_code}.ncloudstorage.com/")
            if len(url_parts) > 1:
                file_name = url_parts[1]
            else:
                raise Exception("잘못된 URL 형식")
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_name
            )
            return True
        except Exception as e:
            print(f"NCP Object Storage 삭제 실패: {str(e)}")
            return False
    
    def get_presigned_url(self, file_name: str, expiration: int = 3600) -> str:
        """
        Presigned URL 생성 (임시 접근 URL)
        
        Args:
            file_name: 파일 경로
            expiration: 만료 시간 (초)
            
        Returns:
            str: Presigned URL
        """
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_name},
                ExpiresIn=expiration
            )
            return response
        except Exception as e:
            raise Exception(f"Presigned URL 생성 실패: {str(e)}")
    
    async def upload_file_objects(self, files: List[UploadFile], folder: str = "images") -> List[str]:
        """
        UploadFile 객체들을 직접 업로드
        
        Args:
            files: UploadFile 객체 리스트
            folder: 저장할 폴더 경로
            
        Returns:
            list: 업로드된 이미지 URL 리스트
        """
        uploaded_urls = []
        
        for file in files:
            try:
                # 파일 내용 읽기
                contents = await file.read()
                
                # 파일명 생성 (타임스탬프 + UUID)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                unique_id = str(uuid.uuid4())[:8]
                
                # 원본 파일 확장자 유지
                original_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
                file_name = f"{folder}/{timestamp}_{unique_id}.{original_extension}"
                
                # 이미지 최적화
                image = Image.open(BytesIO(contents))
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # 이미지 리사이즈 (최대 1920x1080)
                image.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
                
                # 최적화된 이미지를 BytesIO로 변환
                output = BytesIO()
                image.save(output, format='JPEG', quality=85, optimize=True)
                output.seek(0)
                
                # NCP Object Storage 업로드
                self.s3_client.upload_fileobj(
                    output,
                    self.bucket_name,
                    file_name,
                    ExtraArgs={
                        'ContentType': 'image/jpeg',
                        'CacheControl': 'max-age=31536000'  # 1년 캐시
                    }
                )
                
                # NCP Object Storage URL 형식으로 반환
                image_url = f"https://{self.bucket_name}.{self.region_code}.ncloudstorage.com/{file_name}"
                uploaded_urls.append(image_url)
                
                # 파일 포인터 리셋
                await file.seek(0)
                
            except Exception as e:
                raise Exception(f"파일 업로드 실패 ({file.filename}): {str(e)}")
        
        return uploaded_urls

# 전역 인스턴스 생성
ncp_storage = NCPObjectStorageService()

# 편의 함수들
def upload_diary_images(front_image: str = None, back_image: str = None, 
                       thumbnail_image: str = None, download_image: str = None) -> tuple:
    """
    일기 관련 이미지들을 업로드하는 편의 함수
    
    Returns:
        tuple: (front_url, back_url, thumbnail_url, download_url)
    """
    folder = f"diary/{datetime.now().strftime('%Y/%m')}"
    images = [front_image, back_image, thumbnail_image, download_image]
    urls = ncp_storage.upload_multiple_images(images, folder)
    return tuple(urls)

def upload_wine_images(front_image: str = None, back_image: str = None) -> tuple:
    """
    와인 라벨 이미지들을 업로드하는 편의 함수 (미래를 위해)
    
    Returns:
        tuple: (front_url, back_url)
    """
    folder = f"wine/{datetime.now().strftime('%Y/%m')}"
    images = [front_image, back_image]
    urls = ncp_storage.upload_multiple_images(images, folder)
    return tuple(urls)

def delete_diary_images(diary_data: dict) -> bool:
    """
    일기 관련 모든 이미지 삭제
    
    Args:
        diary_data: 이미지 URL들이 포함된 딕셔너리
        
    Returns:
        bool: 모든 삭제 성공 여부
    """
    image_fields = ['frontImage', 'backImage', 'thumbnailImage', 'downloadImage']
    success_count = 0
    
    for field in image_fields:
        if diary_data.get(field):
            if ncp_storage.delete_image(diary_data[field]):
                success_count += 1
    
    return success_count > 0  # 하나라도 성공하면 True 