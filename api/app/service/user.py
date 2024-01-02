import logging
from collections import defaultdict
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from api.app.dto.core.user import SignUpRequest, SignUpResponse, UserRole, LoginRequest, ChangePasswordRequest, \
    LoginResponse, GetProfileResponse, UpdateProfileRequest, RatingInGetProfileResponse, \
    GetUserGameHistoryResponse, GameInGetUserGameHistoryResponse, PuzzleInGetUserPuzzleHistoryResponse, \
    GetUserPuzzleHistoryResponse
from api.app.helper import auth
from api.app.model import User, Game, Move, Puzzle
from api.app.model import Profile
from api.app.model.game_user import GameUser
from api.app.model.puzzle_user import PuzzleUser
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
        q = (db.query(GameUser.user_id, GameUser.rating_change, GameUser.game_id, Game.variant_id, Game.id)
             .join(Game, Game.id == GameUser.game_id).filter(GameUser.user_id == id))
        ratings = []
        rating_by_variant = {}
        for res in q.all():
            rating_by_variant[res.variant_id] = rating_by_variant.get(res.variant_id, 0) + res.rating_change
            ratings.append(
                RatingInGetProfileResponse(rating=rating_by_variant[res.variant_id], variant_id=res.variant_id))
        return GetProfileResponse(user_id=user_profile.id, name=user_profile.name, date_of_birth=user_profile.date_of_birth,
                                  gender=user_profile.gender, email=user_profile.email, ratings=ratings, is_admin=user.is_admin)

    @classmethod
    def get_user_profile_by_id(cls, db: Session, id: int) -> GetProfileResponse:
        user_profile = db.query(Profile).filter(Profile.user_id == id).first()
        user = db.query(User).filter(User.id == id, User.deleted_at == None).first()
        if user_profile is None:
            raise HTTPException(status_code=404, detail="User not found")
        q = (db.query(GameUser.user_id, GameUser.rating_change, GameUser.game_id, Game.variant_id, Game.id)
             .join(Game, Game.id == GameUser.game_id).filter(GameUser.user_id == id))
        ratings = []
        rating_by_variant = {}
        for res in q.all():
            rating_by_variant[res.variant_id] = rating_by_variant.get(res.variant_id, 0) + res.rating_change
            ratings.append(RatingInGetProfileResponse(rating=rating_by_variant[res.variant_id], variant_id=res.variant_id))
        return GetProfileResponse(user_id=id, name=user_profile.name, date_of_birth=user_profile.date_of_birth,
                                  gender=user_profile.gender, email=user_profile.email, ratings=ratings, is_admin=user.is_admin)

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
    def get_current_user_game_history(cls, db: Session, user_id: int):
        move_by_user = db.query(Move).filter(Move.user_id == user_id, Move.deleted_at == None).all()
        move_by_game = defaultdict(list)
        for move in move_by_user:
            move_by_game[move.game_id].append(move.move_detail)


        q = db.query(Game.id.label("game_id"), Game.variant_id, Game.slug, GameUser.win, Game.status, Game.deleted_at, Game.time_mode, GameUser.rating_change)\
            .join(GameUser, Game.id == GameUser.game_id)\
            .filter(GameUser.user_id == user_id, Game.deleted_at == None, GameUser.deleted_at == None)
        res = []
        for game_history in q.all():
            print(game_history.rating_change)
            game_history_resp = GameInGetUserGameHistoryResponse(game_id=game_history.game_id, user_id=user_id, variant_id=game_history.variant_id,
                                                move=move_by_game[game_history.game_id], time_mode=game_history.time_mode,
                                                rating_change=game_history.rating_change, result=game_history.win, slug=game_history.slug)
            res.append(game_history_resp)
        return GetUserGameHistoryResponse(games=res)

    def get_user_game_history(cls, db: Session, user_id: int):
        move_by_user = db.query(Move).filter(Move.user_id == user_id, Move.deleted_at == None).all()
        move_by_game = defaultdict(list)
        for move in move_by_user:
            move_by_game[move.game_id].append(move.move_detail)


        q = db.query(Game.id.label("game_id"), Game.variant_id, Game.slug, GameUser.win, Game.status, Game.deleted_at, Game.time_mode, GameUser.rating_change)\
            .join(GameUser, Game.id == GameUser.game_id)\
            .filter(GameUser.user_id == user_id, Game.deleted_at == None, GameUser.deleted_at == None)
        res = []
        for game_history in q.all():
            game_history_resp = GameInGetUserGameHistoryResponse(game_id=game_history.game_id, variant_id=game_history.variant_id,
                                                move=move_by_game[game_history.game_id], time_mode=game_history.time_mode,
                                                rating_change=game_history.rating_change, result=game_history.win, slug=game_history.slug)
            res.append(game_history_resp)
        return GetUserGameHistoryResponse(games=res)

    def get_user_puzzle_history(cls, db: Session, user_id: int):
        puzzles = db.query(Puzzle).all()
        puzzle_by_user = {}
        q = db.query(PuzzleUser).filter(PuzzleUser.user_id == user_id)
        res = []
        for puzzle in q.all():
            puzzle_by_user[puzzle.puzzle_id] = {
                "rating_change": puzzle.gained_rating,
                "date_solved": puzzle.created_at

            }
        for puzzle in puzzles:
            if puzzle_by_user.get(puzzle.id) is not None:
                date_solved = puzzle_by_user.get(puzzle.id).get("date_solved")
                rating_change = puzzle_by_user.get(puzzle.id).get("rating_change")
                is_solved = True
            else:
                date_solved = None
                rating_change = 0
                is_solved = False
            res.append(PuzzleInGetUserPuzzleHistoryResponse(puzzle_id=puzzle.id, puzzle_name=puzzle.name,
                                                            date_solved=date_solved, rating_change=rating_change, is_solved=is_solved))
        return GetUserPuzzleHistoryResponse(puzzles=res)

