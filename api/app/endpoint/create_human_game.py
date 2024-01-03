from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import shortuuid
from datetime import datetime

from fastapi import APIRouter
from api.app.dto.core.create_human_game import CreateHumanGameResponse, CreateHumanGameRequest
from api.app.helper.db import db_session
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.service.create_human_game import CreateHumanGameService


auth_router = APIRouter()

@auth_router.post("/create-human-game", response_model=DataResponse[CreateHumanGameResponse])
async def create_human_game(db: Session = Depends(db_session), *, request: Request):
    req_body = await request.json()
    slug = shortuuid.ShortUUID().random(length=8)
    create_game_request = CreateHumanGameRequest(
        slug=slug,
        variant=1, # Default standard mode
        time_mode=0,
        created_at=datetime.fromtimestamp(req_body['created_at']),
        strength=1, # Could be any number
        number_player=0
    )
    CreateHumanGameService.create_new_human_game(db, request=create_game_request)
    slug_response = CreateHumanGameResponse(slug=slug)
    return DataResponse().success_response(data=slug_response)
