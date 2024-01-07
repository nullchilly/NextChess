from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.user import LoginRequest, LoginResponse, UserInGetListUserResponse, GetListUserResponse,\
    GetListGameResponse
from api.app.model import User, Profile, Game
from api.app.model.game_user import GameUser
from api.app.service.user import UserService


class AdminService:
    @classmethod
    def login(cls, db:Session, request:LoginRequest):
        user = db.query(User).filter(User.user_name==request.user_name,
                                     User.deleted_at != None).first()
        if user is None:
            raise HTTPException(status_code=401, detail="Username or password is incorrect")
        if user.password != request.password:
            raise HTTPException(status_code=401, detail="Username or password is incorrect")
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        return LoginResponse(access_token=user.access_token)

    @classmethod
    def delete_account(cls, user: User, db: Session, user_id: int):
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        user = db.query(User).filter(User.id == user_id, User.deleted_at == None).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        db.query(User).filter(User.id == user_id).update({
            "deleted_at": datetime.now()
        })
        db.query(Profile).filter(Profile.user_id == user_id).update({
            "deleted_at": datetime.now()
        })
        db.commit()

    @classmethod
    def get_list_user(cls, user: User, db: Session):
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        q = db.query(Profile)
        res = []
        for profile in q.all():
            res.append(UserInGetListUserResponse(user_id=profile.user_id, name=profile.name, date_of_birth=profile.date_of_birth,
                                                 gender=profile.gender, email=profile.email, user_name=user.user_name, is_admin=user.is_admin))
        return GetListUserResponse(users=res)


    @classmethod
    def delete_game(cls, user: User, db: Session, game_id: int):
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        game = db.query(Game).filter(Game.id == game_id, Game.deleted_at == None).first()
        if game is None:
            raise HTTPException(status_code=404, detail="Game not found")
        db.query(Game).filter(Game.id == game_id).update({
            "deleted_at": datetime.now()
        })
        db.query(GameUser).filter(GameUser.game_id == game_id).update({
            "deleted_at": datetime.now()
        })
        db.commit()

    @classmethod
    def get_list_match(cls, db: Session, user: User):
        if user.is_admin is False:
            raise HTTPException(status_code=403, detail="Forbidden")
        q = db.query(Game).filter(Game.deleted_at == None)
        games = []
        for game in q.all():
            games.append(UserService().get_game_by_id(db, game.id))
        return GetListGameResponse(games=games)

