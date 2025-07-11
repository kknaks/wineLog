from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from db import get_db
from core.config import settings
from models.wine import Wine
from service import llm_service
from service.diary_service import diary_service
from schemas.diary import WineTasteRequest
from utils.storage import ncp_storage
from utils.auth import get_current_user
from models.user import User

router = APIRouter()

@router.post("/wine-analysis")
async def wine_analysis(
    image_files: List[UploadFile] = File(...)
):
    """
    2장의 와인 사진을 받아서 LLM으로 분석
    """
    # 파일 개수 검증
    if len(image_files) != 2:
        raise HTTPException(
            status_code=400, 
            detail="정확히 2장의 이미지가 필요합니다."
        )
    
    # 파일 타입 검증
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    for file in image_files:
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"지원하지 않는 파일 형식입니다: {file.content_type}. 지원 형식: jpeg, jpg, png, webp"
            )
    
    # 파일 크기 검증 (10MB 제한)
    for file in image_files:
        contents = await file.read()
        if len(contents) > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"파일 크기가 너무 큽니다: {file.filename}. 최대 {settings.max_file_size}바이트"
            )
        await file.seek(0)  # 파일 포인터 리셋
    
    try:
        # LLM 서비스 호출로 와인 분석
        result = await llm_service.analyze_wine_images(image_files)
        
        return {
            "message": "와인 분석이 완료되었습니다",
            "images_received": len(image_files),
            # "image_info": [
            #     {
            #         "filename": file.filename,
            #         "content_type": file.content_type
            #     }
            #     for file in image_files
            # ],
            "analysis_result": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 중 오류가 발생했습니다: {str(e)}")


@router.post("/wine-taste")
async def wine_taste(request: WineTasteRequest):
    try:
        result = await llm_service.analyze_wine_taste(request)
        return {
            "message": "와인 테이스트가 완료되었습니다",
            "taste_result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"테이스트 중 오류가 발생했습니다: {str(e)}")

    
@router.post("/save")
async def save_diary(
    wineData: str = Form(...),
    drinkDate: str = Form(...),
    rating: str = Form(...),
    review: str = Form(""),
    price: str = Form(""),
    isPublic: str = Form("false"),
    frontImage: Optional[UploadFile] = File(None),
    backImage: Optional[UploadFile] = File(None),
    thumbnailImage: Optional[UploadFile] = File(None),
    downloadImage: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    와인 일기 저장 엔드포인트
    FormData로 전송된 데이터를 처리
    """
    try:
        # JSON 문자열을 파싱
        wine_data = json.loads(wineData)
        
        user_id = current_user.id
        
        diary_data_for_service = {
            "rating": rating,
            "review": review,
            "price": price,
            "is_public": isPublic.lower() == "true"
        }
        
        image_files = {
            "frontImage": frontImage,
            "backImage": backImage,
            "thumbnailImage": thumbnailImage,
            "downloadImage": downloadImage
        }
        
        # Service 계층에서 비즈니스 로직 처리
        result = await diary_service.create_wine_diary(
            db=db,
            user_id=user_id,
            wine_data=wine_data,
            diary_data=diary_data_for_service,
            image_files=image_files
        )
        
        return {
            "message": result["message"],
            "diary_id": result["diary_id"],
            "wine_id": result["wine_id"],
            "diary_data": {
                "wine_data": wine_data,
                "drink_date": drinkDate,
                "rating": int(rating),
                "review": review,
                "price": price,
                "is_public": isPublic.lower() == "true",
                "uploaded_images": result["uploaded_images"]
            }
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="잘못된 JSON 형식의 wineData입니다")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"저장 중 오류가 발생했습니다: {str(e)}")
