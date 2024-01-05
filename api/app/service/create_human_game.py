from sqlalchemy.orm import Session
from sqlalchemy import select
from api.app.dto.core.create_human_game import CreateHumanGameRequest
from api.app.model import Game


class CreateHumanGameService:
    @classmethod
    def create_new_human_game(cls, db: Session, request: CreateHumanGameRequest):
        game = Game(variant_id=request.variant,
                    created_at=request.created_at, time_mode=request.time_mode, slug=request.slug,
                    status=False, number_player=request.number_player, result=-1)
        db.add(game)
        db.commit()
        pass
