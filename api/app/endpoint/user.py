from typing import List

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.app.dto.core.user import SignUpResponse, SignUpRequest, LoginRequest, LoginResponse, ChangePasswordRequest, \
    GetProfileResponse, UpdateProfileRequest, GetUserGameHistoryResponse
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
from api.app.helper.middleware import get_current_user
from api.app.model import User
from api.app.service.user import UserService

user_router = APIRouter()

@user_router.post('/register', response_model=DataResponse[SignUpResponse])
def register(db: Session = Depends(db_session), *, request: SignUpRequest):
    new_user = UserService.create_new_user(db, request)
    return DataResponse().success_response(data=new_user)

@user_router.post('/login', response_model=DataResponse[LoginResponse])
def login(db: Session = Depends(db_session), *, request: LoginRequest):
    return DataResponse().success_response(data=UserService.verify(db, request))
    pass

@user_router.post('/password', response_model=ResponseSchemaBase)
async def change_password(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    req_body = await request.json()
    UserService.change_password(db=db, user=user, req=ChangePasswordRequest(**req_body))
    return ResponseSchemaBase().success_response()

@user_router.get('/profile', response_model=DataResponse[GetProfileResponse])
def get_current_user_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    return DataResponse().success_response(data=UserService().get_current_user_profile(db, user))

@user_router.get('/profile/{id}', response_model=DataResponse[GetProfileResponse])
def get_user_profile_by_id(db: Session = Depends(db_session), *, id: int):
    return DataResponse().success_response(data=UserService().get_user_profile_by_id(db, id))

@user_router.post('/profile', response_model=ResponseSchemaBase)
async def update_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    request_body = await request.json()
    UserService().update_profile(db=db, user=user, request=UpdateProfileRequest(**request_body))
    return ResponseSchemaBase().success_response()

@user_router.get('/game/history', response_model=DataResponse[GetUserGameHistoryResponse])
def get_game_history(db: Session = Depends(db_session), user: User = Depends(get_current_user), *, req: Request):
    return DataResponse().success_response(data=UserService().get_current_user_game_history(db=db, user_id=user.id))

@user_router.get('/game/history/{id}', response_model=DataResponse[GetUserGameHistoryResponse])
def get_game_history(db: Session = Depends(db_session), *, req: Request, id: int):
    return DataResponse().success_response(data=UserService().get_current_user_game_history(db=db, user_id=id))



