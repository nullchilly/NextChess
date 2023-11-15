from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpResponse, SignUpRequest, LoginRequest, LoginResponse, ChangePasswordRequest, \
    GetProfileResponse
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
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

@auth_router.post('/change-password', response_model=ResponseSchemaBase)
async def change_password(db: Session = Depends(db_session), *, request: Request):
    access_token = request.headers.get('access_token')
    req_body = await request.json()
    AuthService.change_password(db=db, access_token=access_token, req=ChangePasswordRequest(**req_body))
    return ResponseSchemaBase().success_response()

@auth_router.get('/profile', response_model=DataResponse[GetProfileResponse])
def get_current_user_profile(db: Session = Depends(db_session), *, request: Request):
    access_token = request.headers.get("access_token")
    return DataResponse().success_response(data=AuthService().get_current_user_profile(db, access_token))


