from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from api.app.dto.core.auth import SignUpResponse, SignUpRequest, LoginRequest
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.helper.db import db_session
from api.app.service.auth import AuthService

auth_router = APIRouter()

@auth_router.post('/register', response_model=DataResponse[SignUpResponse])
def register(db: Session = Depends(db_session), *, request: SignUpRequest):
    new_user = AuthService.create_new_user(db, request)
    return DataResponse().success_response(data=new_user)

@auth_router.post('/login', response_model=ResponseSchemaBase)
async def login(db: Session = Depends(db_session), *, request: Request):
    req_body = await request.json()
    AuthService.verify(db, request.headers.get('access_token'), LoginRequest(**req_body))
    return ResponseSchemaBase().success_response()
    pass
