from typing import List

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpResponse, SignUpRequest, LoginRequest, LoginResponse, ChangePasswordRequest, \
    GetProfileResponse, UpdateProfileRequest
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
from api.app.helper.middleware import get_current_user
from api.app.model import User
from api.app.service.auth import AuthService

auth_router = APIRouter()

@auth_router.post('/register', response_model=DataResponse[SignUpResponse])
def register(db: Session = Depends(db_session), *, request: SignUpRequest):
    new_user = AuthService.create_new_user(db, request)
    return DataResponse().success_response(data=new_user)

@auth_router.post('/login', response_model=DataResponse[LoginResponse])
def login(db: Session = Depends(db_session), *, request: LoginRequest):
    return DataResponse().success_response(data=AuthService.verify(db, request))
    pass

@auth_router.post('/password', response_model=ResponseSchemaBase)
async def change_password(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    req_body = await request.json()
    AuthService.change_password(db=db, user=user, req=ChangePasswordRequest(**req_body))
    return ResponseSchemaBase().success_response()

@auth_router.get('/profile', response_model=DataResponse[GetProfileResponse])
def get_current_user_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    return DataResponse().success_response(data=AuthService().get_current_user_profile(db, user))

@auth_router.get('/profile/{id}', response_model=DataResponse[GetProfileResponse])
def get_user_profile_by_id(db: Session = Depends(db_session), *, id: int):
    return DataResponse().success_response(data=AuthService().get_user_profile_by_id(db, id))

@auth_router.post('/profile', response_model=ResponseSchemaBase)
async def update_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    request_body = await request.json()
    AuthService().update_profile(db=db, user=user, request=UpdateProfileRequest(**request_body))
    return ResponseSchemaBase().success_response()

@auth_router.delete('/profile', response_model=ResponseSchemaBase)
async def delete_profile(db: Session = Depends(db_session), *, request: Request, user: User = Depends(get_current_user)):
    req_body = await request.json()
    AuthService().delete_account(user, db, req_body['userId'])
    return ResponseSchemaBase().success_response()


