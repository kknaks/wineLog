from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from .wine import Wine, WineData

# Diary Schemas
class DiaryBase(BaseModel):
    wine_id: int
    thumbnail_image: Optional[str] = None
    download_image: Optional[str] = None
    drink_date: Optional[date] = None
    rating: Optional[int] = None  # 1-5 scale
    review: Optional[str] = None
    price: Optional[str] = None
    is_public: bool = False

class DiaryCreate(DiaryBase):
    pass

class DiaryUpdate(BaseModel):
    wine_id: Optional[int] = None
    thumbnail_image: Optional[str] = None
    download_image: Optional[str] = None
    drink_date: Optional[date] = None
    rating: Optional[int] = None
    review: Optional[str] = None
    price: Optional[str] = None
    is_public: Optional[bool] = None

class Diary(DiaryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    wine: Wine
    
    class Config:
        from_attributes = True

# Frontend compatible schemas matching TypeScript interfaces
class DiaryFormData(BaseModel):
    id: Optional[int] = None
    wine_data: WineData  # wineData in TypeScript, matches WineData interface
    thumbnail_image: Optional[str] = None  # thumbnailImage in TS
    download_image: Optional[str] = None   # downloadImage in TS
    drink_date: Optional[str] = None       # drinkDate in TS (string format for frontend)
    rating: Optional[int] = None
    review: Optional[str] = None
    price: Optional[str] = None
    created_at: Optional[datetime] = None  # createdAt in TS
    updated_at: Optional[datetime] = None  # updatedAt in TS
    is_public: Optional[bool] = None       # isPublic in TS

# Legacy schema for backwards compatibility
class WineTasteRequest(BaseModel):
    name: str
    origin: Optional[str] = None
    grape: Optional[str] = None
    year: Optional[str] = None
    type: Optional[str] = None