from sqlalchemy import Column, DateTime, Integer, String
from api.app.model.base import BareBaseModel

class Puzzle(BareBaseModel):
    __tablename__ = 'puzzle'

    name = Column(String(255), nullable=False)
    position = Column(String(50), nullable=False)
    rating = Column(Integer)
