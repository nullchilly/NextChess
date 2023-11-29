from sqlalchemy import Column, Integer, Boolean, String, ForeignKey
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class PuzzleUser(BareBaseModel):
    __tablename__ = 'puzzle_user'

    puzzle_id = Column(Integer, ForeignKey('puzzle.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    state = Column(Integer, nullable=False)
    gained_rating = Column(Boolean, nullable=False)

    puzzle = relationship('Puzzle')  # Create a relationship with the Puzzle table
    user = relationship('User')  # Create a relationship with the User table
