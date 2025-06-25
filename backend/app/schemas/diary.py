from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from .wine import Wine, WineData

class WineTasteRequest(BaseModel):
    name: str
    origin: Optional[str] = None
    grape: Optional[str] = None
    year: Optional[str] = None
    type: Optional[str] = None

class WineTasteResult(BaseModel):
    aroma: str
    taste: str
    finish: str
    sweetness: int
    acidity: int
    tannin: int
    body: int

class WineTasteResponse(BaseModel):
    message: str
    data: WineTasteResult

class WineAnalysisResult(BaseModel):
    name: str = Field(default="")
    grape: str = Field(default="")
    origin: str = Field(default="")
    year: str = Field(default="")
    type: str = Field(default="")
    alcohol: str = Field(default="")

class WineAnalysisResponse(BaseModel):
    message: str
    data: WineAnalysisResult