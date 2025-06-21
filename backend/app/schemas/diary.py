from pydantic import BaseModel
from typing import Optional

class WineTasteRequest(BaseModel):
  name: str
  origin: Optional[str] = None
  grape: Optional[str] = None
  year: Optional[str] = None
  type: Optional[str] = None