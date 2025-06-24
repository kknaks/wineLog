from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Enum
from sqlalchemy.sql import func
from db.database import Base
import enum

class WineType(str, enum.Enum):
    red = "red"
    white = "white"
    sparkling = "sparkling"
    rose = "rose"
    icewine = "icewine"
    natural = "natural"
    dessert = "dessert"

class Wine(Base):
    __tablename__ = "wines"
    
    id = Column(Integer, primary_key=True, index=True)
    front_image = Column(String(500), nullable=True)
    back_image = Column(String(500), nullable=True)
    name = Column(String(255), nullable=False, index=True)
    origin = Column(String(255), nullable=False)
    grape = Column(String(255), nullable=False)
    year = Column(String(4), nullable=False)
    alcohol = Column(String(20), nullable=False)
    type = Column(Enum(WineType), nullable=False)
    aroma_note = Column(Text, nullable=False)
    taste_note = Column(Text, nullable=False)
    finish_note = Column(Text, nullable=False)
    sweetness = Column(Integer, nullable=False)  # 1-5 scale
    acidity = Column(Integer, nullable=False)    # 1-5 scale
    tannin = Column(Integer, nullable=False)     # 1-5 scale
    body = Column(Integer, nullable=False)       # 1-5 scale
    
    def __repr__(self):
        return f"<Wine(id={self.id}, name='{self.name}', origin='{self.origin}')>" 