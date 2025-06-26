from sqlalchemy.orm import Session
from typing import Optional
from models.user import User

class UserService:
    def get_user_by_kakao_id(self, db: Session, kakao_id: str) -> Optional[User]:
        return db.query(User).filter(User.kakao_id == kakao_id).first()
    
    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()
    
    def create_user(self, db: Session, kakao_user_data: dict, refresh_token: str) -> User:
        profile = kakao_user_data.get("kakao_account", {}).get("profile", {})
        
        db_user = User(
            kakao_id=str(kakao_user_data["id"]),
            email=kakao_user_data.get("kakao_account", {}).get("email"),
            nickname=profile.get("nickname"),
            profile_image=profile.get("profile_image_url"),
            refresh_token=refresh_token
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    def update_user_refresh_token(self, db: Session, user: User, refresh_token: str) -> User:
        user.refresh_token = refresh_token
        db.commit()
        db.refresh(user)
        return user