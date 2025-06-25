from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Date, BigInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Diary(Base):
    __tablename__ = "diaries"
    
    # 복합 Primary Key
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)  # user_id
    wine_id = Column(Integer, ForeignKey("wines.id"), primary_key=True)  # wine_id
    
    # 이미지 필드들
    frontImage = Column(String(255), nullable=True)
    backImage = Column(String(255), nullable=True)
    thumbnailImage = Column(String(255), nullable=True)
    downloadImage = Column(String(255), nullable=True)
    
    # 일기 데이터
    rating = Column(Integer, nullable=True)
    review = Column(String(255), nullable=True)
    price = Column(Integer, nullable=True)
    isPublic = Column(Boolean, nullable=True)
    createdAt = Column(DateTime(timezone=True), nullable=True)
    updatedAt = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", backref="diaries")
    wine = relationship("Wine", backref="diaries")
    
    def __repr__(self):
        return f"<Diary(id={self.id}, user_id={self.user_id}, wine_id={self.wine_id}, rating={self.rating})>" 