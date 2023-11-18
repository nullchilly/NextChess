from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
import shortuuid
from datetime import datetime

from fastapi import APIRouter
from api.app.dto.core.create_bot_game import CreateBotGameResponse, CreateBotGameRequest
from api.app.helper.db import db_session
from api.app.helper.base_response import DataResponse, ResponseSchemaBase
from api.app.service.create_bot_game import CreateBotGameService

auth_router = APIRouter()


@auth_router.post("/create-bot-game", response_model=DataResponse[CreateBotGameResponse])
async def create_bot_game(db: Session = Depends(db_session), *, request: Request):
    req_body = await request.json()
    slug = shortuuid.ShortUUID().random(length=8)
    create_game_request = CreateBotGameRequest(
        slug=slug, variant=req_body['variant'],
        time_mode=req_body['time_mode'],
        created_at=datetime.fromtimestamp(req_body['created_at']),
        strength=req_body['strength'])
    CreateBotGameService.create_new_bot_game(db, request=create_game_request)
    slug_response = CreateBotGameResponse(slug=slug)
    return DataResponse().success_response(data=slug_response)

@auth_router.get("/all-game-slugs")
async def all_game_slugs(db: Session = Depends(db_session)):
    data = CreateBotGameService.all_game_slugs(db);
    print("DATA: ", data);
    return DataResponse().success_response(data=data);
