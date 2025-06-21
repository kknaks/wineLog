from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func
from db.database import Base

class Wine(Base):
    __tablename__ = "wines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    winery = Column(String(255), nullable=True)
    vintage = Column(Integer, nullable=True)
    wine_type = Column(String(100), nullable=True)  # red, white, rose, sparkling, etc.
    region = Column(String(255), nullable=True)
    country = Column(String(100), nullable=True)
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)  # 1-5 scale
    tasting_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Wine(id={self.id}, name='{self.name}', winery='{self.winery}')>" 