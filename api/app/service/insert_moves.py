from sqlalchemy.orm import Session
from sqlalchemy import select
from api.app.model import Move
from datetime import datetime
from api.app.dto.core.insert_moves import InsertMoveRequest
from fastapi import Depends
from api.app.helper.db import db_session
from api.app.model import Game


async def insert_game_move(db: Session, request: InsertMoveRequest):
  for move_detail in request.move_details:
    move = Move(game_id=request.game_id, user_id=request.user_id, move_detail=move_detail,
                time_stamp=datetime.now())
    db.add(move)
  db.commit()
  pass

async def get_game_id_from_slug(db: Session, slug: str):
  statement = select(Game.id).where(Game.slug == slug)
  row = db.scalars(statement).one();
  return row;