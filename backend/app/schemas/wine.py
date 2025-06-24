from pydantic import BaseModel
from typing import Optional
from enum import Enum

class WineType(str, Enum):
    red = "red"
    white = "white"
    sparkling = "sparkling"
    rose = "rose"
    icewine = "icewine"
    natural = "natural"
    dessert = "dessert"

class WineBase(BaseModel):
    front_image: Optional[str] = None
    back_image: Optional[str] = None
    name: str
    origin: str
    grape: str
    year: str
    alcohol: str
    type: WineType
    aroma_note: str
    taste_note: str
    finish_note: str
    sweetness: int  # 1-5 scale
    acidity: int    # 1-5 scale
    tannin: int     # 1-5 scale
    body: int       # 1-5 scale

class WineCreate(WineBase):
    pass

class WineUpdate(BaseModel):
    front_image: Optional[str] = None
    back_image: Optional[str] = None
    name: Optional[str] = None
    origin: Optional[str] = None
    grape: Optional[str] = None
    year: Optional[str] = None
    alcohol: Optional[str] = None
    type: Optional[WineType] = None
    aroma_note: Optional[str] = None
    taste_note: Optional[str] = None
    finish_note: Optional[str] = None
    sweetness: Optional[int] = None
    acidity: Optional[int] = None
    tannin: Optional[int] = None
    body: Optional[int] = None

class Wine(WineBase):
    id: int
    
    class Config:
        from_attributes = True

# TypeScript WineData와 호환되는 스키마
class WineData(BaseModel):
    id: int
    front_image: Optional[str] = None  # frontImage in TS
    back_image: Optional[str] = None   # backImage in TS
    name: str
    origin: str
    grape: str
    year: str
    alcohol: str
    type: WineType
    aroma_note: str  # aromaNote in TS
    taste_note: str  # tasteNote in TS
    finish_note: str # finishNote in TS
    sweetness: int
    acidity: int
    tannin: int
    body: int
    
    class Config:
        from_attributes = True 