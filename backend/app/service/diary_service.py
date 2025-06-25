from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Dict, Any, Optional, List
from fastapi import UploadFile
from crud import diary as diary_crud
from utils.storage import ncp_storage


class DiaryService:
    """
    Diary 관련 비즈니스 로직을 처리하는 서비스
    """
    
    @staticmethod
    async def create_wine_diary(
        db: Session,
        user_id: int,
        wine_data: Dict[str, Any],
        diary_data: Dict[str, Any],
        image_files: Dict[str, UploadFile]
    ) -> Dict[str, Any]:
        """
        와인 일기 생성 (이미지 업로드 + DB 저장)
        트랜잭션을 관리하여 모든 작업이 성공하거나 실패하거나
        """
        try:
            # 1. 이미지 업로드 (DB 작업 전에 먼저 처리)
            uploaded_image_urls = await DiaryService._upload_diary_images(image_files)
            
            # 2. 데이터베이스 트랜잭션 시작
            # 와인 생성 또는 조회
            wine = diary_crud.create_or_get_wine(db, wine_data)
            
            # 일기 생성
            diary = diary_crud.create_diary(
                db=db,
                user_id=user_id,
                wine_id=wine.id,
                diary_data=diary_data,
                image_urls=uploaded_image_urls
            )
            
            # 3. 모든 작업이 성공하면 commit
            db.commit()
            db.refresh(wine)
            db.refresh(diary)
            
            return {
                "success": True,
                "diary_id": diary.id,
                "wine_id": wine.id,
                "uploaded_images": uploaded_image_urls,
                "message": "와인 일기가 성공적으로 저장되었습니다"
            }
            
        except IntegrityError as e:
            db.rollback()
            # TODO: 업로드된 이미지 삭제 로직 추가
            raise Exception(f"데이터베이스 무결성 오류: {str(e)}")
        except Exception as e:
            db.rollback()
            # TODO: 업로드된 이미지 삭제 로직 추가
            raise Exception(f"일기 저장 중 오류 발생: {str(e)}")
    
    @staticmethod
    async def _upload_diary_images(image_files: Dict[str, UploadFile]) -> Dict[str, str]:
        """
        일기 관련 이미지들을 업로드
        """
        uploaded_urls = {}
        
        if image_files.get("frontImage"):
            front_urls = await ncp_storage.upload_file_objects([image_files["frontImage"]], "diary/front")
            uploaded_urls["frontImage"] = front_urls[0] if front_urls else None
            
        if image_files.get("backImage"):
            back_urls = await ncp_storage.upload_file_objects([image_files["backImage"]], "diary/back")
            uploaded_urls["backImage"] = back_urls[0] if back_urls else None
            
        if image_files.get("thumbnailImage"):
            thumb_urls = await ncp_storage.upload_file_objects([image_files["thumbnailImage"]], "diary/thumbnail")
            uploaded_urls["thumbnailImage"] = thumb_urls[0] if thumb_urls else None
            
        if image_files.get("downloadImage"):
            download_urls = await ncp_storage.upload_file_objects([image_files["downloadImage"]], "diary/download")
            uploaded_urls["downloadImage"] = download_urls[0] if download_urls else None
        
        return uploaded_urls
    
    @staticmethod
    def get_user_diaries(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> List:
        """
        사용자의 일기 목록 조회
        """
        return diary_crud.get_user_diaries(db, user_id, skip, limit)
    
    @staticmethod
    def get_diary_detail(
        db: Session,
        user_id: int,
        diary_id: int
    ) -> Optional:
        """
        일기 상세 조회
        """
        return diary_crud.get_diary_by_id(db, user_id, diary_id)
    
    @staticmethod
    def update_diary(
        db: Session,
        user_id: int,
        diary_id: int,
        update_data: Dict[str, Any]
    ) -> Optional:
        """
        일기 수정
        """
        try:
            diary = diary_crud.update_diary(db, user_id, diary_id, update_data)
            if diary:
                db.commit()
                db.refresh(diary)
            return diary
        except Exception as e:
            db.rollback()
            raise Exception(f"일기 수정 중 오류 발생: {str(e)}")
    
    @staticmethod
    def delete_diary(
        db: Session,
        user_id: int,
        diary_id: int
    ) -> bool:
        """
        일기 삭제
        """
        try:
            result = diary_crud.delete_diary(db, user_id, diary_id)
            if result:
                db.commit()
            return result
        except Exception as e:
            db.rollback()
            raise Exception(f"일기 삭제 중 오류 발생: {str(e)}")
    
    @staticmethod
    def get_public_diaries(
        db: Session,
        skip: int = 0,
        limit: int = 20
    ) -> List:
        """
        공개된 일기 목록 조회
        """
        return diary_crud.get_public_diaries(db, skip, limit)


# 싱글톤 인스턴스
diary_service = DiaryService() 