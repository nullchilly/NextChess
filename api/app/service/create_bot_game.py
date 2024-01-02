from sqlalchemy.orm import Session
from sqlalchemy import select
from api.app.dto.core.create_bot_game import CreateBotGameRequest
from api.app.model import Game


class CreateBotGameService:
    @classmethod
    def create_new_bot_game(cls, db: Session, request: CreateBotGameRequest):
        game = Game(variant_id=request.variant,
                    created_at=request.created_at, time_mode=request.time_mode, slug=request.slug,
                    status=False, result=-1)
        db.add(game)
        db.commit()
        pass

    @classmethod
    def all_game_slugs(cls, db: Session):
        statement = select(Game.slug)
        rows = db.scalars(statement).all()
        return rows
