import time
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpRequest, SignUpResponse, UserRole, LoginRequest, ChangePasswordRequest, \
    LoginResponse, GetProfileResponse, UpdateProfileRequest
from api.app.helper import auth
from api.app.model import User


class AuthService:
    @classmethod
    def create_new_user(cls, db: Session, request: SignUpRequest):
        if cls.existed_user(db, request.user_name):
            raise HTTPException(status_code=409, detail="Username existed")
        token = auth.signJWT(request.user_name)
        user = User(user_name=request.user_name, password=request.password, access_token=token, email=request.email, is_admin=False,
                    name=request.name, gender=request.gender, date_of_birth=request.date_of_birth)
        db.add(user)
        db.commit()
        return SignUpResponse(role=UserRole.USER)

    @classmethod
    def existed_user(cls, db: Session, user_name: str) -> bool:
        user = db.query(User).filter(User.user_name == user_name).first()
        return user is not None

    @classmethod
    def verify(cls, db: Session, req: LoginRequest) -> LoginResponse:
        user = db.query(User).filter(User.user_name == req.user_name).first()
        if user is None or user.deleted_at is not None:
            raise HTTPException(status_code=401, detail="Username or password is incorrect")
        if user.password != req.password:
            raise HTTPException(status_code=401, detail="Username or password is incorrect")
        return LoginResponse(access_token=user.access_token)

    @classmethod
    def change_password(cls, db: Session, user: User, req: ChangePasswordRequest):
        if user is None or user.deleted_at is not None:
            raise HTTPException(status_code=403, detail="Forbidden")
        if req.old_password != user.password:
            raise HTTPException(status_code=401, detail="Password is incorrect")
        db.query(User).filter(User.id == user.id).\
            update({"password": req.new_password})
        db.commit()

    @classmethod
    def get_current_user_profile(cls, db: Session, user: User) -> GetProfileResponse:
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return GetProfileResponse(user_id=user.id, user_name=user.user_name, name=user.name, date_of_birth=user.date_of_birth,
                                  gender=user.gender, email=user.email)

    @classmethod
    def get_user_profile_by_id(cls, db: Session, id: int) -> GetProfileResponse:
        user = db.query(User).filter(User.id == id).first()
        if user is None or user.deleted_at is not None:
            raise HTTPException(status_code=404, detail="User not found")
        return GetProfileResponse(user_id=id, user_name=user.user_name, name=user.name, date_of_birth=user.date_of_birth,
                                  gender=user.gender, email=user.email)

    @classmethod
    def update_profile(cls, db: Session, user: User, request: UpdateProfileRequest):
        if user is None or user.deleted_at is not None:
            raise HTTPException(status_code=403, detail="Forbidden")
        db.query(User).filter(User.id == user.id).\
                update({
                        "name": user.name,
                        "date_of_birth": user.date_of_birth,
                        "gender": user.gender,
                        "email": user.email
                })
        db.commit()

    @classmethod
    def delete_account(cls, user: User, db: Session, user_id: int):
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        db.query(User).filter(User.id == user_id). \
            update({
            "deleted_at": datetime.now()
        })
        db.commit()

