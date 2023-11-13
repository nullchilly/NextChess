from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpRequest, SignUpResponse, UserRole, LoginRequest, ChangePasswordRequest, \
    LoginResponse, GetProfileResponse
from api.app.helper import auth
from api.app.model import User


class AuthService:
    @classmethod
    def create_new_user(cls, db: Session, request: SignUpRequest):
        if cls.existed_user(db, request.user_name):
            print(1)
            return
        token = auth.signJWT(request.user_name)
        user = User(user_name=request.user_name, password=request.password, access_token=token, email=request.email, is_admin=False,
                    name=request.name, gender=request.gender, date_of_birth=request.date_of_birth)
        db.add(user)
        db.commit()
        return SignUpResponse(role=UserRole.USER)

    @classmethod
    def existed_user(cls, db: Session, user_name: str) -> bool:
        return db.query(User).filter(User.user_name==user_name).first() is not None

    @classmethod
    def verify(cls, db: Session, req: LoginRequest) -> LoginResponse:
        user = db.query(User.user_name, User.password, User.access_token).filter(User.user_name == req.user_name).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Username or password not found")
        if user.password != req.password:
            raise HTTPException(status_code=401, detail="Username or password not found")
        return LoginResponse(access_token=user.access_token)

    @classmethod
    def change_password(cls, db: Session, access_token: str, req: ChangePasswordRequest):
        if access_token is None:
            raise HTTPException(status_code=403, detail="Forbidden")
        user_name = auth.decodeJWT(access_token)
        user = db.query(User.user_name, User.password).filter(User.user_name == user_name).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        if req.old_password != user.password:
            raise HTTPException(status_code=401, detail="Password is incorrect")
        db.query(User).filter(User.user_name == user_name).\
            update({"password": req.new_password})
        db.commit()

    def get_current_user_profile(self, db:Session, access_token: str) -> GetProfileResponse:
        if access_token is None:
            raise HTTPException(status_code=403, detail="Forbidden")
        user_name = auth.decodeJWT(access_token)
        user = db.query(User).filter(User.user_name == user_name).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return GetProfileResponse(user_id=user.id, user_name=user.user_name, name=user.name, date_of_birth=user.date_of_birth,
                                  gender=user.gender, email=user.email)


