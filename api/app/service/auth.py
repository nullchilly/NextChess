from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpRequest


class AuthService:
    @classmethod
    def create_new_user(cls, db: Session, request: SignUpRequest):
        
        pass