from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.app.dto.core.user import LoginResponse, LoginRequest, GetListUserResponse, GetListGameResponse
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
from api.app.helper.middleware import get_current_user
from api.app.model import User
from api.app.service.admin import AdminService

admin_router = APIRouter()

@admin_router.post("/login", response_model=DataResponse[LoginResponse])
def login(db: Session = Depends(db_session), *, request: LoginRequest):
    return DataResponse().success_response(data=AdminService().login(db=db, request=request))


@admin_router.get("/users", response_model=DataResponse[GetListUserResponse])
def get_users(db: Session = Depends(db_session), user: User = Depends(get_current_user)):
    return DataResponse().success_response(data=AdminService().get_list_user(user, db))

@admin_router.delete('/profile', response_model=ResponseSchemaBase)
async def delete_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    req_body = await request.json()
    AdminService().delete_account(user, db, req_body['userId'])
    return ResponseSchemaBase().success_response()

@admin_router.get("/game", response_model=DataResponse[GetListGameResponse])
def get_list_game(db: Session = Depends(db_session), user: User = Depends(get_current_user)):
    return DataResponse().success_response(data=AdminService().get_list_match(db, user))

@admin_router.delete('/game', response_model=ResponseSchemaBase)
async def delete_game(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    req_body = await request.json()
    AdminService().delete_game(user, db, req_body['gameId'])
    return ResponseSchemaBase().success_response()

