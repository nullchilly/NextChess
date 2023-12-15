import logging
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.user import SignUpRequest, SignUpResponse, UserRole, LoginRequest, ChangePasswordRequest, \
    LoginResponse, GetProfileResponse, UpdateProfileRequest
from api.app.helper import auth
from api.app.model import User
from api.app.model import Profile
from api.app.model.user_rating import UserRating


class UserService:
    @classmethod
    def create_new_user(cls, db: Session, request: SignUpRequest):
        if cls.existed_user(db, request.user_name):
            raise HTTPException(status_code=409, detail="Username existed")
        token = auth.signJWT(request.user_name)
        user = User(user_name=request.user_name, password=request.password, access_token=token, is_admin=False)
        db.add(user)
        # create profile from user
        user = db.query(User).filter(User.user_name == request.user_name).first()
        profile = Profile(
            user_id=user.id,
            email=request.email,
            name=request.name,
            date_of_birth=request.date_of_birth,
            gender=request.gender,
            rating=0,
            country="Viet Nam"
        )
        db.add(profile)
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
        user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        q = db.query(UserRating.rating).filter(UserRating.user_id == user.id)
        ratings = []
        for res in q.all():
            ratings.append(res.rating)
        return GetProfileResponse(name=user_profile.name, date_of_birth=user_profile.date_of_birth,
                                  gender=user_profile.gender, email=user_profile.email,
                                  current_rating=user_profile.rating,ratings=ratings)

    @classmethod
    def get_user_profile_by_id(cls, db: Session, id: int) -> GetProfileResponse:
        user_profile = db.query(Profile).filter(Profile.user_id == id).first()
        if user_profile is None or user_profile.deleted_at is not None:
            raise HTTPException(status_code=404, detail="User not found")
        q = db.query(UserRating.rating).filter(UserRating.user_id == id)
        ratings = []
        for res in q.all():
            ratings.append(res.rating)
        return GetProfileResponse(name=user_profile.name, date_of_birth=user_profile.date_of_birth,
                                  gender=user_profile.gender, email=user_profile.email, current_rating=user_profile.rating,
                                  ratings=ratings)

    @classmethod
    def update_profile(cls, db: Session, user: User, request: UpdateProfileRequest):
        if user is None or user.deleted_at is not None:
            raise HTTPException(status_code=403, detail="Forbidden")
        db.query(Profile).filter(Profile.user_id == user.id).\
                update({
                        "name": request.name,
                        "date_of_birth": request.date_of_birth,
                        "gender": request.gender,
                        "email": request.email
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
        db.query(Profile).filter(Profile.user_id == user_id). \
            update({
            "deleted_at": datetime.now()
        })
        db.commit()
