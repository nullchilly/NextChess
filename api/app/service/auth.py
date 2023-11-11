from sqlalchemy import func
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpRequest, SignUpResponse, UserRole
from api.app.helper import auth
from api.app.model import User


class AuthService:
    @classmethod
    def create_new_user(cls, db: Session, request: SignUpRequest):
        if cls.existed_user(db, request.user_name):
            print(1)
            return
        token = auth.signJWT(request.user_name)
        user = User(user_name=request.user_name, password=request.password, access_token=token, email=request.email, is_admin=False)
        db.add(user)
        db.commit()
        return SignUpResponse(accessToken=token, role=UserRole.USER)

    @classmethod
    def existed_user(cls, db: Session, user_name: str) -> bool:
        return db.query(User).filter(User.user_name==user_name).first() is not None



