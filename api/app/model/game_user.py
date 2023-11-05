from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class GameUser(BareBaseModel):
    __tablename__ = 'game_user'

    game_id = Column(Integer, ForeignKey('game.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    win = Column(Integer, nullable=False)

    game = relationship('Game')  # Create a relationship with the Game table
