from sqlalchemy.orm import Session
from api.app.model import GameUser
from api.app.dto.core.insert_game_user import InsertGameUserRequest
from api.app.helper.db import db_session

async def insert_game_user(db: Session, request: InsertGameUserRequest):
  game_user = GameUser(
    game_id=request.game_id,
    user_id=request.user_id,
    win=request.win,
    rating_change=request.rating_change,
  )
  db.add(game_user)
  db.commit()
  pass
