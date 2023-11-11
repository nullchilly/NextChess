from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpRequest, SignUpResponse, UserRole, LoginRequest
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

    @classmethod
    def verify(cls, db: Session, access_token: str, req: LoginRequest):
        user = db.query(User.user_name, User.password, User.access_token).filter(User.user_name==req.user_name).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Username or password not found")
        if user.password != req.password:
            raise HTTPException(status_code=401, detail="Username or password not found")
        if user.access_token != access_token:
            raise HTTPException(status_code=403, detail="Forbidden")



