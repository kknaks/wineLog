from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Diary(Base):
    __tablename__ = "diaries"
    
    id = Column(Integer, primary_key=True, index=True)
    wine_id = Column(Integer, ForeignKey("wines.id"), nullable=False)
    thumbnail_image = Column(String(500), nullable=True)
    download_image = Column(String(500), nullable=True)
    drink_date = Column(Date, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5 scale
    review = Column(Text, nullable=True)
    price = Column(String(50), nullable=True)
    is_public = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    wine = relationship("Wine", backref="diaries")
    
    def __repr__(self):
        return f"<Diary(id={self.id}, wine_id={self.wine_id}, rating={self.rating})>" 