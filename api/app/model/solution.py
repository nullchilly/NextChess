from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.app.model.base import BareBaseModel

class Solution(BareBaseModel):
    __tablename__ = 'solution'

    puzzle_id = Column(Integer, ForeignKey('puzzle.id'), nullable=False)
    solution = Column(String(1025), nullable=False)