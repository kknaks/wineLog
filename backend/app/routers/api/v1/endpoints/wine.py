from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models.wine import Wine

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_wines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """모든 와인 목록 조회"""
    wines = db.query(Wine).offset(skip).limit(limit).all()
    return [
        {
            "id": wine.id,
            "name": wine.name,
            "winery": wine.winery,
            "vintage": wine.vintage,
            "wine_type": wine.wine_type,
            "region": wine.region,
            "country": wine.country,
            "price": wine.price,
            "rating": wine.rating,
            "tasting_notes": wine.tasting_notes,
            "created_at": wine.created_at,
            "updated_at": wine.updated_at
        }
        for wine in wines
    ]

@router.get("/{wine_id}")
def get_wine(wine_id: int, db: Session = Depends(get_db)):
    """특정 와인 정보 조회"""
    wine = db.query(Wine).filter(Wine.id == wine_id).first()
    if not wine:
        raise HTTPException(status_code=404, detail="Wine not found")
    
    return {
        "id": wine.id,
        "name": wine.name,
        "winery": wine.winery,
        "vintage": wine.vintage,
        "wine_type": wine.wine_type,
        "region": wine.region,
        "country": wine.country,
        "price": wine.price,
        "rating": wine.rating,
        "tasting_notes": wine.tasting_notes,
        "created_at": wine.created_at,
        "updated_at": wine.updated_at
    }

@router.post("/")
def create_wine(wine_data: dict, db: Session = Depends(get_db)):
    """새 와인 추가"""
    try:
        wine = Wine(**wine_data)
        db.add(wine)
        db.commit()
        db.refresh(wine)
        return {"message": "Wine created successfully", "wine_id": wine.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 