from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Dict, Any, Optional
from datetime import datetime
from models.diary import Diary
from models.wine import Wine, WineType


def create_or_get_wine(db: Session, wine_data: Dict[str, Any]) -> Wine:
    """
    와인 데이터로 새 와인을 생성하거나 기존 와인을 조회 (트랜잭션은 상위에서 관리)
    """
    # 동일한 와인이 이미 존재하는지 확인
    existing_wine = db.query(Wine).filter(
        Wine.name == wine_data.get("name", ""),
        Wine.origin == wine_data.get("origin", ""),
        Wine.grape == wine_data.get("grape", ""),
        Wine.year == wine_data.get("year", ""),
        Wine.type == wine_data.get("type", "red")
    ).first()
    
    if existing_wine:
        return existing_wine
    
    # 새 와인 생성 (commit은 하지 않음)
    wine = Wine(
        name=wine_data.get("name", ""),
        origin=wine_data.get("origin", ""),
        grape=wine_data.get("grape", ""),
        year=wine_data.get("year", ""),
        alcohol=wine_data.get("alcohol", ""),
        type=WineType(wine_data.get("type", "red")),
        aroma_note=wine_data.get("aromaNote", ""),
        taste_note=wine_data.get("tasteNote", ""),
        finish_note=wine_data.get("finishNote", ""),
        sweetness=int(wine_data.get("sweetness", 50)),
        acidity=int(wine_data.get("acidity", 50)),
        tannin=int(wine_data.get("tannin", 50)),
        body=int(wine_data.get("body", 50))
    )
    
    db.add(wine)
    db.flush()  # ID 생성을 위해 flush (commit은 아님)
    return wine


def create_diary(
    db: Session,
    user_id: int,
    wine_id: int,
    diary_data: Dict[str, Any],
    image_urls: Dict[str, str]
) -> Diary:
    """
    새로운 와인 일기를 생성 (순수 DB 작업만, 트랜잭션은 service에서 관리)
    """
    # 새로운 일기 ID 생성 (해당 user의 최대 ID + 1)
    max_diary_id = db.query(Diary).filter(Diary.user_id == user_id).count()
    new_diary_id = max_diary_id + 1
    
    # 일기 생성
    diary = Diary(
        id=new_diary_id,
        user_id=user_id,
        wine_id=wine_id,
        frontImage=image_urls.get("frontImage"),
        backImage=image_urls.get("backImage"),
        thumbnailImage=image_urls.get("thumbnailImage"),
        downloadImage=image_urls.get("downloadImage"),
        rating=int(diary_data.get("rating", 0)),
        review=diary_data.get("review", ""),
        price=int(diary_data.get("price", 0)) if diary_data.get("price") else None,
        isPublic=diary_data.get("is_public", False),
        createdAt=datetime.now(),
        updatedAt=datetime.now()
    )
    
    db.add(diary)
    return diary


def get_diary_by_id(db: Session, user_id: int, diary_id: int) -> Optional[Diary]:
    """
    특정 사용자의 일기를 ID로 조회
    """
    return db.query(Diary).filter(
        Diary.user_id == user_id,
        Diary.id == diary_id
    ).first()


def get_user_diaries(db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list[Diary]:
    """
    사용자의 모든 일기 목록 조회
    """
    return db.query(Diary).filter(
        Diary.user_id == user_id
    ).offset(skip).limit(limit).all()


def update_diary(
    db: Session,
    user_id: int,
    diary_id: int,
    update_data: Dict[str, Any]
) -> Optional[Diary]:
    """
    일기 정보 업데이트 (순수 DB 작업만, 트랜잭션은 service에서 관리)
    """
    diary = get_diary_by_id(db, user_id, diary_id)
    if not diary:
        return None
    
    # 업데이트할 필드들
    for field, value in update_data.items():
        if hasattr(diary, field):
            setattr(diary, field, value)
    
    diary.updatedAt = datetime.now()
    return diary


def delete_diary(db: Session, user_id: int, diary_id: int) -> bool:
    """
    일기 삭제 (순수 DB 작업만, 트랜잭션은 service에서 관리)
    """
    diary = get_diary_by_id(db, user_id, diary_id)
    if not diary:
        return False
    
    db.delete(diary)
    return True


def get_public_diaries(db: Session, skip: int = 0, limit: int = 20) -> list[Diary]:
    """
    공개된 일기 목록 조회
    """
    return db.query(Diary).filter(
        Diary.isPublic == True
    ).offset(skip).limit(limit).all()
