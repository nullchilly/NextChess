from sqlalchemy import Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class Move(BareBaseModel):
    __tablename__ = 'move'

    game_id = Column(Integer, ForeignKey('game.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    move_detail = Column(String(255), nullable=False)
    time_stamp = Column(DateTime)

    game = relationship('Game')  # Create a relationship with the Game table
    user = relationship('User')  # Create a relationship with the User table
